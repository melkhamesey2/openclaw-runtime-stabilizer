# Tools Directory

This directory contains public-safe operational utilities.

## Files

- `verify-readonly.mjs` — command-line wrapper around `src/session-store-analyzer.mjs`.
- `generate-markdown-report.mjs` — converts a read-only analyzer result into a human-readable Markdown report.

## npm usage

From the repository root:

```bash
npm run verify:mock
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

## Safety model

The verifier is read-only. It prints a JSON report and exits with a non-zero status only when the report contains errors, or when strict warning mode is enabled.

The report generator reads a fixture or session-store snapshot and writes a Markdown report to the output path supplied by the caller. It does not change source session data.

The analyzer streams transcript files instead of loading full JSONL files into memory. Very large single JSONL lines can be skipped from deep validation while still being counted and reported.
