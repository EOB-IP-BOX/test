# LETZZ Test Hub

Password-gated **GitHub Pages** demo for both LETZZ product surfaces:

- **Wallet Subject desk** (simulated LETZZ Wallet web experience)
- **Obliged Entity operate desk** (simulated LETZZ Platform OE)

## Live site (static)

**https://eob-ip-box.github.io/test/**

This URL stays fixed. Every push to `main` on `EOB-IP-BOX/test` rebuilds and deploys GitHub Pages (`deploy-pages.yml`), then runs Playwright smoke against that same URL.

Letz File monorepo pushes do **not** auto-publish this hub. When Platform honesty desks change, update and push this repo so the partner preview stays current.

## Demo password (static)

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

**Guest share honesty (Codex 4.3):** static open desk at `#/guest/demo-hub-guest-share`, hash-metadata list, **Check download availability** → `download_not_available` (no fake PDF), `#/register?from=guest-share` registration gate.

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
- Home: DEBUG loopback re-read (inbox / grants / step-up), generation-guarded
- Inbox mark-read
- Grant / reject pending grants
- Documents: hash-receipts re-read, category filter, inspect detail, copy hash, verify-only paste check, blocked PDF download honesty
- Packages: create draft, checkbox assemble hashes, mark ready, mark shared, copy JSON manifest (`vaultBytesIncluded: false`)
- Assistant: stack-health vs Concierge honesty re-reads (separate), quick prompts + rule-based local stub (no GPT)
- Data Subject: life-store connectors, read-only grant simulation, vault-byte gate honesty
- Settings: recovery honesty re-read (gated), toggles + reset demo data

### Obliged Entity

- Dashboard metrics
- Subjects list and detail (detail re-read honesty)
- Cases list, detail, status transitions (detail re-read honesty)
- Organisations directory + open-org follow-on (not registry verification)
- Screening jobs list, open-job detail, party fixture seed (not licensed clearance)
- Request compose, draft, mark sent
- Grants approve/deny (shared state with wallet)
- **Grants pack flow (Prometheus honesty sim):** View pack on a granted row → step-up gate (`STEP_UP_DENIED`) → Wallet Subject Home → Approve (loopback) → pack preview (auto-retry when demo state syncs across tabs via `storage`, or manual Retry). **Path B:** Run WebAuthn probe on the gate → `webauthn_unavailable` or `webauthn_verify_not_wired` (never unlocks). Revoke before or after step-up → `GRANT_REVOKED` (not stale step-up denial). Pre-seeded revoked row: DEMO Elon Musk grant-4.
- **Cases pack preview:** Case detail and Cases list **View pack** (when grant is granted/revoked) reuse the same step-up gate (e.g. case-008 → grant-3).
- **Follow-up request wizard (stub):** OE Requests desk, multi-step DEMO wizard (no send pipeline).
- Subject search

### Guest share (unauthenticated desk sim)

- Open `#/guest/demo-hub-guest-share` after Alma gate: one-time share copy, hash-metadata document row, download check honesty
- Register invite `#/register?from=guest-share`: no Cognito / instant wallet claims
- Parity target: Local Cloud `e2e/guest-share-honesty.spec.ts` (Platform API); hub uses static demo token only

State persists in `localStorage` for the browser session; gate uses `sessionStorage`. Chooser writes `letzz.debug.localAccount` (`Wallet Subject` or `Analyst`) like the local Platform web desk.

## Backlog (honest gaps)

- Guest share: optional link from OE Requests desk to generate/copy demo token (still static, not API-backed).
- Wire manifest copy to real Platform API grant payload shape (still hash-only).
- Life-store: real connector states (indexing progress) and cross-tab sync with OE subject views.
- Self-hosted IBM Plex via Vite-bundled `src/assets/fonts` (CSS `url()` rewrites for `/test/` on Pages).
- Concierge: subscription / entitlement UI before any real server heavy wiring.
