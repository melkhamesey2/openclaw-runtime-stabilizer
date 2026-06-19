# Repository Map

```text
.
├── README.md
├── LICENSE
├── NOTICE
├── SECURITY.md
├── CONTRIBUTING.md
├── package.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── EXECUTIVE_SUMMARY.md
│   ├── FINAL_REPORT_AR.md
│   ├── INCIDENT_TIMELINE.md
│   ├── OPERATIONAL_VERIFICATION.md
│   ├── PROJECT_STATUS.md
│   ├── REDACTION_POLICY.md
│   ├── RELEASE_NOTES.md
│   ├── REPOSITORY_MAP.md
│   ├── ROADMAP.md
│   ├── ROLLBACK_POLICY.md
│   ├── TARGET_RUNTIME.md
│   └── TROUBLESHOOTING_MATRIX.md
├── evidence/
│   └── SANITIZED_EVIDENCE_SUMMARY.md
├── examples/
│   ├── redacted-environment.example
│   └── mock-session-store/
│       ├── README.md
│       ├── sessions.json
│       └── transcripts/
├── src/
│   ├── README.md
│   └── session-store-analyzer.mjs
├── tools/
│   ├── README.md
│   └── verify-readonly.mjs
└── .github/
    ├── workflows/
    │   └── docs-check.yml
    └── ISSUE_TEMPLATE/
        └── safe-incident-report.md
```

## Reading order

1. README
2. Target Runtime
3. Executive Summary
4. Troubleshooting Matrix
5. Mock Session Store
6. Read-only Verifier
7. Incident Timeline
8. Architecture
9. Operational Verification
10. Rollback Policy
11. Redaction Policy
12. Sanitized Evidence Summary

## Tooling entry points

```bash
npm install
npm run verify:mock
npm run check
```
