# Tools Directory

This directory contains public-safe operational utilities.

## Files

- `verify-readonly.mjs` — command-line wrapper around `src/session-store-analyzer.mjs`.

## npm usage

From the repository root:

```bash
npm run verify:mock
npm run check
```

`npm run check` uses lifecycle hooks:

- `precheck` runs `node tools/verify-readonly.mjs --self-check`.
- `check` runs the mock verification.
- `postcheck` repeats the self-check as a final boundary check.

## Direct usage

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

## Safety model

The tool is read-only. It prints a JSON report and exits with a non-zero status only when the report contains errors, or when strict warning mode is enabled.

The analyzer streams transcript files instead of loading full JSONL files into memory. Very large single JSONL lines can be skipped from deep validation while still being counted and reported.
