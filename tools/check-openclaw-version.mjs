#!/usr/bin/env node
import process from 'node:process';
import { createLogger } from '../src/logger.mjs';

const DEFAULT_API = 'https://api.github.com';

function usage() {
  console.error(`Usage:
  node tools/check-openclaw-version.mjs --repo <owner/name> --current <version> [options]

Options:
  --repo <owner/name>       Upstream GitHub repository to inspect.
  --current <version>       Current local OpenClaw version/tag.
  --api <url>               GitHub API base URL. Defaults to https://api.github.com.
  --log-file <path>         Write structured JSONL logs to a file.
  --log-level <level>       Log level: debug, info, warning, error.
  -h, --help                Show this help.

Examples:
  node tools/check-openclaw-version.mjs --repo owner/OpenClaw --current 2026.6.8
  node tools/check-openclaw-version.mjs --repo owner/OpenClaw --current 2026.6.8 --log-file logs/stabilizer.log

This command is advisory only. It never installs, updates, patches, or modifies OpenClaw.`);
}

function readOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value.`);
  }
  return value;
}

function normalizeVersion(value) {
  return String(value || '').trim().replace(/^v/i, '');
}

function compareSemverLike(a, b) {
  const left = normalizeVersion(a).split(/[.-]/).map((part) => Number.parseInt(part, 10));
  const right = normalizeVersion(b).split(/[.-]/).map((part) => Number.parseInt(part, 10));
  const length = Math.max(left.length, right.length);
  for (let i = 0; i < length; i += 1) {
    const l = Number.isFinite(left[i]) ? left[i] : 0;
    const r = Number.isFinite(right[i]) ? right[i] : 0;
    if (l > r) return 1;
    if (l < r) return -1;
  }
  return 0;
}

async function fetchLatestRelease(apiBase, repo) {
  const url = `${apiBase.replace(/\/$/, '')}/repos/${repo}/releases/latest`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'openclaw-runtime-stabilizer-version-check',
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub release lookup failed: HTTP ${response.status} ${text.slice(0, 200)}`);
  }

  return response.json();
}

const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  usage();
  process.exit(0);
}

try {
  const logger = createLogger({
    logFile: readOption(args, '--log-file'),
    level: readOption(args, '--log-level') || 'info',
    console: false,
  });

  const repo = readOption(args, '--repo') || process.env.OPENCLAW_UPSTREAM_REPO;
  const current = readOption(args, '--current') || process.env.OPENCLAW_CURRENT_VERSION;
  const api = readOption(args, '--api') || process.env.GITHUB_API_URL || DEFAULT_API;

  if (!repo || !current) {
    usage();
    process.exit(2);
  }

  logger.info('version check started', { repo, current, api });
  const latest = await fetchLatestRelease(api, repo);
  const latestTag = latest.tag_name || latest.name || '';
  const comparison = compareSemverLike(current, latestTag);
  const status = comparison < 0 ? 'behind' : comparison === 0 ? 'current' : 'ahead-or-custom';

  const result = {
    ok: true,
    advisoryOnly: true,
    repo,
    current,
    latest: latestTag,
    status,
    releaseName: latest.name || null,
    publishedAt: latest.published_at || null,
    note: 'This tool reports version drift only. It does not install or modify OpenClaw.',
  };

  logger.info('version check completed', result);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  try {
    const logger = createLogger({
      logFile: readOption(process.argv.slice(2), '--log-file'),
      level: readOption(process.argv.slice(2), '--log-level') || 'info',
      console: false,
    });
    logger.error('version check failed', { error });
  } catch {
    // Keep original error visible.
  }
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
