import { Link } from 'react-router-dom'
import { DemoBanner } from '../components/DemoBanner'

const DOC_BASE = `${import.meta.env.BASE_URL}docs`

export function DocsLibrary() {
  return (
    <>
      <DemoBanner />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p className="page-sub" style={{ marginBottom: '0.5rem' }}>
          <Link to="/choose">← Surface chooser</Link>
        </p>
        <h1 className="page-title">Business documentation</h1>
        <p className="page-sub">
          Institutional partner briefs for LETZZ Wallet and LETZZ Platform. Same visual identity as
          the interactive desks. Session must stay unlocked (Alma gate). Language is kept
          professional for institutional review.
        </p>

        <div className="panel" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ marginTop: 0 }}>How to read these briefs</h2>
          <ul style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem' }}>
            <li>
              Software brief splits into <strong>For everyone</strong> and <strong>For builders</strong>{' '}
              on one page, with diagrams for both audiences.
            </li>
            <li>
              Business brief covers customers, offer, revenue design, operating model, and funding
              narrative without inventing euro prices or certification claims.
            </li>
            <li>
              Interactive Wallet and Obliged Entity desks remain available from the chooser for
              hands-on demonstration.
            </li>
          </ul>
        </div>

        <div className="choose-grid">
          <a
            className="panel choose-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
            href={`${DOC_BASE}/software.html`}
            data-testid="docs-link-software"
          >
            <h3>How the software works</h3>
            <p>
              Full product functionality: two apps, five distinct states, Wallet and Platform
              capabilities, trust model, and a builders architecture track with diagrams.
            </p>
            <span className="badge badge-demo">HTML BRIEF</span>
          </a>
          <a
            className="panel choose-card"
            style={{ textDecoration: 'none', color: 'inherit' }}
            href={`${DOC_BASE}/business.html`}
            data-testid="docs-link-business"
          >
            <h3>How the business works</h3>
            <p>
              Commercial thesis, two-customer model, revenue design around cost-per-user X, stage
              gates, operating accountability, and meeting funding narrative.
            </p>
            <span className="badge badge-demo">HTML BRIEF</span>
          </a>
        </div>

        <p className="honesty" style={{ marginTop: '1.25rem' }}>
          Static files live under <code>docs/</code> on this Pages site. Opening them requires the
          same unlocked hub session. Direct cold links without Alma redirect to the demo gate.
        </p>
      </div>
    </>
  )
}
