#!/usr/bin/env node
import process from 'node:process';
import fs from 'node:fs';
import { analyzeSessionStore } from '../src/session-store-analyzer.mjs';

function printUsage() {
  console.error(`Usage:
  node tools/verify-readonly.mjs <session-store-dir> [options]

Options:
  --fail-on-warning                 Exit non-zero when warnings are present.
  --large-file-bytes <bytes>        Mark files at/above this size as large-file mode.
  --max-jsonl-line-bytes <bytes>    Skip deep validation for JSONL lines above this size.
  --self-check                      Verify that this CLI can start on the current Node runtime.
  -h, --help                        Show this help.

Examples:
  npm run verify:mock
  npm run verify -- examples/mock-session-store
  node tools/verify-readonly.mjs examples/mock-session-store --large-file-bytes 1048576

This verifier is read-only. It reports findings without changing source data.`);
}

function readNumberOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = Number(args[index + 1]);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} requires a positive numeric byte value.`);
  }
  return value;
}

function runSelfCheck() {
  const major = Number(process.versions.node.split('.')[0]);
  if (!Number.isFinite(major) || major < 20) {
    console.error(JSON.stringify({ ok: false, message: 'Node.js 20 or newer is required.' }, null, 2));
    process.exit(1);
  }

  const requiredFiles = [
    'src/session-store-analyzer.mjs',
    'tools/verify-readonly.mjs',
    'examples/mock-session-store/sessions.json',
  ];

  const missing = requiredFiles.filter((file) => !fs.existsSync(file));
  if (missing.length > 0) {
    console.error(JSON.stringify({ ok: false, missing }, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify({ ok: true, node: process.version, checkedFiles: requiredFiles }, null, 2));
}

const args = process.argv.slice(2);

if (args.includes('--self-check')) {
  runSelfCheck();
  process.exit(0);
}

const targetDir = args.find((arg, index) => {
  if (arg.startsWith('--')) return false;
  const previous = args[index - 1];
  return previous !== '--large-file-bytes' && previous !== '--max-jsonl-line-bytes';
});

if (!targetDir || args.includes('--help') || args.includes('-h')) {
  printUsage();
  process.exit(targetDir ? 0 : 2);
}

try {
  const failOnWarning = args.includes('--fail-on-warning');
  const options = {
    largeFileBytes: readNumberOption(args, '--large-file-bytes'),
    maxJsonlLineBytes: readNumberOption(args, '--max-jsonl-line-bytes'),
  };

  const report = await analyzeSessionStore(targetDir, options);
  console.log(JSON.stringify(report, null, 2));

  if (!report.ok) {
    process.exit(1);
  }

  if (failOnWarning && report.summary?.warnings > 0) {
    process.exit(1);
  }
} catch (error) {
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
