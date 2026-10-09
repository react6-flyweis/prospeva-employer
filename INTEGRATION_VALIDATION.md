# Portal integration validation — 22 September 2026

Backend 5.6.2. 53 pytest tests passed, one PostgreSQL concurrency test skipped (no PostgreSQL available locally). The new workspace/recipient authorization test passed separately. Five Node client tests passed: exact money conversion, origin validation, same-key safe retries, uncertain non-idempotent submission blocking, and expired sessions.

The actual shared JavaScript client ran against a local Uvicorn API and seeded SQLite TEST database with six identities. It verified four portal dashboards, lender portfolio, scoped wallet discovery, recipient confirmation, priced wallet transfer, payroll draft/submission, financing request/consent, admin assignment/evidence review, lender offer, blocked self-approval, independent approval, disbursement, and the same canonical request in admin oversight. It confirmed financing did not release payroll.

All three Vinext application builds passed. Static workspace JavaScript syntax checked. A Playwright rendering test was attempted but could not run because the environment has no browser executable; visual and real-device checks are still required. No public cloud API, real Cognito login, payment provider, production PostgreSQL or Liberia carrier latency was tested. Build output warns about static route classification; it did not fail.

## Activation

Deploy backend 5.6.2 with production migrations, PostgreSQL, durable worker and approved identity configuration. Configure exact CORS portal origins. Use one Cognito pool and public authorization-code PKCE clients; register each portal's /workspace.html callback. Keep client secrets out of browser settings. Provision user-to-subject mappings and organization memberships on the backend. Implement/certify production step-up; high-risk operations currently fail closed while it is absent.

Set PROSPEVA_API_ORIGIN, PROSPEVA_COGNITO_DOMAIN, PROSPEVA_CLIENT_ID and PROSPEVA_ENVIRONMENT on the three Worker-backed sites. The config route is served by the Worker, with no shadowing static JSON asset. For the static Super Admin site edit dist/prospeva-config.json with the same public values and rebuild/publish. Defaults intentionally contain no backend address or sign-in credentials.

All original screens remain explicitly marked product previews. The new /workspace.html uses the API. Configuring an origin redirects the root into that workspace; ?preview=1 retains design previews. This is a core workflow integration, not a conversion of every advanced prototype feature.

Payroll release is not exposed because legacy release logic still needs complete employee-line, wallet-selection and funding validation. External provider execution, AI/GL production services, financial-grade rate limits and production readiness gates remain separate work. The recipient-confirmation endpoint requires an exact wallet ID and returns no balance/contact details; add production rate limiting before public activation.

Manual refresh, successful-mutation refresh and 60-second visible-page polling provide shared data; no realtime push transport is implemented. Test with Orange Liberia and Lonestar/MTN before choosing a cloud region. No AWS-versus-Azure speed winner is claimed.

Uncertain commands retain opaque retry metadata for the signed-in identity/organization. Safe retries reuse the key; changed payloads and uncertain non-idempotent commands are blocked and require record reconciliation/support. Access tokens stay in memory and expire; reload may require sign-in. End-to-end Cognito session/logout, MFA and browser validation remain staging checks.
