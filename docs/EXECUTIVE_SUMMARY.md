# Executive Summary

This repository documents a public-safe reliability case study for an OpenClaw local AI agent runtime incident.

## Incident class

The incident involved symptoms commonly seen when a stateful local agent runtime becomes inconsistent after long-running sessions, compaction, dashboard refreshes, or local updates.

Observed symptom groups:

- sessions visible in the UI but empty or partially rendered
- repeated session titles or duplicated dashboard entries
- dashboard output diverging from chat-window output
- orphaned session entries that no longer match registry state
- apparent transcript loss despite transcript-like data existing on disk
- uncertainty around rollback after partial local changes

## Engineering objective

The goal was not to perform a blind reset. The goal was to preserve evidence and recover runtime consistency safely.

The stabilization process prioritized:

1. transcript preservation
2. state inspection before modification
3. clear separation between runtime behavior and stored data
4. minimal and reversible changes
5. hash-based evidence records
6. redaction before public release

## Public value

The repository is useful as a reference for:

- local AI systems reliability
- agent runtime incident response
- state-store repair planning
- rollback policy design
- public redaction workflow
- troubleshooting dashboard/session mismatches

## Current status

This is a documentation-first public edition. It provides the analysis, safety model, troubleshooting matrix, and release hygiene around the incident. A future version may include read-only verification tooling.
