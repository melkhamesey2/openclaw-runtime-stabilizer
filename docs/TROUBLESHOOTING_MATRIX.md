# Troubleshooting Matrix

Use this matrix when an OpenClaw or similar local AI agent runtime shows session, dashboard, or state-store inconsistency.

## Ground rules

- Do not delete transcripts as a first response.
- Do not reset the whole runtime before preserving evidence.
- Separate UI symptoms from stored data symptoms.
- Prefer read-only inspection before any write operation.
- Record the current state before changing it.

## Matrix

| Symptom | Likely cause | Inspect first | Safe fix direction | Do not do |
|---|---|---|---|---|
| Chat sessions appear empty | registry points to missing or stale records | session registry, transcript directory, timestamps | rebind or reconcile registry entries after backup | delete all sessions |
| Same session title appears multiple times | alias or key normalization issue | session keys, title cache, dashboard store | deduplicate aliases and normalize keys | rename everything manually |
| Dashboard shows more content than chat view | UI cache and persisted message stream diverged | dashboard cache, message store, transport logs | verify source of truth before repair | trust only the UI |
| Old sessions show repeated snippets | stale combined store or cached projection | combined store, dashboard list endpoint | rebuild derived view from preserved records | remove transcript files |
| Orphaned session entries appear | compaction or migration created detached state | orphan markers, registry references | classify and reattach only verified records | bulk-delete orphaned entries blindly |
| New session opens into old content | session key collision | session creation path, alias candidates | enforce unique session keys and clear stale projection | clear all app data |
| UI and disk disagree | registry/index drift | disk files, registry JSON, last modified order | use disk records as evidence, registry as index | assume data loss immediately |
| Rollback is uncertain | modified files changed after patch | hashes, backups, timestamps | fail closed and require manual review | overwrite changed files |

## Evidence checklist

Before attempting repair, collect:

- application version
- operating system and runtime version
- registry file count
- transcript-like file count
- empty shell count
- orphaned entry count
- dashboard/session mismatch examples
- hash of files to be changed
- backup location

## Safe remediation pattern

1. Freeze writes if possible.
2. Copy current state to a safe backup.
3. Classify records: active, orphaned, empty shell, duplicate, stale projection.
4. Identify source of truth.
5. Apply the smallest reversible change.
6. Verify UI and disk parity.
7. Preserve a rollback path.

## Red flags

Stop and reassess if:

- transcripts are about to be deleted
- registry changes cannot be explained
- a repair tool wants to overwrite changed files
- backup integrity is unknown
- a session contains sensitive data that has not been redacted
