#!/usr/bin/env node
import process from 'node:process';
import fs from 'node:fs';
import { analyzeSessionStore } from '../src/session-store-analyzer.mjs';
import { createLogger } from '../src/logger.mjs';

function printUsage() {
  console.error(`Usage:
  node tools/verify-readonly.mjs <session-store-dir> [options]

Options:
  --fail-on-warning                 Exit non-zero when warnings are present.
  --large-file-bytes <bytes>        Mark files at/above this size as large-file mode.
  --max-jsonl-line-bytes <bytes>    Skip deep validation for JSONL lines above this size.
  --log-file <path>                 Write structured JSONL logs to a file.
  --log-level <level>               Log level: debug, info, warning, error.
  --self-check                      Verify that this CLI can start on the current Node runtime.
  -h, --help                        Show this help.

Examples:
  npm run verify:mock
  npm run verify -- examples/mock-session-store
  npm run verify -- examples/mock-session-store -- --log-file logs/stabilizer.log
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

function readStringOption(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) {
    throw new Error(`${name} requires a value.`);
  }
  return value;
}

function runSelfCheck(logger) {
  const major = Number(process.versions.node.split('.')[0]);
  if (!Number.isFinite(major) || major < 20) {
    const payload = { ok: false, message: 'Node.js 20 or newer is required.' };
    logger.error('self-check failed', payload);
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }

  const requiredFiles = [
    'src/session-store-analyzer.mjs',
    'src/logger.mjs',
    'tools/verify-readonly.mjs',
    'examples/mock-session-store/sessions.json',
  ];

  const missing = requiredFiles.filter((file) => !fs.existsSync(file));
  if (missing.length > 0) {
    const payload = { ok: false, missing };
    logger.error('self-check failed', payload);
    console.error(JSON.stringify(payload, null, 2));
    process.exit(1);
  }

  const payload = { ok: true, node: process.version, checkedFiles: requiredFiles };
  logger.info('self-check passed', payload);
  console.log(JSON.stringify(payload, null, 2));
}

const args = process.argv.slice(2);

try {
  const logger = createLogger({
    logFile: readStringOption(args, '--log-file'),
    level: readStringOption(args, '--log-level') || 'info',
    console: false,
  });

  if (args.includes('--self-check')) {
    runSelfCheck(logger);
    process.exit(0);
  }

  const targetDir = args.find((arg, index) => {
    if (arg.startsWith('--')) return false;
    const previous = args[index - 1];
    return !['--large-file-bytes', '--max-jsonl-line-bytes', '--log-file', '--log-level'].includes(previous);
  });

  if (!targetDir || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(targetDir ? 0 : 2);
  }

  const failOnWarning = args.includes('--fail-on-warning');
  const options = {
    largeFileBytes: readNumberOption(args, '--large-file-bytes'),
    maxJsonlLineBytes: readNumberOption(args, '--max-jsonl-line-bytes'),
  };

  logger.info('verification started', { targetDir, options, failOnWarning });
  const report = await analyzeSessionStore(targetDir, options);
  logger.info('verification completed', {
    targetDir,
    ok: report.ok,
    summary: report.summary,
  });

  console.log(JSON.stringify(report, null, 2));

  if (!report.ok) {
    process.exit(1);
  }

  if (failOnWarning && report.summary?.warnings > 0) {
    process.exit(1);
  }
} catch (error) {
  try {
    const logger = createLogger({
      logFile: readStringOption(process.argv.slice(2), '--log-file'),
      level: readStringOption(process.argv.slice(2), '--log-level') || 'info',
      console: false,
    });
    logger.error('verification failed', { error });
  } catch {
    // Avoid masking the original CLI error.
  }
  console.error(JSON.stringify({ ok: false, error: error.message }, null, 2));
  process.exit(1);
}
