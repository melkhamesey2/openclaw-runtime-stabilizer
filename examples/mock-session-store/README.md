# Mock Session Store

This directory is a safe synthetic dataset for testing the read-only verifier.

It does not contain private transcripts, host paths, tokens, or real OpenClaw user data.

## Included scenarios

- a clean session entry with a matching transcript
- duplicate dashboard titles
- a registry entry pointing to a missing transcript file
- an orphaned-prefixed registry key
- a stored `sessionKey` that differs from its registry key
- a trajectory file without a matching base transcript

## Run

```bash
node ../../tools/verify-readonly.mjs .
```

From the repository root:

```bash
npm run verify:mock
```
