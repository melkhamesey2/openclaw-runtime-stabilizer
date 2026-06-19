# Source Directory

The public `src` directory now contains read-only analysis code for synthetic or user-provided session-store snapshots.

## Files

- `session-store-analyzer.mjs` — dependency-free analyzer for session registry and transcript consistency checks.

## Safety model

The analyzer is read-only. It does not write, delete, repair, rename, or move files.

It reports findings such as:

- missing `sessions.json`
- invalid JSON
- missing transcript files
- orphaned-prefixed registry keys
- duplicate display titles
- registry key / stored sessionKey mismatch
- trajectory files without matching base transcripts
- unreferenced transcript files

## Intended use

Use this code for diagnosis, mock testing, and safe incident comparison. Any future repair workflow should remain separate from read-only inspection and should require explicit review.
