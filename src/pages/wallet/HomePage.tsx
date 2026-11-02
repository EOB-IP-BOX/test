import { Link } from 'react-router-dom'
import { DemoPill, GrantBadge } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function HomePage() {
  const { state, setGrantStatus, markInboxRead } = useDemoStore()
  const pendingGrants = state.grants.filter((g) => g.status === 'pending')

  return (
    <>
      <h1 className="page-title">Home</h1>
      <p className="page-sub">
        Inbox and grant actions <DemoPill />
      </p>

      <section className="panel" style={{ marginBottom: '1rem' }}>
        <h2>Inbox</h2>
        <div className="row-list">
          {state.inbox.map((item) => (
            <div key={item.id} className="work-row">
              <div>
                <strong>{item.subject}</strong>
                {item.unread ? <span className="badge badge-pending"> unread</span> : null}
                <div className="work-row-meta">{item.from}</div>
                <p style={{ margin: '0.35rem 0 0' }}>{item.preview}</p>
              </div>
              {item.unread ? (
                <button type="button" className="btn btn-secondary" onClick={() => markInboxRead(item.id)}>
                  Mark read
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Pending grants</h2>
        {pendingGrants.length === 0 ? (
          <p>All grants handled in this session. Reset demo in Settings.</p>
        ) : (
          <div className="row-list">
            {pendingGrants.map((g) => (
              <div key={g.id} className="work-row">
                <div>
                  <GrantBadge status={g.status} /> <strong>{g.oeName}</strong>
                  <div className="work-row-meta">{g.scope}</div>
                  <div className="work-row-meta">Subject: {g.subjectName}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button type="button" className="btn btn-primary" onClick={() => setGrantStatus(g.id, 'granted')}>
                    Grant
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => setGrantStatus(g.id, 'rejected')}>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <p style={{ marginTop: '1rem' }}>
          <Link to="/wallet/packages">View packages</Link>
        </p>
      </section>
    </>
  )
}
