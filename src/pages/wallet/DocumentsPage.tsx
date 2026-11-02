import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function DocumentsPage() {
  const { state } = useDemoStore()

  return (
    <>
      <h1 className="page-title">Documents</h1>
      <p className="page-sub">
        Hash-only vault index (no production export) <DemoPill />
      </p>
      <p className="honesty">
        Prometheus honesty: vault bytes stay local on real Wallet. This page shows synthetic titles
        and demo hashes only.
      </p>
      <div className="row-list">
        {state.documents.map((doc) => (
          <div key={doc.id} className="work-row">
            <div>
              <strong>{doc.title}</strong> <DemoPill />
              <div className="work-row-meta">
                {doc.category} · {doc.id}
              </div>
              <p className="hash-chip">{doc.hashSha256}</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem' }}>{doc.note}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
