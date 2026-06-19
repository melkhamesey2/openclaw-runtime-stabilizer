# Release Notes

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
