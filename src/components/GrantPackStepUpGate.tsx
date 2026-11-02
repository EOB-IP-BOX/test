import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { PackAccessFailure } from '../demo/packAccess'
import { probeWebAuthnPathB, type WebAuthnProbeResult } from '../demo/webauthnProbe'

type Props = {
  grantId: string
  challengeId: string
  failure: PackAccessFailure
  onRetry: () => void
  retrying?: boolean
}

/** Honest staff-facing gate when grant pack (view_full) needs approved step-up. */
export function GrantPackStepUpGate({ grantId, challengeId, failure, onRetry, retrying }: Props) {
  const [pathBProbe, setPathBProbe] = useState<WebAuthnProbeResult | null>(null)
  const [pathBBusy, setPathBBusy] = useState(false)

  async function onProbePathB() {
    setPathBBusy(true)
    try {
      setPathBProbe(await probeWebAuthnPathB())
    } finally {
      setPathBBusy(false)
    }
  }

  return (
    <section
      className="panel honesty"
      style={{ marginTop: '1rem', borderLeftColor: 'var(--lz-info)' }}
      aria-labelledby="grant-pack-step-up-heading"
      data-testid="grant-pack-step-up-gate"
    >
      <h3 id="grant-pack-step-up-heading" style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>
        Pack step-up required (view_full)
      </h3>
      <p style={{ margin: 0, fontSize: '0.8125rem' }}>
        Staff session alone does not unlock the pack. {failure.message}
      </p>
      {failure.honesty ? (
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8125rem', color: 'var(--lz-muted)' }}>
          {failure.honesty}
        </p>
      ) : null}
      <p className="work-row-meta" style={{ marginTop: '0.5rem' }}>
        Challenge {challengeId} · Grant {grantId}
      </p>
      <p style={{ margin: '0.75rem 0 0', fontSize: '0.8125rem' }}>
        Path A: switch to{' '}
        <Link to="/wallet/home">Wallet Subject</Link>, approve the step-up inbox row (DEBUG loopback
        stand-in, not production Face ID), then return here and retry.
      </p>
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button type="button" className="btn btn-primary" disabled={retrying} onClick={onRetry}>
          {retrying ? 'Checking pack…' : 'Retry pack with challenge header'}
        </button>
        <Link to="/wallet/home" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
          Open Wallet step-up inbox
        </Link>
      </div>

      <div
        style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--lz-border, #ddd)' }}
        data-testid="grant-pack-path-b-probe"
      >
        <h4 style={{ margin: '0 0 0.35rem', fontSize: '0.875rem' }}>Path B: WebAuthn probe (stub)</h4>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--lz-muted)' }}>
          Reports browser capability and wiring honesty. Never unlocks the pack in this hub.
        </p>
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="button" className="btn btn-secondary" disabled={pathBBusy} onClick={onProbePathB}>
            {pathBBusy ? 'Probing…' : 'Run WebAuthn probe'}
          </button>
        </div>
        {pathBProbe ? (
          <div
            className="pack-error"
            role="status"
            style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}
            data-testid={`webauthn-probe-${pathBProbe.kind}`}
          >
            <strong>{pathBProbe.kind}</strong>: {pathBProbe.message}
            <p style={{ margin: '0.35rem 0 0', color: 'var(--lz-muted)' }}>{pathBProbe.honesty}</p>
          </div>
        ) : null}
      </div>
    </section>
  )
}
