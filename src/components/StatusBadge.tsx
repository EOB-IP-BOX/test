import type { GrantStatus } from '../demo/types'

export function GrantBadge({ status }: { status: GrantStatus }) {
  const cls =
    status === 'pending' ? 'badge-pending' : status === 'granted' ? 'badge-granted' : 'badge-rejected'
  return <span className={`badge ${cls}`}>{status}</span>
}

export function DemoPill() {
  return <span className="badge badge-demo">DEMO</span>
}
