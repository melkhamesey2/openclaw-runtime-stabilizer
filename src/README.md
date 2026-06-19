# Source Directory

The public `src` directory is reserved for future read-only verification tooling.

## Current status

The current public edition is documentation-first. It does not publish a one-click runtime repair script as the default entry point.

## Planned direction

Future source files may include:

- read-only session registry inspector
- redacted environment reporter
- transcript-presence checker
- dashboard/session consistency reporter

Any future tool should default to dry-run behavior and avoid modifying local runtime state.
