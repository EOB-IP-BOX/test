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
- Subject search

State persists in `localStorage` for the browser session; gate uses `sessionStorage`.
