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

## Playwright smoke

**Grant pack honesty:** password gate, OE Grants step-up, Path B WebAuthn probe, Wallet loopback approve, single-tab re-view, `GRANT_REVOKED` ordering.

**Documents and Packages:** inspect/verify hash, blocked download, draft pack assembly, manifest copy, Assistant stub.

**Data Subject, Concierge degraded, case pack:** life-store grant sim, `concierge-degraded-banner`, case `case-pack-preview`.

Hooks include `wallet-documents-list`, `wallet-document-detail`, `wallet-package-create`, `wallet-package-assembler`, `wallet-package-manifest-preview`, `wallet-assistant-thread`, plus grant pack ids above.

Post-deploy: `deploy-pages.yml` runs `smoke-pages` against live Pages URL after deploy succeeds.

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
- Documents: category filter, inspect detail, copy hash, verify-only paste check, blocked PDF download honesty
- Packages: create draft, checkbox assemble hashes, mark ready, mark shared, copy JSON manifest (`vaultBytesIncluded: false`)
- Assistant: quick prompts + rule-based local stub (no GPT, reads demo state only)
- Data Subject: life-store connectors, read-only grant simulation, vault-byte gate honesty
- Settings toggles + reset demo data

### Obliged Entity

- Dashboard metrics
- Subjects list and detail
- Cases list, detail, status transitions
- Request compose, draft, mark sent
- Grants approve/deny (shared state with wallet)
- **Grants pack flow (Prometheus honesty sim):** View pack on a granted row → step-up gate (`STEP_UP_DENIED`) → Wallet Subject Home → Approve (loopback) → pack preview (auto-retry when demo state syncs across tabs via `storage`, or manual Retry). **Path B:** Run WebAuthn probe on the gate → `webauthn_unavailable` or `webauthn_verify_not_wired` (never unlocks). Revoke before or after step-up → `GRANT_REVOKED` (not stale step-up denial). Pre-seeded revoked row: DEMO Elon Musk grant-4.
- **Cases pack preview:** Case detail links a grant id; **View case pack** reuses the same step-up gate (e.g. case-008 → grant-3).
- **Follow-up request wizard (stub):** OE Requests desk, multi-step DEMO wizard (no send pipeline).
- Subject search

State persists in `localStorage` for the browser session; gate uses `sessionStorage`. Chooser writes `letzz.debug.localAccount` (`Wallet Subject` or `Analyst`) like the local Platform web desk.

## Backlog (honest gaps)

- Wire manifest copy to real Platform API grant payload shape (still hash-only).
- Cases list row quick action for pack preview (detail page only today).
- Life-store: real connector states (indexing progress) and cross-tab sync with OE subject views.
- Visual parity pass against LETZZ Wallet Subject web tokens (Notify Blue / UBI crimson).
- Concierge: separate toggle for simulated paywalled server vs local stub (today one localConcierge flag).
