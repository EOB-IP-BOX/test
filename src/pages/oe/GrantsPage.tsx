import { useState } from 'react'
import { GrantPackStepUpGate } from '../../components/GrantPackStepUpGate'
import { DemoPill, GrantBadge } from '../../components/StatusBadge'
import {
  describePackFailure,
  evaluatePackAccess,
  type PackAccessFailure,
} from '../../demo/packAccess'
import { useDemoStore } from '../../demo/DemoStore'

export function GrantsPage() {
  const {
    state,
    setGrantStatus,
    revokeGrant,
    ensureStepUpChallenge,
    tryPackPreview,
    getLatestChallengeForGrant,
  } = useDemoStore()

  const [activeGrantId, setActiveGrantId] = useState<string | null>(null)
  const [packPreview, setPackPreview] = useState('')
  const [packError, setPackError] = useState('')
  const [gateGrantId, setGateGrantId] = useState<string | null>(null)
  const [gateChallengeId, setGateChallengeId] = useState<string | null>(null)
  const [gateFailure, setGateFailure] = useState<PackAccessFailure | null>(null)
  const [packBusy, setPackBusy] = useState(false)

  function applyPackResult(
    grantId: string,
    result: ReturnType<typeof tryPackPreview>,
    challengeId: string,
  ) {
    if (!result.ok) {
      if (result.errorCode === 'STEP_UP_REQUIRED' || result.errorCode === 'STEP_UP_DENIED') {
        setGateGrantId(grantId)
        setGateChallengeId(challengeId)
        setGateFailure(result)
        setPackPreview('')
        setPackError('')
        return
      }
      setGateGrantId(null)
      setGateChallengeId(null)
      setGateFailure(null)
      setPackPreview('')
      setPackError(describePackFailure(result))
      return
    }
    setGateGrantId(null)
    setGateChallengeId(null)
    setGateFailure(null)
    setPackError('')
    setPackPreview(result.previewLines.join('\n'))
  }

  function onViewPack(grantId: string) {
    setActiveGrantId(grantId)
    setPackBusy(true)
    try {
      const challenge = ensureStepUpChallenge(grantId)
      const result = tryPackPreview(grantId, challenge)
      applyPackResult(grantId, result, challenge.id)
    } finally {
      setPackBusy(false)
    }
  }

  function onRetryPack() {
    if (!gateGrantId || !gateChallengeId) return
    setPackBusy(true)
    try {
      const result = tryPackPreview(gateGrantId, gateChallengeId)
      applyPackResult(gateGrantId, result, gateChallengeId)
    } finally {
      setPackBusy(false)
    }
  }

  function onRevoke(grantId: string) {
    const grant = state.grants.find((g) => g.id === grantId)
    revokeGrant(grantId)
    if (activeGrantId !== grantId || !grant) return
    const challenge = getLatestChallengeForGrant(grantId)
    const result = evaluatePackAccess(
      { ...grant, status: 'revoked' },
      challenge,
      state.documents,
    )
    setGateGrantId(null)
    setGateChallengeId(null)
    setGateFailure(null)
    setPackPreview('')
    if (!result.ok) {
      setPackError(describePackFailure(result))
    } else {
      setPackError('')
    }
  }

  return (
    <>
      <h1 className="page-title">Grants</h1>
      <p className="page-sub">
        OE permission queue, view_full pack (hash-only), and step-up honesty <DemoPill />
      </p>
      <p className="honesty">
        Simulates server ordering: revoke and expiry are checked before step-up. After revoke you
        should see GRANT_REVOKED, not a stale STEP_UP_DENIED from an old challenge header.
      </p>

      <div className="row-list">
        {state.grants.map((g) => (
          <div key={g.id} className="work-row">
            <div>
              <GrantBadge status={g.status} /> <strong>{g.subjectName}</strong>
              <div className="work-row-meta">{g.oeName}</div>
              <div className="work-row-meta">{g.scope}</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {g.status === 'pending' ? (
                <>
                  <button type="button" className="btn btn-primary" onClick={() => setGrantStatus(g.id, 'granted')}>
                    Approve
                  </button>
                  <button type="button" className="btn btn-danger" onClick={() => setGrantStatus(g.id, 'rejected')}>
                    Deny
                  </button>
                </>
              ) : null}
              {g.status === 'granted' || g.status === 'revoked' ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={packBusy}
                  onClick={() => onViewPack(g.id)}
                >
                  View pack
                </button>
              ) : null}
              {g.status === 'granted' ? (
                <button type="button" className="btn btn-danger" onClick={() => onRevoke(g.id)}>
                  Revoke
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {gateGrantId && gateChallengeId && gateFailure ? (
        <GrantPackStepUpGate
          grantId={gateGrantId}
          challengeId={gateChallengeId}
          failure={gateFailure}
          onRetry={onRetryPack}
          retrying={packBusy}
        />
      ) : null}

      {packError ? (
        <div className="pack-error" role="alert" data-testid="grant-pack-error">
          {packError}
        </div>
      ) : null}

      {packPreview ? (
        <div className="pack-preview" data-testid="grant-pack-preview">
          {packPreview}
        </div>
      ) : null}
    </>
  )
}
