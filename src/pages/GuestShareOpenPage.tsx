import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DemoPill } from '../components/StatusBadge'
import {
  checkGuestShareDownloadAvailability,
  resolveGuestShareOpen,
} from '../demo/guestShareDemo'

export function GuestShareOpenPage() {
  const { token = '' } = useParams()
  const payload = useMemo(() => resolveGuestShareOpen(token), [token])
  const [downloadMessage, setDownloadMessage] = useState<string | null>(null)

  if (!payload) {
    return (
      <div className="guest-desk" data-testid="guest-share-open">
        <h1 className="page-title">Share unavailable</h1>
        <p className="honesty">
          DEMO hub only accepts token <code>{'demo-hub-guest-share'}</code>. Real Platform uses live
          one-time tokens from OE guest share creation.
        </p>
        <Link to="/choose" className="btn btn-secondary">
          Back to chooser
        </Link>
      </div>
    )
  }

  const documents = payload.materialization.documents

  function onCheckDownload(documentId: string) {
    const result = checkGuestShareDownloadAvailability({ token, documentId })
    setDownloadMessage(`${result.honesty}: ${result.message}`)
  }

  return (
    <div className="guest-desk" data-testid="guest-share-open" data-codex-rule="4.3">
      <p className="page-sub">
        One-time guest link desk <DemoPill />
      </p>
      <h1 className="page-title">{payload.headline}</h1>
      <p className="honesty">{payload.body}</p>
      {payload.note ? <p className="honesty">{payload.note}</p> : null}

      <details className="panel honesty-disclosure" open>
        <summary>Access mode and materialization limits</summary>
        <p style={{ margin: '0.75rem 0 0' }}>
          Access mode describes what the sender intended. Document bytes appear only when an approved
          one-time materialization path is configured. This desk does not stream wallet vault bytes
          in the current build.
        </p>
        <p style={{ margin: '0.5rem 0 0' }}>
          Access mode: {payload.access_mode}. Opening this link does not use production mesh
          transport or prove delivery to a wallet app.
        </p>
      </details>

      {documents.length > 0 ? (
        <details className="panel honesty-disclosure" open data-testid="guest-share-documents">
          <summary>Shared items (hash metadata only)</summary>
          <p style={{ margin: '0.75rem 0 0' }}>
            Listed items are hash metadata only until an owner-approved byte release path is
            configured. Download or view actions return an honest not-available response, not a PDF.
          </p>
          <ul style={{ margin: '0.75rem 0 0', paddingLeft: '1.25rem' }}>
            {documents.map((doc) => (
              <li key={doc.document_id} style={{ marginBottom: '0.75rem' }}>
                <span className="hash-chip">{doc.document_id}</span>
                {doc.content_hash ? (
                  <span className="work-row-meta" style={{ display: 'block' }}>
                    SHA-256: {doc.content_hash.slice(0, 16)}…
                  </span>
                ) : null}
                <span className="work-row-meta" style={{ display: 'block' }}>
                  Honesty: {doc.honesty}
                </span>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => onCheckDownload(doc.document_id)}
                >
                  Check download availability
                </button>
              </li>
            ))}
          </ul>
          <p className="honesty" style={{ marginTop: '0.5rem' }}>
            {payload.materialization.note}
          </p>
          {downloadMessage ? (
            <p className="honesty" role="status" data-testid="guest-share-download-status">
              {downloadMessage}
            </p>
          ) : null}
        </details>
      ) : null}

      {payload.show_register_cta ? (
        <p style={{ marginTop: '1.25rem' }}>
          <span className="work-row-meta" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Registration opens the standard invite path; it is not automatic account creation from
            this link alone.
          </span>
          <Link
            to={payload.registration_invite_path}
            className="btn btn-primary"
            data-testid="guest-share-register-cta"
          >
            Create a LETZZ Wallet account
          </Link>
        </p>
      ) : null}

      <p className="honesty" style={{ marginTop: '1.5rem' }}>
        This page records link use and invites registration. It is not verified identity, clearance,
        or a document vault browser.
      </p>
    </div>
  )
}
