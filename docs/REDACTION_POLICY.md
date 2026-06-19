# Redaction Policy

This repository is public. All incident material must be redacted before publication.

## Do not publish

- private transcripts
- raw chat logs
- local user names
- absolute local paths
- hostnames
- API keys or tokens
- internal project secrets
- unfiltered runtime dumps
- third-party confidential data

## Replace with placeholders

Use neutral placeholders such as:

- `<USER_HOME>`
- `<OPENCLAW_CONFIG>`
- `<SESSION_REGISTRY>`
- `<TRANSCRIPT_RECORD>`
- `<HOSTNAME>`
- `<RUN_ROOT>`

## Evidence policy

Public evidence should be summarized, not dumped. Counts, categories, hashes, and sanitized examples are preferred over raw files.

## Review rule

If a file contains local machine state, inspect it manually before release. If it cannot be safely redacted, keep it private.
