#!/usr/bin/env node
import process from 'node:process';
import { analyzeSessionStore } from '../src/session-store-analyzer.mjs';

function printUsage() {
  console.error(`Usage:
  node tools/verify-readonly.mjs <session-store-dir> [--fail-on-warning]

Examples:
  node tools/verify-readonly.mjs examples/mock-session-store
  node tools/verify-readonly.mjs examples/mock-session-store --fail-on-warning

This tool is read-only. It does not write, delete, repair, or rename files.`);
}

const args = process.argv.slice(2);
const targetDir = args.find((arg) => !arg.startsWith('--'));
const failOnWarning = args.includes('--fail-on-warning');

if (!targetDir || args.includes('--help') || args.includes('-h')) {
  printUsage();
  process.exit(targetDir ? 0 : 2);
}

const report = analyzeSessionStore(targetDir);
console.log(JSON.stringify(report, null, 2));

if (!report.ok) {
  process.exit(1);
}

if (failOnWarning && report.summary?.warnings > 0) {
  process.exit(1);
}
