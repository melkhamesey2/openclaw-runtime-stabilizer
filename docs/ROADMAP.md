# Roadmap

## v0.1.0 - Public Documentation Edition

Status: completed.

Includes:

- public-safe incident documentation
- troubleshooting matrix
- rollback policy
- operational verification checklist
- redaction policy
- sanitized evidence summary
- safe issue template

## v0.2.0 - Read-only Verification Toolkit

Status: current.

Includes:

- read-only session-store analyzer
- read-only verifier CLI
- mock session-store fixture
- npm scripts for mock verification
- GitHub Actions check for required files and mock verification

The verifier is inspection-only and does not change files.

## v0.3.0 - Local Report Generator

Planned.

Potential additions:

- broader environment summary
- session registry consistency report
- transcript-presence report
- dashboard/session mismatch checklist
- local-only report output

## v0.4.0 - Private Operator Workflow Template

Planned as a local/private workflow, not a public one-click command.

Potential additions:

- backup manifest format
- operator checklist
- rollback record format
- controlled remediation plan template

## Non-goals

- publishing private transcripts
- destructive reset automation
- bypassing runtime safeguards
- exposing local machine-specific evidence
