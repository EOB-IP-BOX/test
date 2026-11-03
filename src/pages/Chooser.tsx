import { Link } from 'react-router-dom'
import { DemoBanner } from '../components/DemoBanner'
import { HUB_STATIC_PASSWORD, HUB_STATIC_URL } from '../demo/honestyReload'
import { persistLocalAccount, readPersistedLocalAccount } from '../demo/roleSession'

export function Chooser() {
  const lastRole = readPersistedLocalAccount()

  return (
    <>
      <DemoBanner />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 className="page-title">Choose product surface</h1>
        <p className="page-sub">
          Two peer apps only: Wallet Subject desk and Obliged Entity operate desk (LETZZ Platform).
          Platform Owner ops monitoring is out of scope for this hub.
          {lastRole ? (
            <>
              {' '}
              Last surface this tab: <strong>{lastRole}</strong> (sessionStorage{' '}
              <code>letzz.debug.localAccount</code>).
            </>
          ) : null}
        </p>

        <div className="panel" style={{ marginBottom: '1.25rem' }} data-testid="hub-static-access">
          <h2 style={{ marginTop: 0 }}>Static partner access</h2>
          <p style={{ margin: '0.35rem 0' }}>
            Live URL (unchanging):{' '}
            <a href={HUB_STATIC_URL} data-testid="hub-static-url">
              {HUB_STATIC_URL}
            </a>
          </p>
          <p style={{ margin: '0.35rem 0' }}>
            Demo gate password (unchanging): <code data-testid="hub-static-password">{HUB_STATIC_PASSWORD}</code>{' '}
            (client-side SHA-256 only; not production auth).
          </p>
          <p className="honesty" style={{ marginBottom: 0 }}>
            GitHub Pages redeploys this hub on every push to <code>EOB-IP-BOX/test</code> <code>main</code>.
            Letz File monorepo pushes do not auto-publish here; sync this repo when Platform honesty
            desks change.
          </p>
        </div>

        <div className="panel" style={{ marginBottom: '1.25rem' }} data-testid="hub-nov-2026-sync">
          <h2 style={{ marginTop: 0 }}>Synced with Platform honesty (Nov 2026)</h2>
          <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem' }}>
            <li>Wallet Home / Documents / Assistant / Settings: generation-guarded DEMO re-reads</li>
            <li>OE Organisations + Screening: list, detail, and fixture-seed re-reads (not clearance)</li>
            <li>Guest share open + register honesty; grant pack step-up; Path B WebAuthn probe</li>
            <li>Hash-only vault model throughout; no Cognito / mesh / byte-release claims</li>
          </ul>
        </div>

        <div className="choose-grid">
          <Link
            to="/wallet/welcome"
            className="panel choose-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => persistLocalAccount('Wallet Subject')}
          >
            <h3>Wallet Subject desk</h3>
            <p>
              Simulated LETZZ Wallet web experience: Home, Documents, Packages, Assistant, Data
              Subject, Settings. Hash-only vault honesty and DEBUG loopback re-reads.
            </p>
            <span className="badge badge-demo">Interactive DEMO</span>
          </Link>
          <Link
            to="/oe/dashboard"
            className="panel choose-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => persistLocalAccount('Analyst')}
          >
            <h3>Obliged Entity operate desk</h3>
            <p>
              Simulated LETZZ Platform OE desk: subjects, cases, organisations, screening, requests,
              grants, search. No live screening provider or Cognito.
            </p>
            <span className="badge badge-demo">Interactive DEMO</span>
          </Link>
        </div>
      </div>
    </>
  )
}
