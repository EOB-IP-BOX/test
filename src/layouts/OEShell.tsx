import { NavLink, Outlet } from 'react-router-dom'
import { DemoBanner } from '../components/DemoBanner'

const links = [
  { to: '/oe/dashboard', label: 'Dashboard' },
  { to: '/oe/subjects', label: 'Subjects' },
  { to: '/oe/cases', label: 'Cases' },
  { to: '/oe/requests', label: 'Requests' },
  { to: '/oe/grants', label: 'Grants' },
  { to: '/oe/search', label: 'Search' },
]

export function OEShell() {
  return (
    <>
      <DemoBanner />
      <div className="shell" data-testid="oe-shell">
        <nav className="shell-nav" aria-label="Obliged Entity operate desk">
          <div className="shell-product-mark">
            <span className="shell-product-mark-fold" aria-hidden />
            <div>
              <div className="shell-product-mark-title">LETZZ Platform</div>
              <div className="shell-product-mark-sub">Obliged Entity operate desk</div>
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
