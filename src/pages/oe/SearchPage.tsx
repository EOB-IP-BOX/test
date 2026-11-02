import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function SearchPage() {
  const { state } = useDemoStore()
  const [q, setQ] = useState('')

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return []
    return state.subjects.filter(
      (s) =>
        s.displayName.toLowerCase().includes(needle) ||
        s.demoLabel.toLowerCase().includes(needle),
    )
  }, [q, state.subjects])

  return (
    <>
      <h1 className="page-title">Search</h1>
      <p className="page-sub">
        Subject lookup (local demo index) <DemoPill />
      </p>
      <div className="field">
        <label htmlFor="search">Query</label>
        <input
          id="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try Bond, Swift, Karlo…"
        />
      </div>
      {q.trim() ? (
        results.length ? (
          <div className="row-list">
            {results.map((s) => (
              <Link
                key={s.id}
                to={`/oe/subjects/${s.id}`}
                className="work-row"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <strong>{s.displayName}</strong>
              </Link>
            ))}
          </div>
        ) : (
          <p>No demo subjects matched.</p>
        )
      ) : (
        <p className="honesty">Search runs client-side over synthetic subject names only.</p>
      )}
    </>
  )
}
