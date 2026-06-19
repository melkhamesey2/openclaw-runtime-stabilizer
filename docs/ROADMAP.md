# Roadmap

## v1.0.0 - Complete Public Engineering Artifact

Status: current.

Includes:

- public-safe incident documentation
- OpenClaw `2026.6.8` target runtime note
- troubleshooting matrix
- rollback policy
- operational verification checklist
- redaction policy
- sanitized evidence summary
- safe issue template
- read-only session-store analyzer
- large-file-aware JSONL transcript inspection
- read-only verifier CLI
- Markdown report generator
- mock, clean, malformed, and bounded large-line fixtures
- golden expected report metadata
- fixture-driven Node.js test suite
- npm precheck/check/postcheck automation
- GitHub Actions validation

The public v1 line is inspection-first and does not publish private transcripts, raw logs, secrets, machine-specific paths, or one-click production repair commands.

## Future - Private Local Adapter

Planned as a private/local workflow, not a public one-click command.

Potential additions:

- local snapshot adapter for a real OpenClaw installation
- backup manifest format
- operator checklist
- rollback record format
- controlled remediation plan template

## Non-goals

- publishing private transcripts
- destructive reset automation
- bypassing runtime safeguards
- exposing local machine-specific evidence
