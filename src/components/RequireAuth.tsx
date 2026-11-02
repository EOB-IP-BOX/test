import { Navigate, useLocation } from 'react-router-dom'
import { isSessionUnlocked } from '../demo/auth'
import type { ReactNode } from 'react'

export function RequireAuth({ children }: { children: ReactNode }) {
  const loc = useLocation()
  if (!isSessionUnlocked()) {
    return <Navigate to="/" replace state={{ from: loc.pathname }} />
  }
  return children
}
