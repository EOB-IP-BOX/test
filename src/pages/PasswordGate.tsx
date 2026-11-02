import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { isSessionUnlocked, unlockSession, verifyDemoPassword } from '../demo/auth'

export function PasswordGate() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (isSessionUnlocked()) {
    return <Navigate to="/choose" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const ok = await verifyDemoPassword(password)
      if (ok) {
        unlockSession()
        navigate('/choose')
      } else {
        setError('Incorrect password for this demo hub.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="gate-page" data-testid="demo-hub-password-gate">
      <div className="panel gate-card">
        <h1 className="page-title">LETZZ Test Hub</h1>
        <p className="page-sub">Letz File family demo gate (client-side only on GitHub Pages).</p>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="pw">Demo password</label>
            <input
              id="pw"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter hub password"
            />
          </div>
          {error ? (
            <p style={{ color: 'var(--lz-danger)', fontSize: '0.8125rem' }}>{error}</p>
          ) : null}
          <button type="submit" className="btn btn-primary" disabled={busy || !password}>
            {busy ? 'Checking…' : 'Enter demo hub'}
          </button>
        </form>
        <p className="honesty">
          This gate stores a session flag in sessionStorage after a SHA-256 check. It is not server
          authentication. Owner password is documented in the repo README.
        </p>
      </div>
    </div>
  )
}
