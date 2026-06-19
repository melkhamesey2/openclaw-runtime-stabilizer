# Architecture Notes

This project treats OpenClaw runtime stability as a state-consistency problem rather than a simple UI bug.

## Layers considered

1. Runtime bundles
2. Session registry
3. Transcript-like records
4. Dashboard projection
5. Chat-window rendering
6. Compaction artifacts
7. Backup and rollback state

## Core model

The session registry is an index. Transcript-like records are evidence. Dashboard state is a derived view. A safe repair process should not treat the derived view as the source of truth.

## Stabilization principles

- preserve raw evidence before changing derived state
- verify file existence before trusting registry entries
- classify empty shells separately from real transcripts
- normalize aliases and keys consistently
- avoid merging unrelated sessions
- fail closed if rollback safety cannot be proven

## Public edition architecture

The public repository contains documentation, sanitized evidence summaries, and planned tool boundaries. Executable local repair scripts are not required for understanding the incident model and are not published as the default public entry point.
