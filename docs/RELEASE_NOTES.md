# Release Notes

## v1.1.0 - Operator Logging and Advisory Version Check

### Added

- Added structured JSONL logging through `src/logger.mjs`.
- Added `--log-file` and `--log-level` support to the read-only verifier CLI.
- Added `npm run verify:mock:logged` for persistent operator logs.
- Added advisory upstream OpenClaw version checker through `tools/check-openclaw-version.mjs`.
- Added `npm run version:check` command.
- Added optional CustomTkinter GUI wrapper plan in `docs/GUI_WRAPPER_PLAN.md`.

### Safety

This release remains inspection-first. The version checker is advisory only and never installs, updates, patches, or modifies OpenClaw. The GUI plan is documentation only and preserves the CLI read-only contract.

## v1.0.0 - Complete Public Engineering Artifact

### Added

- Consolidated the public documentation, read-only verifier, fixtures, tests, report generator, npm automation, and CI workflow into the first complete public release.
- Marked the package as `1.0.0`.
- Documented the project as suitable for portfolio review and public technical discussion.

### Included

- OpenClaw `2026.6.8` target runtime note.
- Public incident case study.
- Troubleshooting matrix.
- Read-only session-store analyzer.
- Large-file-aware JSONL transcript inspection.
- Verifier CLI.
- Markdown report generator.
- Mock, clean, malformed, and bounded large-line fixtures.
- Golden expected report metadata.
- Node.js test suite.
- npm `precheck` / `check` / `postcheck` workflow.
- GitHub Actions validation.

### Safety

This release remains inspection-first. It does not publish private transcripts, raw local logs, secrets, machine-specific paths, or one-click production repair commands.

## v0.3.0 - Test Suite and Markdown Reporting

### Added

- Added fixture-driven Node.js test suite for the session-store analyzer.
- Added clean, malformed JSONL, and bounded large-line fixtures.
- Added golden expected report metadata for the mock fixture.
- Added Markdown report generator.
- Added `npm test`, `npm run report:mock`, and expanded `npm run check` workflow.
- Expanded CI to validate required fixtures, tests, and report generation.
- Added README badge and example output section.

### Improved

- README now documents tests, report generation, fixtures, and the v0.3.0 workflow.
- Tools documentation now covers verifier and Markdown report usage.
- Repository map now reflects source, tools, tests, fixtures, reports, and CI.

### Safety

This release remains inspection-first. The analyzer and verifier do not change source session data. The Markdown report generator writes only to the caller-supplied report output path.

## v0.2.1 - Automation and Large-File Handling

### Added

- Expanded npm scripts for the read-only verifier workflow.
- Added `precheck`, `check`, and `postcheck` lifecycle flow.
- Added CLI self-check support.
- Added large-file-aware transcript inspection options.
- Documented large JSONL handling in README and tools documentation.

### Improved

- The session-store analyzer now streams transcript files instead of loading full JSONL files into memory.
- Transcript hashing now uses streaming reads.
- JSONL validation is line-based and bounded for unusually large single-line records.
- Verifier CLI now accepts explicit byte limits for large-file labeling and per-line validation.

### Safety

This release remains read-only. It reports findings without changing source data.

## v0.2.0 - Read-only Verification Edition

### Added

- read-only session-store analyzer
- read-only verifier CLI
- mock session-store fixture
- GitHub Actions verifier check
- installation and run instructions

### Safety

This release provides mock-based verification only. It does not include private transcripts, raw logs, secrets, or production repair automation.

## v0.1.0 - Public Documentation Edition

Initial public release.

### Added

- public README
- executive summary
- troubleshooting matrix
- incident timeline
- architecture notes
- rollback policy
- operational verification checklist
- redaction policy
- project status
- repository map
- sanitized evidence summary
- examples and placeholder directories

### Safety

This release does not include private transcripts, raw logs, secrets, or destructive repair automation.
