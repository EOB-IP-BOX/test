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
      <div className="shell">
        <nav className="shell-nav" aria-label="Obliged Entity operate desk">
          <div style={{ padding: '0 0.65rem 0.75rem', fontWeight: 600, color: 'var(--lz-accent)' }}>
            LETZZ Platform (OE)
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
