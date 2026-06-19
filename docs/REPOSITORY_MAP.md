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
│   ├── mock-session-store/
│   │   ├── README.md
│   │   ├── sessions.json
│   │   ├── expected-report.json
│   │   └── transcripts/
│   ├── clean-session-store/
│   │   ├── sessions.json
│   │   └── transcripts/
│   ├── malformed-session-store/
│   │   ├── sessions.json
│   │   └── transcripts/
│   └── mock-large-session-store/
│       ├── sessions.json
│       └── transcripts/
├── src/
│   ├── README.md
│   └── session-store-analyzer.mjs
├── tools/
│   ├── README.md
│   ├── verify-readonly.mjs
│   └── generate-markdown-report.mjs
├── test/
│   └── session-store-analyzer.test.mjs
├── reports/
│   └── generated locally by npm run report:mock
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
7. Markdown Report Generator
8. Analyzer Test Suite
9. Incident Timeline
10. Architecture
11. Operational Verification
12. Rollback Policy
13. Redaction Policy
14. Sanitized Evidence Summary

## Tooling entry points

```bash
npm install
npm run verify:mock
npm test
npm run report:mock
npm run check
```
