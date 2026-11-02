import { Link } from 'react-router-dom'
import { DemoBanner } from '../components/DemoBanner'

export function Chooser() {
  return (
    <>
      <DemoBanner />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>
        <h1 className="page-title">Choose product surface</h1>
        <p className="page-sub">
          Two peer apps only: Wallet Subject desk and Obliged Entity operate desk (LETZZ Platform).
          Platform Owner ops monitoring is out of scope for this hub.
        </p>
        <div className="choose-grid">
          <Link to="/wallet/welcome" className="panel choose-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Wallet Subject desk</h3>
            <p>
              Simulated LETZZ Wallet web experience: Home, Documents, Packages, Assistant, Data
              Subject, Settings. Hash-only vault honesty.
            </p>
            <span className="badge badge-demo">Interactive DEMO</span>
          </Link>
          <Link to="/oe/dashboard" className="panel choose-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Obliged Entity operate desk</h3>
            <p>
              Simulated LETZZ Platform OE desk: subjects, cases, requests, grants, search. No live
              screening or Cognito.
            </p>
            <span className="badge badge-demo">Interactive DEMO</span>
          </Link>
        </div>
      </div>
    </>
  )
}
