import { Link } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

function canQuickViewPack(
  linkedGrantId: string | undefined,
  grants: { id: string; status: string }[],
): boolean {
  if (!linkedGrantId) return false
  const grant = grants.find((g) => g.id === linkedGrantId)
  return grant?.status === 'granted' || grant?.status === 'revoked'
}

export function CasesPage() {
  const { state } = useDemoStore()

  return (
    <>
      <h1 className="page-title">Cases</h1>
      <p className="page-sub">
        Compliance case files (synthetic) <DemoPill />
      </p>
      <div className="row-list" data-testid="oe-cases-list">
        {state.cases.map((c) => {
          const sub = state.subjects.find((s) => s.id === c.subjectId)
          const showPack = canQuickViewPack(c.linkedGrantId, state.grants)
          return (
            <div key={c.id} className="work-row">
              <Link
                to={`/oe/cases/${c.id}`}
                style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}
              >
                <div>
                  <strong>{c.title}</strong>
                  <div className="work-row-meta">
                    {sub?.displayName} · Assignee: {c.assignee}
                    {c.linkedGrantId ? ` · Grant ${c.linkedGrantId}` : ''}
                  </div>
                </div>
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                <span className="badge badge-pending">{c.status}</span>
                {showPack ? (
                  <Link
                    to={`/oe/cases/${c.id}?viewPack=1`}
                    className="btn btn-secondary"
                    data-testid={`case-list-view-pack-${c.id}`}
                    style={{ fontSize: '0.8125rem', padding: '0.35rem 0.65rem' }}
                  >
                    View pack
                  </Link>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
