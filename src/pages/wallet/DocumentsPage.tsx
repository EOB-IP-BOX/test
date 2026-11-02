import { useMemo, useState } from 'react'
import { DemoPill } from '../../components/StatusBadge'
import { verifyHashAgainstIndex } from '../../demo/documentVerify'
import { useDemoStore } from '../../demo/DemoStore'

export function DocumentsPage() {
  const { state } = useDemoStore()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [pasteHash, setPasteHash] = useState('')
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null)
  const [copyNotice, setCopyNotice] = useState<string | null>(null)

  const categories = useMemo(() => {
    const set = new Set(state.documents.map((d) => d.category))
    return ['all', ...Array.from(set).sort()]
  }, [state.documents])

  const filtered = useMemo(() => {
    if (categoryFilter === 'all') return state.documents
    return state.documents.filter((d) => d.category === categoryFilter)
  }, [categoryFilter, state.documents])

  const selected = state.documents.find((d) => d.id === selectedId)

  async function copyHash(hash: string) {
    try {
      await navigator.clipboard.writeText(hash)
      setCopyNotice('DEMO: Hash copied (reference only, not a file export).')
    } catch {
      setCopyNotice('Could not access clipboard in this browser.')
    }
  }

  function onVerify() {
    if (!selected) return
    const result = verifyHashAgainstIndex(selected, pasteHash)
    setVerifyMessage(result.message)
  }

  function onBlockedDownload() {
    setVerifyMessage(
      'Blocked in demo hub: no vault bytes or PDF masquerading as production. Real Wallet keeps files local; grants share hash lists.',
    )
  }

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

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <h2>Filter index</h2>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={categoryFilter === cat ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all' ? 'All categories' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="row-list" data-testid="wallet-documents-list">
        {filtered.map((doc) => (
          <div key={doc.id} className="work-row">
            <div>
              <strong>{doc.title}</strong> <DemoPill />
              <div className="work-row-meta">
                {doc.category} · {doc.id}
              </div>
              <p className="hash-chip">{doc.hashSha256}</p>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem' }}>{doc.note}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedId(doc.id)
                  setPasteHash('')
                  setVerifyMessage(null)
                  setCopyNotice(null)
                }}
              >
                Inspect
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => copyHash(doc.hashSha256)}>
                Copy hash
              </button>
            </div>
          </div>
        ))}
      </div>

      {copyNotice ? (
        <p className="honesty" style={{ marginTop: '1rem' }} data-testid="wallet-document-copy-notice">
          {copyNotice}
        </p>
      ) : null}

      {selected ? (
        <div className="panel" style={{ marginTop: '1rem' }} data-testid="wallet-document-detail">
          <h2>Inspect hash reference</h2>
          <p className="work-row-meta">{selected.title}</p>
          <p className="hash-chip">{selected.hashSha256}</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => copyHash(selected.hashSha256)}>
              Copy indexed hash
            </button>
            <button type="button" className="btn btn-danger" onClick={onBlockedDownload}>
              Download PDF (blocked)
            </button>
          </div>
          <div className="field" style={{ marginTop: '1rem', textAlign: 'left' }}>
            <label htmlFor="verify-hash">Verify-only (paste hash, no byte read)</label>
            <input
              id="verify-hash"
              value={pasteHash}
              onChange={(e) => setPasteHash(e.target.value)}
              placeholder="Paste SHA-256 reference to compare"
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={onVerify}>
            Run verify-only check
          </button>
          {verifyMessage ? (
            <p
              className="honesty"
              style={{ marginTop: '0.75rem' }}
              data-testid="wallet-document-verify-result"
            >
              {verifyMessage}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
