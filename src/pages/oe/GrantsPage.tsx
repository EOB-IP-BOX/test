import { DemoPill, GrantBadge } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function GrantsPage() {
  const { state, setGrantStatus } = useDemoStore()

  return (
    <>
      <h1 className="page-title">Grants</h1>
      <p className="page-sub">
        OE-side grant queue (mirrors wallet Home actions) <DemoPill />
      </p>
      <div className="row-list">
        {state.grants.map((g) => (
          <div key={g.id} className="work-row">
            <div>
              <GrantBadge status={g.status} /> <strong>{g.subjectName}</strong>
              <div className="work-row-meta">{g.oeName}</div>
              <div className="work-row-meta">{g.scope}</div>
            </div>
            {g.status === 'pending' ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn-primary" onClick={() => setGrantStatus(g.id, 'granted')}>
                  Approve
                </button>
                <button type="button" className="btn btn-danger" onClick={() => setGrantStatus(g.id, 'rejected')}>
                  Deny
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  )
}
