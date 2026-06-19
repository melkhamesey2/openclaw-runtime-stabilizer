#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { analyzeSessionStore } from '../src/session-store-analyzer.mjs';

function usage() {
  console.error(`Usage:
  node tools/generate-markdown-report.mjs <session-store-dir> <output-md>

Examples:
  npm run report:mock
  node tools/generate-markdown-report.mjs examples/mock-session-store reports/mock-session-store-report.md

This report generator reads the supplied fixture and writes a Markdown report file.`);
}

function escapeTable(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function severityRank(severity) {
  if (severity === 'error') return 0;
  if (severity === 'warning') return 1;
  return 2;
}

function renderReport(report, targetDir) {
  const findings = [...report.findings].sort((a, b) => {
    const severityDelta = severityRank(a.severity) - severityRank(b.severity);
    if (severityDelta !== 0) return severityDelta;
    return String(a.code).localeCompare(String(b.code));
  });

  const lines = [];
  lines.push('# OpenClaw Session Store Read-only Report');
  lines.push('');
  lines.push(`Target: \`${targetDir}\``);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push('| Metric | Value |');
  lines.push('|---|---:|');
  for (const [key, value] of Object.entries(report.summary || {})) {
    lines.push(`| ${escapeTable(key)} | ${escapeTable(value)} |`);
  }
  lines.push('');
  lines.push('## Findings');
  lines.push('');

  if (findings.length === 0) {
    lines.push('No findings were reported.');
  } else {
    lines.push('| Severity | Code | Subject | Message |');
    lines.push('|---|---|---|---|');
    for (const finding of findings) {
      const subject = finding.key || finding.transcriptPath || finding.trajectoryPath || finding.title || '';
      lines.push(
        `| ${escapeTable(finding.severity)} | ${escapeTable(finding.code)} | ${escapeTable(subject)} | ${escapeTable(finding.message)} |`,
      );
    }
  }

  lines.push('');
  lines.push('## Transcript inventory');
  lines.push('');
  if (!report.transcriptStats || report.transcriptStats.length === 0) {
    lines.push('No transcript files were inspected.');
  } else {
    lines.push('| Session | Transcript | Lines | Bytes | Mode | Parse errors | Oversized lines |');
    lines.push('|---|---|---:|---:|---|---:|---:|');
    for (const item of report.transcriptStats) {
      lines.push(
        `| ${escapeTable(item.key)} | ${escapeTable(item.transcriptPath)} | ${escapeTable(item.lines)} | ${escapeTable(item.bytes)} | ${escapeTable(item.mode)} | ${escapeTable(item.parseErrors)} | ${escapeTable(item.oversizedLines)} |`,
      );
    }
  }

  lines.push('');
  lines.push('## Safe next steps');
  lines.push('');
  lines.push('- Preserve the original session directory before any manual repair.');
  lines.push('- Inspect registry entries and transcript files separately.');
  lines.push('- Treat orphaned keys, missing transcript paths, and duplicate titles as triage signals, not deletion instructions.');
  lines.push('- Do not run destructive cleanup based only on this report.');
  lines.push('');
  lines.push('## Do not do');
  lines.push('');
  lines.push('- Do not delete transcript files while investigating registry drift.');
  lines.push('- Do not rewrite live session state without a verified backup.');
  lines.push('- Do not publish raw local paths, private logs, tokens, or transcripts.');
  lines.push('');

  return `${lines.join('\n')}\n`;
}

const [targetDir, outputFile] = process.argv.slice(2);
if (!targetDir || !outputFile || process.argv.includes('-h') || process.argv.includes('--help')) {
  usage();
  process.exit(targetDir && outputFile ? 0 : 2);
}

try {
  const report = await analyzeSessionStore(targetDir);
  const markdown = renderReport(report, targetDir);
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, markdown, 'utf8');
  console.log(JSON.stringify({ ok: true, outputFile }, null, 2));
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
