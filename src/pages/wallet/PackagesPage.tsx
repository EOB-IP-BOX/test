import { useMemo, useState } from 'react'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

function buildManifestJson(
  pkg: { id: string; name: string; documentIds: string[] },
  documents: { id: string; title: string; hashSha256: string }[],
): string {
  const entries = pkg.documentIds.map((id) => {
    const doc = documents.find((d) => d.id === id)
    return {
      documentId: id,
      title: doc?.title ?? id,
      hashSha256: doc?.hashSha256 ?? null,
      demoOnly: true,
      vaultBytesIncluded: false,
    }
  })
  return JSON.stringify(
    {
      packageId: pkg.id,
      packageName: pkg.name,
      model: 'hash-only',
      entries,
    },
    null,
    2,
  )
}

export function PackagesPage() {
  const { state, sharePackage, createDraftPackage, togglePackageDocument, markPackageReady } =
    useDemoStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [newName, setNewName] = useState('AML refresh pack (DEMO)')
  const [newPurpose, setNewPurpose] = useState('Hash list for obliged entity re-check')
  const [newRecipient, setNewRecipient] = useState('Lux Compliance Demo OE')
  const [manifestNotice, setManifestNotice] = useState<string | null>(null)

  const selected = state.packages.find((p) => p.id === selectedId)

  const draftSelected = selected?.status === 'draft'

  const manifestPreview = useMemo(() => {
    if (!selected) return ''
    return buildManifestJson(selected, state.documents)
  }, [selected, state.documents])

  async function copyManifest() {
    if (!selected) return
    try {
      await navigator.clipboard.writeText(manifestPreview)
      setManifestNotice('DEMO: Manifest copied (IDs + hashes only, no PDF bytes).')
    } catch {
      setManifestNotice('Could not access clipboard.')
    }
  }

  function onCreateDraft() {
    const id = createDraftPackage(newName, newPurpose, newRecipient)
    setSelectedId(id)
    setManifestNotice(null)
  }

  return (
    <>
      <h1 className="page-title">Packages</h1>
      <p className="page-sub">
        Assemble and share hash lists <DemoPill />
      </p>
      <p className="honesty">
        Packages are bundles of document IDs and SHA-256 references. Mark shared updates demo state
        only; nothing uploads vault bytes from this static hub.
      </p>

      <div className="panel" style={{ marginBottom: '1rem' }} data-testid="wallet-package-create">
        <h2>Create draft pack (DEMO)</h2>
        <div className="field">
          <label htmlFor="pkg-name">Name</label>
          <input id="pkg-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pkg-purpose">Purpose</label>
          <input id="pkg-purpose" value={newPurpose} onChange={(e) => setNewPurpose(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="pkg-recipient">Recipient label</label>
          <input
            id="pkg-recipient"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
          />
        </div>
        <button type="button" className="btn btn-primary" onClick={onCreateDraft}>
          Create draft
        </button>
      </div>

      <div className="row-list" data-testid="wallet-packages-list">
        {state.packages.map((pkg) => (
          <div key={pkg.id} className="work-row">
            <div>
              <strong>{pkg.name}</strong>{' '}
              <span className="badge badge-pending">{pkg.status}</span>
              <div className="work-row-meta">{pkg.purpose}</div>
              <div className="work-row-meta">
                Recipient: {pkg.recipientLabel} · {pkg.documentIds.length} hash ref(s)
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSelectedId(pkg.id)}>
                View
              </button>
              {pkg.status === 'draft' && pkg.documentIds.length > 0 ? (
                <button type="button" className="btn btn-secondary" onClick={() => markPackageReady(pkg.id)}>
                  Mark ready
                </button>
              ) : null}
              {pkg.status === 'ready' ? (
                <button type="button" className="btn btn-primary" onClick={() => sharePackage(pkg.id)}>
                  Mark shared (DEMO)
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {selected ? (
        <div className="panel" style={{ marginTop: '1rem' }} data-testid="wallet-package-detail">
          <h2>Package contents (hash references)</h2>
          <p className="honesty">
            Gated honestly: no PDF download masquerading as production. Only document IDs and hashes
            from the demo vault index.
          </p>

          {draftSelected ? (
            <section style={{ marginBottom: '1rem' }} data-testid="wallet-package-assembler">
              <h3>Add documents to draft</h3>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                {state.documents.map((doc) => {
                  const checked = selected.documentIds.includes(doc.id)
                  return (
                    <li key={doc.id} style={{ marginBottom: '0.5rem' }}>
                      <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePackageDocument(selected.id, doc.id)}
                        />
                        <span>
                          {doc.title} <span className="hash-chip">{doc.hashSha256.slice(0, 16)}…</span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          <ul>
            {selected.documentIds.length === 0 ? (
              <li>No documents in this pack yet.</li>
            ) : (
              selected.documentIds.map((id) => {
                const doc = state.documents.find((d) => d.id === id)
                return (
                  <li key={id}>
                    {doc?.title ?? id} - <span className="hash-chip">{doc?.hashSha256 ?? 'missing'}</span>
                  </li>
                )
              })
            )}
          </ul>

          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: '0.75rem' }}
            disabled={selected.documentIds.length === 0}
            onClick={copyManifest}
          >
            Copy hash manifest (JSON)
          </button>
          {manifestNotice ? (
            <p className="honesty" style={{ marginTop: '0.5rem' }} data-testid="wallet-package-manifest-notice">
              {manifestNotice}
            </p>
          ) : null}
          <pre
            className="hash-chip"
            style={{
              marginTop: '0.75rem',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              maxHeight: '12rem',
              overflow: 'auto',
            }}
            data-testid="wallet-package-manifest-preview"
          >
            {manifestPreview}
          </pre>
        </div>
      ) : null}
    </>
  )
}
