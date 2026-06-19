import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function safeJsonParse(text, label) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error: `${label}: ${error.message}` };
  }
}

function sha256File(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}

function listFilesRecursive(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const full = path.join(root, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function countJsonlLines(filePath) {
  const text = readText(filePath).trim();
  if (!text) return { lines: 0, parseErrors: 0 };
  let parseErrors = 0;
  const lines = text.split(/\r?\n/).filter(Boolean);
  for (let i = 0; i < lines.length; i += 1) {
    try {
      JSON.parse(lines[i]);
    } catch {
      parseErrors += 1;
    }
  }
  return { lines: lines.length, parseErrors };
}

function normalizeTranscriptPath(root, value) {
  if (!value || typeof value !== 'string') return null;
  const candidate = path.isAbsolute(value) ? value : path.join(root, value);
  return path.normalize(candidate);
}

function collectStoreEntries(store) {
  if (!store || typeof store !== 'object' || Array.isArray(store)) return [];
  return Object.entries(store).map(([key, value]) => ({
    key,
    value: value && typeof value === 'object' ? value : {},
  }));
}

export function analyzeSessionStore(rootDir) {
  const root = path.resolve(rootDir);
  const sessionsPath = path.join(root, 'sessions.json');
  const findings = [];

  if (!fs.existsSync(root)) {
    return {
      ok: false,
      root,
      findings: [{ severity: 'error', code: 'ROOT_MISSING', message: 'Root directory does not exist.' }],
      summary: {},
    };
  }

  if (!fs.existsSync(sessionsPath)) {
    return {
      ok: false,
      root,
      findings: [{ severity: 'error', code: 'SESSIONS_JSON_MISSING', message: 'sessions.json was not found.' }],
      summary: {},
    };
  }

  const parsed = safeJsonParse(readText(sessionsPath), 'sessions.json');
  if (!parsed.ok) {
    return {
      ok: false,
      root,
      findings: [{ severity: 'error', code: 'SESSIONS_JSON_INVALID', message: parsed.error }],
      summary: {},
    };
  }

  const entries = collectStoreEntries(parsed.value);
  const allFiles = listFilesRecursive(root);
  const jsonlFiles = allFiles.filter((file) => file.endsWith('.jsonl'));
  const baseJsonl = new Set(jsonlFiles.filter((file) => !file.endsWith('.trajectory.jsonl')).map((file) => path.normalize(file)));
  const trajectoryJsonl = jsonlFiles.filter((file) => file.endsWith('.trajectory.jsonl'));

  const titleToKeys = new Map();
  const referencedTranscripts = new Set();
  const transcriptStats = [];

  for (const { key, value } of entries) {
    const title = value.title || value.name || value.displayName || '(untitled)';
    if (!titleToKeys.has(title)) titleToKeys.set(title, []);
    titleToKeys.get(title).push(key);

    if (key.startsWith('orphaned:') || String(value.sessionKey || '').startsWith('orphaned:')) {
      findings.push({
        severity: 'warning',
        code: 'ORPHANED_SESSION_KEY',
        key,
        message: 'Session registry contains an orphaned-prefixed key or sessionKey.',
      });
    }

    if (value.sessionKey && String(value.sessionKey) !== key) {
      findings.push({
        severity: 'info',
        code: 'SESSION_KEY_MISMATCH',
        key,
        sessionKey: String(value.sessionKey),
        message: 'Registry key and stored sessionKey differ. Confirm whether this is an alias or drift.',
      });
    }

    const transcriptValue = value.transcriptPath || value.file || value.filePath || value.path;
    const transcriptPath = normalizeTranscriptPath(root, transcriptValue);
    if (transcriptPath) {
      referencedTranscripts.add(transcriptPath);
      if (!fs.existsSync(transcriptPath)) {
        findings.push({
          severity: 'warning',
          code: 'MISSING_TRANSCRIPT_FILE',
          key,
          transcriptPath: path.relative(root, transcriptPath),
          message: 'Registry points to a transcript file that does not exist.',
        });
      } else {
        const stat = fs.statSync(transcriptPath);
        const lineInfo = countJsonlLines(transcriptPath);
        transcriptStats.push({
          key,
          transcriptPath: path.relative(root, transcriptPath),
          bytes: stat.size,
          lines: lineInfo.lines,
          parseErrors: lineInfo.parseErrors,
          sha256: sha256File(transcriptPath),
        });
        if (stat.size <= 8 || lineInfo.lines === 0) {
          findings.push({
            severity: 'warning',
            code: 'EMPTY_OR_TINY_TRANSCRIPT',
            key,
            transcriptPath: path.relative(root, transcriptPath),
            message: 'Transcript exists but is empty or very small.',
          });
        }
        if (lineInfo.parseErrors > 0) {
          findings.push({
            severity: 'warning',
            code: 'JSONL_PARSE_ERRORS',
            key,
            transcriptPath: path.relative(root, transcriptPath),
            parseErrors: lineInfo.parseErrors,
            message: 'Transcript contains JSONL lines that do not parse cleanly.',
          });
        }
      }
    } else {
      findings.push({
        severity: 'info',
        code: 'NO_TRANSCRIPT_REFERENCE',
        key,
        message: 'Registry entry does not declare a transcript path field recognized by this analyzer.',
      });
    }
  }

  for (const [title, keys] of titleToKeys.entries()) {
    if (title !== '(untitled)' && keys.length > 1) {
      findings.push({
        severity: 'info',
        code: 'DUPLICATE_DISPLAY_TITLE',
        title,
        keys,
        message: 'Multiple registry entries share the same display title. This can be normal, but may confuse dashboard review.',
      });
    }
  }

  for (const file of baseJsonl) {
    if (!referencedTranscripts.has(file)) {
      findings.push({
        severity: 'info',
        code: 'UNREFERENCED_TRANSCRIPT_FILE',
        transcriptPath: path.relative(root, file),
        message: 'Transcript exists on disk but is not referenced by sessions.json.',
      });
    }
  }

  for (const file of trajectoryJsonl) {
    const baseCandidate = file.replace(/\.trajectory\.jsonl$/, '.jsonl');
    if (!baseJsonl.has(baseCandidate)) {
      findings.push({
        severity: 'info',
        code: 'TRAJECTORY_WITHOUT_BASE_TRANSCRIPT',
        trajectoryPath: path.relative(root, file),
        message: 'Trajectory file exists without a matching base transcript file.',
      });
    }
  }

  const errorCount = findings.filter((finding) => finding.severity === 'error').length;
  const warningCount = findings.filter((finding) => finding.severity === 'warning').length;

  return {
    ok: errorCount === 0,
    root,
    summary: {
      registryEntries: entries.length,
      jsonlFiles: jsonlFiles.length,
      baseTranscripts: baseJsonl.size,
      trajectoryFiles: trajectoryJsonl.length,
      referencedTranscripts: referencedTranscripts.size,
      errors: errorCount,
      warnings: warningCount,
      findings: findings.length,
    },
    transcriptStats,
    findings,
  };
}
