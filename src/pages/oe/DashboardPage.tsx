import { Link } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function DashboardPage() {
  const { state } = useDemoStore()
  const openCases = state.cases.filter((c) => c.status !== 'closed').length
  const pendingGrants = state.grants.filter((g) => g.status === 'pending').length

  return (
    <>
      <h1 className="page-title">Operate dashboard</h1>
      <p className="page-sub">
        LETZZ Platform OE desk metrics (DEMO) <DemoPill />
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
        <div className="panel">
          <div className="work-row-meta">Open cases</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>{openCases}</div>
        </div>
        <div className="panel">
          <div className="work-row-meta">Pending grants</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>{pendingGrants}</div>
        </div>
        <div className="panel">
          <div className="work-row-meta">Wallet subjects</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 600 }}>{state.subjects.length}</div>
        </div>
      </div>
      <p style={{ marginTop: '1.25rem' }}>
        <Link to="/oe/cases">Review cases</Link> · <Link to="/oe/requests">Compose request</Link>
      </p>
      <p className="honesty">No live KYC provider, screening clear, or Cognito session in this hub.</p>
    </>
  )
}
