# OpenClaw Runtime Stabilizer

Public engineering artifact, reliability case study, and read-only verification toolkit for OpenClaw runtime/session-store incidents.

This repository documents a real stabilization workflow for a local AI agent runtime after session-store inconsistency, dashboard session collisions, orphaned session entries, and runtime/config drift. The public edition focuses on safe diagnosis, reproducible documentation, evidence redaction, rollback discipline, operational verification, and mock-based read-only tooling.

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
- mock session-store environment for safe testing
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

Run against the bundled safe mock dataset:

```bash
npm run verify:mock
```

Equivalent direct command:

```bash
node tools/verify-readonly.mjs examples/mock-session-store
```

The verifier prints a JSON report. It does not write, delete, rename, repair, or mutate files.

For full project checks:

```bash
npm run check
```

The `check` workflow uses npm lifecycle hooks:

- `precheck` runs a local self-check.
- `check` runs the read-only mock verification.
- `postcheck` repeats the self-check so the automation boundary is explicit.

Current npm scripts:

| Script | Purpose |
| --- | --- |
| `npm run verify -- <dir>` | Run the verifier on a supplied session-store directory. |
| `npm run verify:mock` | Run the verifier on the bundled mock fixture. |
| `npm run check` | Run the full read-only validation workflow with pre/post hooks. |

## Large-file handling

The analyzer is designed for large JSONL transcript files. It uses streaming file reads for transcript hashing and line-by-line JSONL validation instead of loading entire transcript files into memory.

Useful large-file options:

```bash
node tools/verify-readonly.mjs examples/mock-session-store --large-file-bytes 1048576
node tools/verify-readonly.mjs examples/mock-session-store --max-jsonl-line-bytes 1048576
```

- `--large-file-bytes` controls when the report labels a transcript as large-file mode.
- `--max-jsonl-line-bytes` bounds deep JSON validation for unusually large single JSONL lines.

## Quick reading path

1. [`docs/TARGET_RUNTIME.md`](docs/TARGET_RUNTIME.md)
2. [`docs/EXECUTIVE_SUMMARY.md`](docs/EXECUTIVE_SUMMARY.md)
3. [`docs/TROUBLESHOOTING_MATRIX.md`](docs/TROUBLESHOOTING_MATRIX.md)
4. [`examples/mock-session-store/README.md`](examples/mock-session-store/README.md)
5. [`src/session-store-analyzer.mjs`](src/session-store-analyzer.mjs)
6. [`tools/verify-readonly.mjs`](tools/verify-readonly.mjs)
7. [`docs/INCIDENT_TIMELINE.md`](docs/INCIDENT_TIMELINE.md)
8. [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
9. [`docs/OPERATIONAL_VERIFICATION.md`](docs/OPERATIONAL_VERIFICATION.md)
10. [`docs/ROLLBACK_POLICY.md`](docs/ROLLBACK_POLICY.md)
11. [`docs/REDACTION_POLICY.md`](docs/REDACTION_POLICY.md)
12. [`evidence/SANITIZED_EVIDENCE_SUMMARY.md`](evidence/SANITIZED_EVIDENCE_SUMMARY.md)

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
│   └── mock-session-store/
│       ├── README.md
│       ├── sessions.json
│       └── transcripts/
├── src/
│   ├── README.md
│   └── session-store-analyzer.mjs
├── tools/
│   ├── README.md
│   └── verify-readonly.mjs
└── .github/
    ├── workflows/
    │   └── docs-check.yml
    └── ISSUE_TEMPLATE/
        └── safe-incident-report.md
```

## Current release status

`v0.2.1` is a public documentation and read-only verification edition. It is designed for review, learning, incident comparison, safe operational planning, mock-based verification, npm automation, and large-file-aware transcript inspection.

## Safety position

The project is defensive and reliability-focused. It is not a bypass toolkit, exploit project, or destructive patch collection. The default rule is: inspect first, preserve data, verify hashes, and never delete transcripts as a first response.

## Suggested GitHub topics

```text
openclaw
local-ai
ai-agents
runtime-reliability
incident-response
state-repair
session-store
rollback-safety
redaction
windows
nodejs
```
