import { useMemo, useState } from 'react'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'
import type { LifeStoreSourceStatus } from '../../demo/types'

const DEMO_OE = 'Lux Compliance Demo OE'

function statusLabel(status: LifeStoreSourceStatus): string {
  switch (status) {
    case 'not_configured':
      return 'not_configured'
    case 'indexing':
      return 'indexing'
    case 'ready':
      return 'ready'
    case 'denied':
      return 'denied'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export function DataSubjectPage() {
  const { state, grantLifeStoreReadOnly, revokeLifeStoreGrant } = useDemoStore()
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(
    state.lifeStoreSources[0]?.id ?? null,
  )
  const [byteGateMessage, setByteGateMessage] = useState('')

  const selected = state.lifeStoreSources.find((s) => s.id === selectedSourceId)
  const linkedDocs = useMemo(() => {
    if (!selected) return []
    return selected.linkedDocumentIds
      .map((id) => state.documents.find((d) => d.id === id))
      .filter(Boolean)
  }, [selected, state.documents])

  const grantedSources = state.lifeStoreSources.filter((s) => s.readOnlyGrantOe)

  function onSimulateGrant() {
    if (!selected || selected.status !== 'ready') return
    grantLifeStoreReadOnly(selected.id, DEMO_OE)
    setByteGateMessage('')
  }

  function onTryOpenBytes() {
    setByteGateMessage(
      'platform_vault_bytes_blocked: This hub indexes hashes on the simulated device only. ' +
        'LETZZ Platform never receives vault bytes in the hash-only model. Open Documents for metadata.',
    )
  }

  return (
    <>
      <h1 className="page-title">Data Subject</h1>
      <p className="page-sub">
        Life store index (Codex 4.4 DEMO) <DemoPill />
      </p>
      <p className="honesty" data-testid="data-subject-honesty">
        User-controlled, locally indexed sources. Indexing runs on this simulated device only (not on
        LETZZ Platform). Read-only grants expose hash references to an OE desk only after you
        simulate consent here. OE subject views mirror grants via shared demo storage, not a
        Platform search index.
      </p>

      <div className="panel" data-testid="data-subject-life-store">
        <h2>Life-store connectors</h2>
        <div className="row-list">
          {state.lifeStoreSources.map((source) => (
            <button
              key={source.id}
              type="button"
              className="work-row"
              style={{
                width: '100%',
                textAlign: 'left',
                border: selectedSourceId === source.id ? '2px solid var(--accent, #8c1e2d)' : undefined,
                cursor: 'pointer',
                background: 'inherit',
              }}
              data-testid={`life-source-${source.id}`}
              onClick={() => {
                setSelectedSourceId(source.id)
                setByteGateMessage('')
              }}
            >
              <div>
                <strong>{source.label}</strong>
                <div className="work-row-meta">
                  {source.connector} · status {statusLabel(source.status)}
                  {source.status === 'indexing' && source.indexingPercent != null
                    ? ` · ${source.indexingPercent}% (device index)`
                    : null}
                </div>
                {source.status === 'indexing' && source.indexingPercent != null ? (
                  <div
                    className="index-progress"
                    role="progressbar"
                    aria-valuenow={source.indexingPercent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    data-testid={`life-source-index-progress-${source.id}`}
                  >
                    <div
                      className="index-progress-fill"
                      style={{ width: `${source.indexingPercent}%` }}
                    />
                  </div>
                ) : null}
                {source.readOnlyGrantOe ? (
                  <div className="work-row-meta" data-testid={`life-source-grant-${source.id}`}>
                    Read-only grant → {source.readOnlyGrantOe}
                  </div>
                ) : null}
              </div>
              <span className="badge badge-demo">device index</span>
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="panel" style={{ marginTop: '1rem' }} data-testid="data-subject-source-detail">
          <h2>{selected.label}</h2>
          <p className="work-row-meta">
            Indexed hashes: {linkedDocs.length}. Grants are read-only; revoke anytime.
          </p>
          {linkedDocs.length > 0 ? (
            <ul>
              {linkedDocs.map((doc) => (
                <li key={doc!.id}>
                  {doc!.title} · <code>{doc!.hashSha256.slice(0, 24)}…</code>
                </li>
              ))}
            </ul>
          ) : (
            <p className="honesty">No document hashes linked for this connector in demo seed.</p>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={selected.status !== 'ready' || !!selected.readOnlyGrantOe}
              data-testid="data-subject-simulate-grant"
              onClick={onSimulateGrant}
            >
              Simulate read-only grant ({DEMO_OE})
            </button>
            {selected.readOnlyGrantOe ? (
              <button
                type="button"
                className="btn btn-danger"
                data-testid="data-subject-revoke-grant"
                onClick={() => revokeLifeStoreGrant(selected.id)}
              >
                Revoke source grant
              </button>
            ) : null}
            <button type="button" className="btn btn-secondary" onClick={onTryOpenBytes}>
              Try open vault bytes (blocked)
            </button>
          </div>
          {byteGateMessage ? (
            <p className="honesty" role="alert" data-testid="data-subject-byte-gate">
              {byteGateMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="panel" style={{ marginTop: '1rem' }} data-testid="data-subject-derived-rows">
        <h2>Derived index rows</h2>
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
      </div>

      {grantedSources.length > 0 ? (
        <p className="honesty" style={{ marginTop: '1rem' }} data-testid="data-subject-grant-summary">
          Active read-only source grants:{' '}
          {grantedSources.map((s) => `${s.label} → ${s.readOnlyGrantOe}`).join('; ')}. OE desks still
          need wallet grant + step-up for view_full packs (Grants desk).
        </p>
      ) : null}
    </>
  )
}
