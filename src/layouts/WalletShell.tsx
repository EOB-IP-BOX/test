import { NavLink, Outlet } from 'react-router-dom'
import { DemoBanner } from '../components/DemoBanner'

const links = [
  { to: '/wallet/welcome', label: 'Welcome' },
  { to: '/wallet/home', label: 'Home' },
  { to: '/wallet/documents', label: 'Documents' },
  { to: '/wallet/packages', label: 'Packages' },
  { to: '/wallet/assistant', label: 'Assistant' },
  { to: '/wallet/data-subject', label: 'Data Subject' },
  { to: '/wallet/settings', label: 'Settings' },
]

export function WalletShell() {
  return (
    <>
      <DemoBanner />
      <div className="shell" data-testid="wallet-shell">
        <nav className="shell-nav" aria-label="Wallet Subject desk">
          <div className="shell-product-mark">
            <span className="shell-product-mark-fold" aria-hidden />
            <div>
              <div className="shell-product-mark-title">LETZZ Wallet Subject</div>
              <div className="shell-product-mark-sub">Hash-only demo desk</div>
            </div>
          </div>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <main className="shell-main">
          <Outlet />
        </main>
      </div>
    </>
  )
}
