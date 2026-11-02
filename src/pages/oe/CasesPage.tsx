import { Link } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function CasesPage() {
  const { state } = useDemoStore()

  return (
    <>
      <h1 className="page-title">Cases</h1>
      <p className="page-sub">
        Compliance case files (synthetic) <DemoPill />
      </p>
      <div className="row-list">
        {state.cases.map((c) => {
          const sub = state.subjects.find((s) => s.id === c.subjectId)
          return (
            <Link
              key={c.id}
              to={`/oe/cases/${c.id}`}
              className="work-row"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div>
                <strong>{c.title}</strong>
                <div className="work-row-meta">
                  {sub?.displayName} · Assignee: {c.assignee}
                </div>
              </div>
              <span className="badge badge-pending">{c.status}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
