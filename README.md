# LETZZ Test Hub

Password-gated **GitHub Pages** demo for both LETZZ product surfaces:

- **Wallet Subject desk** (simulated LETZZ Wallet web experience)
- **Obliged Entity operate desk** (simulated LETZZ Platform OE)

## Live site

After Pages deploy: `https://eob-ip-box.github.io/test/` (or org URL shown in repo Settings → Pages).

## Demo password

**Alma**

The gate compares SHA-256 of your entry in the browser. It is **not** server-side authentication. GitHub Pages is static; anyone can inspect client code. This hub is for partner UI flow testing only.

## Honesty

- All data is synthetic and labeled DEMO.
- No claims of Cognito, AWS production, eIDAS, AML6, or licensed screening.
- Wallet documents show **metadata and hash references only** (hash-only vault model).
- Platform Owner monitoring is not included (infrastructure, not a peer product app).

## Local development

```bash
npm install
npm run dev
```

Build for Pages (base path `/test/`):

```bash
npm run build
```

## Playwright smoke (grant pack honesty)

Exercises password gate (`demo-hub-password-gate`), OE Grants step-up gate, Path B WebAuthn probe, Wallet loopback approve, and `GRANT_REVOKED` ordering. Uses hub `data-testid` hooks (`grant-pack-step-up-gate`, `grant-pack-path-b-probe`, `webauthn-probe-*`, `wallet-step-up-inbox`, `grant-pack-preview`, `grant-pack-error`).

```bash
npm install
npx playwright install chromium
npm run test:e2e:pages
```

Default base URL: `https://eob-ip-box.github.io/test/` (override with `PLAYWRIGHT_BASE_URL`).

Local preview (build first, or rely on webServer in config):

```bash
npm run build
npm run test:e2e:local
```

Screenshots are off by default (Pages can be flaky); traces on first retry only.

## Flows exercised

### Wallet Subject

- Welcome → Home
- Inbox mark-read
- Grant / reject pending grants
- Documents list (hashes)
- Packages view + mark shared
- Assistant local stub chat
- Data Subject index
- Settings toggles + reset demo data

### Obliged Entity

- Dashboard metrics
- Subjects list and detail
- Cases list, detail, status transitions
- Request compose, draft, mark sent
- Grants approve/deny (shared state with wallet)
- **Grants pack flow (Prometheus honesty sim):** View pack on a granted row → step-up gate (`STEP_UP_DENIED`) → Wallet Subject Home → Approve (loopback) → pack preview (auto-retry when demo state syncs across tabs via `storage`, or manual Retry). **Path B:** Run WebAuthn probe on the gate → `webauthn_unavailable` or `webauthn_verify_not_wired` (never unlocks). Revoke before or after step-up → `GRANT_REVOKED` (not stale step-up denial). Pre-seeded revoked row: DEMO Elon Musk grant-4.
- **Follow-up request wizard (stub):** OE Requests desk, multi-step DEMO wizard (no send pipeline).
- Subject search

State persists in `localStorage` for the browser session; gate uses `sessionStorage`. Chooser writes `letzz.debug.localAccount` (`Wallet Subject` or `Analyst`) like the local Platform web desk.
