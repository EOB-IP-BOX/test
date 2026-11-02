import { Link } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function SubjectsPage() {
  const { state } = useDemoStore()

  return (
    <>
      <h1 className="page-title">Wallet subjects</h1>
      <p className="page-sub">
        Directory of demo subjects <DemoPill />
      </p>
      <div className="row-list">
        {state.subjects.map((s) => (
          <Link
            key={s.id}
            to={`/oe/subjects/${s.id}`}
            className="work-row"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div>
              <strong>{s.displayName}</strong>
              <div className="work-row-meta">
                {s.role} · {s.demoLabel}
              </div>
            </div>
            <span className="badge badge-demo">view</span>
          </Link>
        ))}
      </div>
    </>
  )
}
