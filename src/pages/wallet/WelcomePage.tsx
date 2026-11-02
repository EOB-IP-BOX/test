import { Link } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'

export function WelcomePage() {
  return (
    <>
      <h1 className="page-title">Welcome</h1>
      <p className="page-sub">
        Wallet Subject onboarding preview <DemoPill />
      </p>
      <div className="panel">
        <p>
          You are viewing a fully simulated Wallet Subject desk for partner testing. Document bytes
          are not hosted here; only synthetic metadata and SHA-256-style hashes appear.
        </p>
        <p className="honesty">DEBUG loopback inbox and grants are enabled in this hub only.</p>
        <Link to="/wallet/home" className="btn btn-primary">
          Continue to Home
        </Link>
      </div>
    </>
  )
}
