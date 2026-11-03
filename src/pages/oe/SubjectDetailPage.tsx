import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { HonestyReloadControl } from '../../components/HonestyReloadControl'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function SubjectDetailPage() {
  const { id } = useParams()
  const { state } = useDemoStore()
  const [detailStamp, setDetailStamp] = useState<string | null>(null)
  const subject = state.subjects.find((s) => s.id === id)
  const cases = state.cases.filter((c) => c.subjectId === id)

  const deskOeNames = useMemo(() => {
    if (!subject) return new Set<string>()
    return new Set(
      state.grants.filter((g) => g.subjectName === subject.displayName).map((g) => g.oeName),
    )
  }, [state.grants, subject])

  const lifeStoreForDesk = useMemo(() => {
    if (deskOeNames.size === 0) return []
    return state.lifeStoreSources.filter(
      (s) => s.readOnlyGrantOe != null && deskOeNames.has(s.readOnlyGrantOe),
    )
  }, [deskOeNames, state.lifeStoreSources])

  const indexingOnDevice = state.lifeStoreSources.filter((s) => s.status === 'indexing')

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
      <HonestyReloadControl
        surface="subject detail"
        testId="oe-subject-detail-reload"
        honesty="getSubject simulation only. Distinct from the subjects directory. Not identity verification, not vault access, not licensed clearance."
        onReplaced={() => setDetailStamp(new Date().toISOString())}
      />
      {detailStamp ? (
        <p className="work-row-meta" data-testid="oe-subject-detail-stamp">
          Last subject detail re-read: {detailStamp}
        </p>
      ) : null}
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

      <div
        className="panel"
        style={{ marginTop: '1rem' }}
        data-testid="oe-subject-life-store-sync"
      >
        <h2>Wallet life-store (DEMO sync)</h2>
        <p className="honesty">
          Hash references appear here only when the wallet Data Subject tab grants read-only access
          to an OE desk tied to this subject&apos;s grants. Indexing progress stays on the device;
          LETZZ Platform does not build this life-store index in the hub.
        </p>
        {indexingOnDevice.length > 0 ? (
          <p className="work-row-meta" data-testid="oe-subject-indexing-hint">
            Device indexing in progress:{' '}
            {indexingOnDevice
              .map((s) => `${s.label} (${s.indexingPercent ?? 0}%)`)
              .join('; ')}
            . OE cannot rely on these hashes until indexing completes and the wallet grants access.
          </p>
        ) : null}
        {lifeStoreForDesk.length > 0 ? (
          <ul>
            {lifeStoreForDesk.map((s) => (
              <li key={s.id} data-testid={`oe-life-grant-${s.id}`}>
                {s.label} → read-only grant for {s.readOnlyGrantOe} ({s.linkedDocumentIds.length}{' '}
                hash refs)
              </li>
            ))}
          </ul>
        ) : (
          <p>No read-only life-store grants for this subject&apos;s OE desks yet.</p>
        )}
      </div>
    </>
  )
}
