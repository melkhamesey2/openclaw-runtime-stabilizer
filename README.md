# OpenClaw Runtime Stabilizer

![Documentation, Test, and Read-only Verification Check](https://github.com/melkhamesey2/openclaw-runtime-stabilizer/actions/workflows/docs-check.yml/badge.svg)

Public engineering artifact, reliability case study, and read-only verification toolkit for OpenClaw runtime/session-store incidents.

Current public release: `v1.0.0`.

This repository documents a real stabilization workflow for a local AI agent runtime after session-store inconsistency, dashboard session collisions, orphaned session entries, and runtime/config drift. The public edition focuses on safe diagnosis, reproducible documentation, evidence redaction, rollback discipline, operational verification, mock-based read-only tooling, fixture-driven tests, and Markdown reporting.

## Target runtime

The work documented in this repository was performed against:

```text
OpenClaw 2026.6.8
```

All concrete runtime assumptions should be treated as version-scoped to OpenClaw `2026.6.8` unless revalidated on another release.

See [`docs/TARGET_RUNTIME.md`](docs/TARGET_RUNTIME.md).

## Why this matters

Local AI agent runtimes are stateful systems. When sessions, registries, dashboards, compaction artifacts, and runtime bundles drift out of sync, the result can look like data loss even when transcripts still exist on disk. A safe repair workflow must preserve data first, verify state before modifying it, and avoid destructive resets.

## Scope

This public edition includes:

- incident analysis and executive summary
- target runtime/version note
- troubleshooting matrix for similar symptoms
- read-only session-store analyzer
- mock session-store environments for safe testing
- fixture-driven Node.js test suite
- Markdown report generation
- architecture notes for the stabilization approach
- rollback and verification policy
- redaction policy for public release
- sanitized evidence summary
- examples for safe environment documentation

This repository intentionally does **not** publish private transcripts, raw local logs, machine-specific paths, hostnames, tokens, or one-click destructive repair operations.

## Install

Requirements:

- Node.js 20 or newer
- npm

Clone and install:

```bash
git clone https://github.com/melkhamesey2/openclaw-runtime-stabilizer.git
cd openclaw-runtime-stabilizer
npm install
```

There are currently no external runtime dependencies. `npm install` is still useful as a standard project setup step and for future compatibility.

## Run the read-only verifier

Run against the bundled mock dataset:

```bash
npm run verify:mock
```

Equivalent direct command:

```bash
node tools/verify-readonly.mjs examples/mock-session-store
```

The verifier prints a JSON report. It does not write, delete, rename, repair, or mutate source session data.

## Run tests and full checks

Run the Node.js test suite:

```bash
npm test
```

Run the full project check:

```bash
npm run check
```

The `check` workflow uses npm lifecycle hooks:

- `precheck` runs a local self-check.
- `check` runs tests, mock verification, and Markdown report generation.
- `postcheck` repeats the self-check so the automation boundary is explicit.

Current npm scripts:

| Script | Purpose |
| --- | --- |
| `npm run verify -- <dir>` | Run the verifier on a supplied session-store directory. |
| `npm run verify:mock` | Run the verifier on the bundled mock fixture. |
| `npm test` | Run the analyzer test suite. |
| `npm run report -- <dir> <output.md>` | Generate a Markdown report from a session-store directory. |
| `npm run report:mock` | Generate `reports/mock-session-store-report.md` from the mock fixture. |
| `npm run check` | Run self-checks, tests, mock verification, and report generation. |

## Large-file handling

The analyzer is designed for large JSONL transcript files. It uses streaming file reads for transcript hashing and line-by-line JSONL validation instead of loading entire transcript files into memory.

Useful large-file options:

```bash
node tools/verify-readonly.mjs examples/mock-session-store --large-file-bytes 1048576
node tools/verify-readonly.mjs examples/mock-session-store --max-jsonl-line-bytes 1048576
```

- `--large-file-bytes` controls when the report labels a transcript as large-file mode.
- `--max-jsonl-line-bytes` bounds deep JSON validation for unusually large single JSONL lines.

## Example verifier output

A shortened mock finding looks like this:

```json
{
  "ok": true,
  "summary": {
    "registryEntries": 6,
    "warnings": 2,
    "findings": 6
  },
  "findings": [
    {
      "severity": "warning",
      "code": "MISSING_TRANSCRIPT_FILE",
      "message": "Registry points to a transcript file that does not exist."
    }
  ]
}
```

For a human-readable version, run:

```bash
npm run report:mock
```

## Fixtures

The repository includes several safe fixtures:

| Fixture | Purpose |
| --- | --- |
| `examples/mock-session-store/` | Mixed incident-like registry for golden expectations. |
| `examples/clean-session-store/` | Clean registry used to verify zero findings. |
| `examples/malformed-session-store/` | JSONL parse-error fixture. |
| `examples/mock-large-session-store/` | Bounded large-line fixture for streaming/line-limit behavior. |

## Quick reading path

1. [`docs/TARGET_RUNTIME.md`](docs/TARGET_RUNTIME.md)
2. [`docs/EXECUTIVE_SUMMARY.md`](docs/EXECUTIVE_SUMMARY.md)
3. [`docs/TROUBLESHOOTING_MATRIX.md`](docs/TROUBLESHOOTING_MATRIX.md)
4. [`examples/mock-session-store/README.md`](examples/mock-session-store/README.md)
5. [`src/session-store-analyzer.mjs`](src/session-store-analyzer.mjs)
6. [`tools/verify-readonly.mjs`](tools/verify-readonly.mjs)
7. [`tools/generate-markdown-report.mjs`](tools/generate-markdown-report.mjs)
8. [`test/session-store-analyzer.test.mjs`](test/session-store-analyzer.test.mjs)
9. [`docs/INCIDENT_TIMELINE.md`](docs/INCIDENT_TIMELINE.md)
10. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
11. [`docs/OPERATIONAL_VERIFICATION.md`](docs/OPERATIONAL_VERIFICATION.md)
12. [`docs/ROLLBACK_POLICY.md`](docs/ROLLBACK_POLICY.md)
13. [`docs/REDACTION_POLICY.md`](docs/REDACTION_POLICY.md)
14. [`evidence/SANITIZED_EVIDENCE_SUMMARY.md`](evidence/SANITIZED_EVIDENCE_SUMMARY.md)

## Repository map

```text
.
├── README.md
├── LICENSE
├── NOTICE
├── SECURITY.md
├── CONTRIBUTING.md
├── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── EXECUTIVE_SUMMARY.md
│   ├── FINAL_REPORT_AR.md
│   ├── INCIDENT_TIMELINE.md
│   ├── OPERATIONAL_VERIFICATION.md
│   ├── PROJECT_STATUS.md
│   ├── REDACTION_POLICY.md
│   ├── RELEASE_NOTES.md
│   ├── REPOSITORY_MAP.md
│   ├── ROADMAP.md
│   ├── ROLLBACK_POLICY.md
│   ├── TARGET_RUNTIME.md
│   └── TROUBLESHOOTING_MATRIX.md
├── evidence/
│   └── SANITIZED_EVIDENCE_SUMMARY.md
├── examples/
│   ├── redacted-environment.example
│   ├── mock-session-store/
│   ├── clean-session-store/
│   ├── malformed-session-store/
│   └── mock-large-session-store/
├── src/
│   ├── README.md
│   └── session-store-analyzer.mjs
├── tools/
│   ├── README.md
│   ├── verify-readonly.mjs
│   └── generate-markdown-report.mjs
├── test/
│   └── session-store-analyzer.test.mjs
├── reports/
│   └── generated locally by npm run report:mock
```
