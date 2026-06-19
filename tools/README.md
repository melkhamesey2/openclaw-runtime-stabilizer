# Tools Directory

This directory contains public-safe operational utilities.

## Files

- `verify-readonly.mjs` — command-line wrapper around `src/session-store-analyzer.mjs`.
- `generate-markdown-report.mjs` — converts a read-only analyzer result into a human-readable Markdown report.
- `check-openclaw-version.mjs` — advisory GitHub release checker for upstream OpenClaw version drift.

## npm usage

From the repository root:

```bash
npm run verify:mock
npm run verify:mock:logged
npm test
npm run report:mock
npm run check
```

`npm run check` uses lifecycle hooks:

- `precheck` runs `node tools/verify-readonly.mjs --self-check`.
- `check` runs the analyzer test suite, mock verification, and mock Markdown report generation.
- `postcheck` repeats the self-check as a final boundary check.

## Direct verifier usage

```bash
node tools/verify-readonly.mjs examples/mock-session-store
```

Strict mode for automation:

```bash
node tools/verify-readonly.mjs examples/mock-session-store --fail-on-warning
```

Structured logging:

```bash
node tools/verify-readonly.mjs examples/mock-session-store --log-file logs/stabilizer.log
node tools/verify-readonly.mjs examples/mock-session-store --log-file logs/stabilizer.log --log-level debug
```

Large-file-aware options:

```bash
node tools/verify-readonly.mjs examples/mock-session-store --large-file-bytes 1048576
node tools/verify-readonly.mjs examples/mock-session-store --max-jsonl-line-bytes 1048576
```

## Markdown report usage

```bash
node tools/generate-markdown-report.mjs examples/mock-session-store reports/mock-session-store-report.md
npm run report:mock
```

The generated report includes:

- summary metrics,
- findings sorted by severity,
- transcript inventory,
- safe next steps,
- and explicit do-not-do warnings.

## Advisory version check

```bash
node tools/check-openclaw-version.mjs --repo owner/OpenClaw --current 2026.6.8
node tools/check-openclaw-version.mjs --repo owner/OpenClaw --current 2026.6.8 --log-file logs/stabilizer.log
```

This command only compares the supplied local version with the latest upstream GitHub release. It does not install, update, patch, or modify OpenClaw.

## Safety model

The verifier is read-only. It prints a JSON report and exits with a non-zero status only when the report contains errors, or when strict warning mode is enabled.

The report generator reads a fixture or session-store snapshot and writes a Markdown report to the output path supplied by the caller. It does not change source session data.

The version checker is advisory only. It reports version drift and never changes the local runtime.

The analyzer streams transcript files instead of loading full JSONL files into memory. Very large single JSONL lines can be skipped from deep validation while still being counted and reported.
