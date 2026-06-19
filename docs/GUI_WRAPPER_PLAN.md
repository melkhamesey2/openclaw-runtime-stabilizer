# Optional GUI Wrapper Plan

## Purpose

A GUI wrapper can make the read-only verifier easier for non-terminal users. The core project remains CLI-first because that is easier to audit, test, automate, and run in CI.

## Recommended implementation

Use a small optional Python wrapper with CustomTkinter that calls the existing Node.js CLI tools instead of duplicating analyzer logic.

Recommended UI controls:

- Select session-store snapshot directory.
- Run read-only verification.
- Generate Markdown report.
- Choose log file path.
- Show JSON summary and report path.
- Open generated report.

## Safety constraints

The GUI must preserve the same safety contract as the CLI:

- no source session data modification
- no delete/rename/repair buttons
- no raw private transcript publishing
- no hidden auto-update behavior
- no network access unless the user explicitly runs the advisory version check

## Suggested architecture

```text
CustomTkinter UI
        |
        v
subprocess call
        |
        v
node tools/verify-readonly.mjs <snapshot-dir> --log-file logs/stabilizer.log
node tools/generate-markdown-report.mjs <snapshot-dir> <output.md>
node tools/check-openclaw-version.mjs --repo <owner/name> --current <version>
```

## Why not include GUI as core v1

The current v1 public release prioritizes auditability and reproducibility. A GUI adds packaging and dependency concerns that are useful for operators but not required for the verifier core.

## Future milestone

A future `v1.x` release may include an optional `gui/` directory with a CustomTkinter wrapper after the CLI contract remains stable.
