import { Link, useParams } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'
import type { OeCase } from '../../demo/types'

export function CaseDetailPage() {
  const { id } = useParams()
  const { state, updateCaseStatus } = useDemoStore()
  const caseRow = state.cases.find((c) => c.id === id)

  if (!caseRow) {
    return (
      <p>
        Case not found. <Link to="/oe/cases">Back</Link>
      </p>
    )
  }

  const statuses: OeCase['status'][] = ['open', 'review', 'closed']

  return (
    <>
      <h1 className="page-title">{caseRow.title}</h1>
      <p className="page-sub">
        Status: {caseRow.status} <DemoPill />
      </p>
      <div className="panel">
        <p>Assignee: {caseRow.assignee}</p>
        <p className="work-row-meta">Updated: {caseRow.updatedAt}</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              className={caseRow.status === s ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => updateCaseStatus(caseRow.id, s)}
            >
              Set {s}
            </button>
          ))}
        </div>
        <p className="honesty">Case transitions are local demo state only.</p>
      </div>
    </>
  )
}
