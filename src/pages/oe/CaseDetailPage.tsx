import { Link, useParams } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { GrantPackStepUpGate } from '../../components/GrantPackStepUpGate'
import { DemoPill } from '../../components/StatusBadge'
import { describePackFailure, type PackAccessFailure } from '../../demo/packAccess'
import { useDemoStore } from '../../demo/DemoStore'
import type { OeCase } from '../../demo/types'

export function CaseDetailPage() {
  const { id } = useParams()
  const {
    state,
    updateCaseStatus,
    ensureStepUpChallenge,
    tryPackPreview,
  } = useDemoStore()
  const caseRow = state.cases.find((c) => c.id === id)

  const [packPreview, setPackPreview] = useState('')
  const [packError, setPackError] = useState('')
  const [gateGrantId, setGateGrantId] = useState<string | null>(null)
  const [gateChallengeId, setGateChallengeId] = useState<string | null>(null)
  const [gateFailure, setGateFailure] = useState<PackAccessFailure | null>(null)
  const [packBusy, setPackBusy] = useState(false)

  const linkedGrant = caseRow?.linkedGrantId
    ? state.grants.find((g) => g.id === caseRow.linkedGrantId)
    : undefined

  const applyPackResult = useCallback(
    (
      grantId: string,
      result: ReturnType<typeof tryPackPreview>,
      challengeId: string,
    ) => {
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
    },
    [],
  )

  useEffect(() => {
    if (!gateGrantId || !gateChallengeId) return
    const challenge = state.stepUpChallenges.find((c) => c.id === gateChallengeId)
    if (challenge?.status !== 'approved') return
    const result = tryPackPreview(gateGrantId, gateChallengeId)
    applyPackResult(gateGrantId, result, gateChallengeId)
  }, [state.stepUpChallenges, gateGrantId, gateChallengeId, tryPackPreview, applyPackResult])

  function onViewCasePack() {
    if (!linkedGrant) return
    setPackBusy(true)
    try {
      const challenge = ensureStepUpChallenge(linkedGrant.id)
      const result = tryPackPreview(linkedGrant.id, challenge)
      applyPackResult(linkedGrant.id, result, challenge.id)
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

  if (!caseRow) {
    return (
      <p>
        Case not found. <Link to="/oe/cases">Back</Link>
      </p>
    )
  }

  const statuses: OeCase['status'][] = ['open', 'review', 'closed']

  return (
    <>
      <h1 className="page-title">{caseRow.title}</h1>
      <p className="page-sub">
        Status: {caseRow.status} <DemoPill />
      </p>
      <div className="panel">
        <p>Assignee: {caseRow.assignee}</p>
        <p className="work-row-meta">Updated: {caseRow.updatedAt}</p>
        {linkedGrant ? (
          <p className="work-row-meta" data-testid="case-linked-grant">
            Linked grant: {linkedGrant.id} ({linkedGrant.status}) · {linkedGrant.subjectName}
          </p>
        ) : (
          <p className="honesty">No linked grant for pack preview in demo seed.</p>
        )}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {statuses.map((s) => (
            <button
              key={s}
              type="button"
              className={caseRow.status === s ? 'btn btn-primary' : 'btn btn-secondary'}
              onClick={() => updateCaseStatus(caseRow.id, s)}
            >
              Set {s}
            </button>
          ))}
          {linkedGrant && (linkedGrant.status === 'granted' || linkedGrant.status === 'revoked') ? (
            <button
              type="button"
              className="btn btn-secondary"
              disabled={packBusy}
              data-testid="case-view-pack"
              onClick={onViewCasePack}
            >
              View case pack
            </button>
          ) : null}
        </div>
        <p className="honesty">Case transitions are local demo state only. Pack preview reuses Grants step-up gate.</p>
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
        <div className="pack-error" role="alert" data-testid="case-pack-error">
          {packError}
        </div>
      ) : null}

      {packPreview ? (
        <div className="pack-preview" data-testid="case-pack-preview">
          {packPreview}
        </div>
      ) : null}

      {linkedGrant?.status === 'pending' ? (
        <p className="honesty" data-testid="case-pack-pending-hint">
          Grant {linkedGrant.id} is still pending. Approve on Wallet Home or OE Grants before
          view_full pack preview succeeds.
        </p>
      ) : null}
    </>
  )
}
