import { Link } from 'react-router-dom'
import { lockSession } from '../demo/auth'

export function DemoBanner() {
  return (
    <div className="demo-banner">
      <strong>LETZZ DEMO TEST HUB</strong> - Synthetic data only. No Cognito, AWS production, eIDAS, or AML6
      claims. Hash-only wallet vault model.{' '}
      <Link to="/" onClick={() => lockSession()}>
        Lock gate
      </Link>
      {' · '}
      <Link to="/choose">Surface chooser</Link>
    </div>
  )
}
