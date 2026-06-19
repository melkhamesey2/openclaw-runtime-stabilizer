# Incident Timeline

This timeline summarizes the public-safe shape of the incident.

## T0 - Symptoms observed

The runtime showed session and dashboard inconsistencies. Some sessions appeared empty, some dashboard entries repeated, and chat-window output did not always match dashboard state.

## T1 - Evidence preserved

The priority was to preserve transcript-like records and avoid destructive cleanup. The incident was treated as a state-consistency problem rather than immediate data loss.

## T2 - State classified

Records were classified into active sessions, empty shells, orphaned entries, duplicate projections, and stale dashboard-derived state.

## T3 - Root-cause framing

The likely failure mode was registry/projection drift across session store, dashboard state, and local runtime artifacts. The UI was not assumed to be the source of truth.

## T4 - Safety model defined

Before repair, the process required backups, hashes, rollback policy, and a fail-closed approach for uncertain changes.

## T5 - Public release prepared

Private paths, host data, transcripts, and raw logs were removed. The public edition focuses on methodology, not private machine state.

## Outcome

The resulting artifact documents a safe approach to local AI agent runtime stabilization and session-store incident response.
