# Operational Verification

This document describes how to verify a runtime stabilization workflow without assuming that a public one-click repair script exists.

## Verification scope

The public edition verifies the process and evidence model:

- symptoms are classified clearly
- preserved data is separated from derived UI state
- rollback policy is defined before modification
- redaction is applied before publication
- results are documented in a repeatable format

## Pre-change verification

Before changing runtime state, verify:

1. current application version
2. current branch or package channel
3. session registry existence
4. transcript-like record existence
5. empty shell count
6. duplicate title/key count
7. orphaned entry count
8. backup path and integrity

## Post-change verification

After a controlled repair, verify:

1. UI session count matches expected registry state
2. dashboard does not show duplicate stale sessions
3. chat view and dashboard agree on current session content
4. no transcript-like files were deleted unintentionally
5. rollback records can be inspected
6. redaction check passes before public sharing

## Public edition note

This repository documents a safe verification method. It does not require publishing private machine state or raw repair scripts to be useful as a case study.
