# Prospeva shared backend integration — employer

The root experience remains explicitly labeled as a product preview. `/workspace.html` is the API-backed workspace. When the API origin is configured, the root redirects there unless `?preview=1` is selected.

Backend contract: application 5.6.2 (workspace checks the exact configured version). All four sites must use the SAME backend origin and identity pool, with separate registered public OAuth clients if desired. Never place provider keys, client secrets, database credentials or access tokens in public files.

Configuration: set Sites runtime variables PROSPEVA_API_ORIGIN, PROSPEVA_COGNITO_DOMAIN, PROSPEVA_CLIENT_ID, PROSPEVA_ENVIRONMENT and deploy a new saved version. API origin has no path. Cognito domain is an HTTPS origin. Register `https://prospera-employer-payroll.jkelvinfallah.chatgpt.site/workspace.html` as the exact callback URL; enable authorization-code flow, PKCE, openid/email and MFA. Use Cognito access tokens, not ChatGPT site identity, for financial API authorization.

Backend CORS must allow each of the four exact portal origins. Expose X-Correlation-Id and Server-Timing if frontend diagnostics need them. Tokens stay in memory. Only short-lived OAuth state/verifier and opaque command retry metadata use sessionStorage. The API enforces permissions regardless of which client renders buttons.

In staging or production, unconfigured sign-in stays disabled. Local password/MFA testing is allowed only when both portal and API use loopback hosts and environment=local. Do not publish demo tokens or demo-account login forms for a remote backend.

Supported operational flows: role-scoped dashboards, verified same-currency wallet transfer, organization financing request/consent, admin lender assignment/evidence review, lender offer/disbursement, organization acceptance approval/repayment, payroll draft/submission/approval, and selected read-only cards/bills/loans/collections/audit/safeguarding screens. Payroll release is deliberately not exposed pending full employee-line/funding certification. Other advanced preview actions remain demonstrations.

Refresh uses authoritative API reads every 60 seconds while visible, plus refresh after successful mutations. It does not claim realtime event subscription; the SQS consumer and push transport remain deployment work. Offline actions are never automatically queued. For a timeout, retain the same action key; changed requests are blocked until resolution. Non-idempotent commands are not automatically retried after an uncertain outcome.

Open INTEGRATION_VALIDATION.md for executed checks and remaining gates.
