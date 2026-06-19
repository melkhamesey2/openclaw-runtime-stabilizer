# Rollback Policy

Rollback must be treated as a safety feature, not an afterthought.

## Policy goals

- never overwrite changed files without review
- preserve a copy of the pre-change state
- record hashes before and after planned changes
- keep rollback scoped to the files changed by the stabilization process
- fail closed if the target changed after backup

## Minimum rollback record

A useful rollback record should include:

- file path or logical identifier
- pre-change hash
- post-change hash
- backup reference
- timestamp
- reason for change
- verification result

## Fail-closed conditions

Rollback should stop when:

- the current file hash does not match the expected post-change hash
- the backup hash does not match the recorded pre-change hash
- the file is missing unexpectedly
- a newer local change appears after the repair operation
- the operator cannot determine whether the rollback target is safe

## Recommended behavior

When uncertainty exists, generate a report and require manual review. A failed automatic rollback is safer than overwriting valid new runtime state.
