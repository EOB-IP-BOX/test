import { Link, useSearchParams } from 'react-router-dom'
import { DemoPill } from '../components/StatusBadge'
import { resolveGuestShareRegistration } from '../demo/guestShareDemo'

export function GuestShareRegisterPage() {
  const [params] = useSearchParams()
  const desk = resolveGuestShareRegistration(params.get('from'))

  return (
    <div className="guest-desk" data-testid="guest-share-register">
      <p className="page-sub">
        Registration invite path <DemoPill />
      </p>
      <h1 className="page-title">{desk.headline}</h1>
      <p className="honesty">{desk.body}</p>

      <details className="panel honesty-disclosure" open>
        <summary>No instant web signup</summary>
        <p style={{ margin: '0.75rem 0 0' }}>
          Cognito-backed registration and hosted wallet provisioning are not available on this route.
          Opening a guest share does not mint a LETZZ Wallet vault on Platform.
        </p>
        <p style={{ margin: '0.75rem 0 0' }}>{desk.local_dev_hint}</p>
      </details>

      <div className="panel" style={{ marginTop: '1rem' }}>
        <h2>Install LETZZ Wallet</h2>
        <p className="honesty">
          Use the App Store build when available. Until then, ask the sender for another share path
          or use organisation flows you already trust.
        </p>
      </div>

      <nav className="guest-desk-links" aria-label="Registration shortcuts">
        <Link to="/choose" className="btn btn-secondary">
          Local Cloud sign in
        </Link>
        {desk.from_guest_share ? (
          <Link to="/choose" className="btn btn-secondary">
            Back to LETZZ home
          </Link>
        ) : null}
      </nav>
    </div>
  )
}
