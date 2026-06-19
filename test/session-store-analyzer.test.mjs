import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { analyzeSessionStore } from '../src/session-store-analyzer.mjs';

const repoRoot = process.cwd();

function fixturePath(name) {
  return path.join(repoRoot, 'examples', name);
}

function findingCodes(report) {
  return new Set(report.findings.map((finding) => finding.code));
}

test('clean fixture has no findings', async () => {
  const report = await analyzeSessionStore(fixturePath('clean-session-store'));

  assert.equal(report.ok, true);
  assert.equal(report.summary.errors, 0);
  assert.equal(report.summary.warnings, 0);
  assert.equal(report.summary.findings, 0);
  assert.equal(report.summary.registryEntries, 2);
  assert.equal(report.transcriptStats.length, 2);
});

test('mock fixture matches golden finding expectations', async () => {
  const report = await analyzeSessionStore(fixturePath('mock-session-store'));
  const expected = JSON.parse(
    fs.readFileSync(path.join(fixturePath('mock-session-store'), 'expected-report.json'), 'utf8'),
  );
  const codes = findingCodes(report);

  for (const code of expected.expectedFindingCodes) {
    assert.equal(codes.has(code), true, `expected finding code ${code}`);
  }

  assert.equal(report.summary.registryEntries, expected.minimumSummary.registryEntries);
  assert.ok(report.summary.warnings >= expected.minimumSummary.warnings);
  assert.ok(report.summary.findings >= expected.minimumSummary.findings);
});

test('malformed JSONL fixture reports parse errors', async () => {
  const report = await analyzeSessionStore(fixturePath('malformed-session-store'));
  const codes = findingCodes(report);

  assert.equal(report.ok, true);
  assert.equal(codes.has('JSONL_PARSE_ERRORS'), true);
  assert.equal(report.summary.warnings, 1);
});

test('bounded large-line fixture reports oversized JSONL line and streaming mode', async () => {
  const report = await analyzeSessionStore(fixturePath('mock-large-session-store'), {
    largeFileBytes: 1,
    maxJsonlLineBytes: 40,
  });
  const codes = findingCodes(report);

  assert.equal(report.ok, true);
  assert.equal(codes.has('OVERSIZED_JSONL_LINES_SKIPPED'), true);
  assert.equal(report.transcriptStats[0].mode, 'streaming-large-file');
  assert.equal(report.transcriptStats[0].oversizedLines, 1);
});
