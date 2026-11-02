import { useState } from 'react'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function PackagesPage() {
  const { state, sharePackage } = useDemoStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = state.packages.find((p) => p.id === selectedId)

  return (
    <>
      <h1 className="page-title">Packages</h1>
      <p className="page-sub">
        Assemble and share hash lists <DemoPill />
      </p>
      <div className="row-list">
        {state.packages.map((pkg) => (
          <div key={pkg.id} className="work-row">
            <div>
              <strong>{pkg.name}</strong>{' '}
              <span className="badge badge-pending">{pkg.status}</span>
              <div className="work-row-meta">{pkg.purpose}</div>
              <div className="work-row-meta">Recipient: {pkg.recipientLabel}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedId(pkg.id)}>
                View
              </button>
              {pkg.status !== 'shared' ? (
                <button type="button" className="btn btn-primary" onClick={() => sharePackage(pkg.id)}>
                  Mark shared (DEMO)
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {selected ? (
        <div className="panel" style={{ marginTop: '1rem' }}>
          <h2>Package contents (hash references)</h2>
          <p className="honesty">
            Gated honestly: no PDF download masquerading as production. Only document IDs and hashes
            from the demo vault index.
          </p>
          <ul>
            {selected.documentIds.map((id) => {
              const doc = state.documents.find((d) => d.id === id)
              return (
                <li key={id}>
                  {doc?.title ?? id} - <span className="hash-chip">{doc?.hashSha256 ?? 'missing'}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </>
  )
}
