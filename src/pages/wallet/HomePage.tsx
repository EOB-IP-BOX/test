import { Link } from 'react-router-dom'
import { DemoPill, GrantBadge } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function HomePage() {
  const { state, setGrantStatus, markInboxRead, approveStepUpChallenge } = useDemoStore()
  const pendingGrants = state.grants.filter((g) => g.status === 'pending')
  const pendingStepUps = state.stepUpChallenges.filter((c) => c.status === 'pending')

  return (
    <>
      <h1 className="page-title">Home</h1>
      <p className="page-sub">
        Inbox, grants, and DEBUG loopback step-up (Path A) <DemoPill />
      </p>

      <section className="panel" style={{ marginBottom: '1rem' }} aria-labelledby="wallet-home-step-up">
        <h2 id="wallet-home-step-up">Step-up inbox (Path A)</h2>
        <p className="honesty" style={{ marginTop: 0 }}>
          Approve here to satisfy view_full pack on the OE Grants desk. Loopback stand-in only, not
          production Face ID or WebAuthn Path B.
        </p>
        {pendingStepUps.length === 0 ? (
          <p>No pending step-up. On OE Grants, click View pack on a granted row to create a challenge.</p>
        ) : (
          <div className="row-list" data-testid="wallet-step-up-inbox">
            {pendingStepUps.map((row) => {
              const grant = state.grants.find((g) => g.id === row.grantId)
              return (
                <div key={row.id} className="work-row">
                  <div>
                    <span className="badge badge-pending">step-up pending</span>
                    <div style={{ marginTop: '0.35rem' }}>
                      <strong>{row.label}</strong>
                    </div>
                    <div className="work-row-meta">Challenge {row.id}</div>
                    {grant ? (
                      <div className="work-row-meta">
                        Grant {grant.id} · {grant.subjectName}
                      </div>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    aria-label={`Approve step-up ${row.id.slice(0, 8)}`}
                    onClick={() => approveStepUpChallenge(row.id)}
                  >
                    Approve (loopback)
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </section>

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
          {' · '}
          <Link to="/oe/grants">OE Grants desk (pack preview)</Link>
        </p>
      </section>
    </>
  )
}
