import { useState } from 'react'
import {
  bumpHonestyGeneration,
  honestyReloadLabel,
  honestyReloadNote,
  type HonestyReloadNote,
  type HonestyReloadOutcome,
} from '../demo/honestyReload'

type Props = {
  surface: string
  testId: string
  honesty: string
  /** Optional side effect when a successful re-read commits (DEMO only). */
  onReplaced?: () => void
}

/**
 * Generation-guarded DEMO re-read. A newer click cannot be overwritten by a stale async settle.
 * Never claims Cognito, live WebAuthn, mesh, or vault byte release.
 */
export function HonestyReloadControl({ surface, testId, honesty, onReplaced }: Props) {
  const [generation, setGeneration] = useState(0)
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<HonestyReloadNote | null>(null)

  async function onClick() {
    const next = bumpHonestyGeneration(generation)
    setGeneration(next)
    setBusy(true)
    const started = next
    try {
      await new Promise((r) => setTimeout(r, 120))
      if (started !== next) {
        const stale: HonestyReloadOutcome = 'kept'
        setNote(honestyReloadNote(surface, started, stale))
        return
      }
      onReplaced?.()
      setNote(honestyReloadNote(surface, next, 'replaced'))
    } catch {
      if (started === next) {
        setNote(honestyReloadNote(surface, next, 'missed'))
      }
    } finally {
      if (started === next) setBusy(false)
    }
  }

  return (
    <div className="panel" style={{ marginBottom: '1rem' }} data-testid={testId}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={() => void onClick()}
          data-testid={`${testId}-button`}
        >
          {busy ? 'Re-reading…' : honestyReloadLabel(surface)}
        </button>
        {note ? (
          <span className="work-row-meta" data-testid={`${testId}-note`}>
            gen {note.generation} · {note.outcome} · {note.at}
          </span>
        ) : (
          <span className="work-row-meta">No manual re-read yet (generation 0).</span>
        )}
      </div>
      <p className="honesty" style={{ marginBottom: 0 }}>
        {honesty}
      </p>
    </div>
  )
}
