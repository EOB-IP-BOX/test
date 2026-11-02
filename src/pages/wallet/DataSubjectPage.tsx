import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function DataSubjectPage() {
  const { state } = useDemoStore()

  return (
    <>
      <h1 className="page-title">Data Subject</h1>
      <p className="page-sub">
        User-controlled life store (read-only demo index) <DemoPill />
      </p>
      <div className="row-list">
        {state.dataSubjectRows.map((row) => (
          <div key={row.id} className="work-row">
            <div>
              <strong>{row.label}</strong>
              <div className="work-row-meta">
                Source: {row.source} · {row.readOnly ? 'read-only grant' : 'editable'}
              </div>
            </div>
            <span className="badge badge-demo">local index</span>
          </div>
        ))}
      </div>
    </>
  )
}
