# Sanitized Evidence Summary

This file summarizes the evidence classes used during the incident without exposing private local data.

## Evidence classes

- application version and runtime channel
- session registry shape
- transcript-like record presence
- empty shell count
- orphaned entry count
- duplicate projection indicators
- dashboard/chat mismatch examples
- backup and rollback metadata

## Redaction applied

The public edition removes:

- local usernames
- absolute machine paths
- hostnames
- raw transcripts
- raw chat logs
- tokens and secrets
- private project names

## Evidence use

The evidence is used to support diagnosis and safe remediation planning, not to expose private machine state.

## Public-safe example

```text
Symptom: dashboard shows duplicated session entries
Likely class: stale derived projection or key alias collision
Inspection: compare registry keys with transcript-like records
Safe direction: reconcile derived state after backup
Unsafe direction: delete all sessions
```
