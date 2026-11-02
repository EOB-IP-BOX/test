import { Link, useParams } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function SubjectDetailPage() {
  const { id } = useParams()
  const { state } = useDemoStore()
  const subject = state.subjects.find((s) => s.id === id)
  const cases = state.cases.filter((c) => c.subjectId === id)

  if (!subject) {
    return (
      <p>
        Subject not found. <Link to="/oe/subjects">Back</Link>
      </p>
    )
  }

  return (
    <>
      <h1 className="page-title">{subject.displayName}</h1>
      <p className="page-sub">
        {subject.role} · {subject.demoLabel} <DemoPill />
      </p>
      <div className="panel">
        <h2>Related cases</h2>
        {cases.length === 0 ? (
          <p>No cases for this subject in demo seed.</p>
        ) : (
          <ul>
            {cases.map((c) => (
              <li key={c.id}>
                <Link to={`/oe/cases/${c.id}`}>{c.title}</Link> ({c.status})
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
