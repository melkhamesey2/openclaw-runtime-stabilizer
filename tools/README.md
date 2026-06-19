# Tools Directory

This directory contains public-safe operational utilities.

## Files

- `verify-readonly.mjs` — command-line wrapper around `src/session-store-analyzer.mjs`.

## Usage

From the repository root:

```bash
npm run verify:mock
```

Or directly:

```bash
node tools/verify-readonly.mjs examples/mock-session-store
```

Strict mode for automation:

```bash
node tools/verify-readonly.mjs examples/mock-session-store --fail-on-warning
```

## Safety model

The tool is read-only. It prints a JSON report and exits with a non-zero status only when the report contains errors, or when strict warning mode is enabled.
