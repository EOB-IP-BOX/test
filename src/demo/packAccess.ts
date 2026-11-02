import type { DemoDocument, GrantRequest, StepUpChallenge } from './types'

export type PackErrorCode =
  | 'STEP_UP_REQUIRED'
  | 'STEP_UP_DENIED'
  | 'GRANT_REVOKED'
  | 'GRANT_NOT_ACTIVE'

export type PackAccessSuccess = {
  ok: true
  previewLines: string[]
}

export type PackAccessFailure = {
  ok: false
  errorCode: PackErrorCode
  message: string
  honesty?: string
}

export type PackAccessResult = PackAccessSuccess | PackAccessFailure

/** Mirrors API ordering: revoke/expiry before step-up gate (no stale STEP_UP_DENIED after revoke). */
export function evaluatePackAccess(
  grant: GrantRequest,
  challenge: StepUpChallenge | undefined,
  documents: DemoDocument[],
): PackAccessResult {
  if (grant.status === 'revoked') {
    return {
      ok: false,
      errorCode: 'GRANT_REVOKED',
      message: 'Permission pack blocked (403 GRANT_REVOKED)',
      honesty: 'Grant was revoked. Stale step-up headers do not override this.',
    }
  }

  if (grant.status !== 'granted') {
    return {
      ok: false,
      errorCode: 'GRANT_NOT_ACTIVE',
      message: `Pack unavailable while grant is ${grant.status}. Approve on Wallet Subject first.`,
    }
  }

  if (!challenge) {
    return {
      ok: false,
      errorCode: 'STEP_UP_REQUIRED',
      message: 'view_full pack requires an approved step-up challenge (staff JWT alone is not enough).',
    }
  }

  if (challenge.status === 'pending') {
    return {
      ok: false,
      errorCode: 'STEP_UP_DENIED',
      message: 'Step-up challenge pending wallet approval (403 STEP_UP_DENIED).',
      honesty: 'Path A: open Wallet Subject desk and approve the loopback step-up row.',
    }
  }

  if (challenge.status === 'denied') {
    return {
      ok: false,
      errorCode: 'STEP_UP_DENIED',
      message: 'Step-up challenge was denied (403 STEP_UP_DENIED).',
    }
  }

  const docIds = grant.packDocumentIds ?? []
  const hashes = docIds
    .map((id) => documents.find((d) => d.id === id))
    .filter(Boolean) as DemoDocument[]

  const previewLines = [
    `DEMO permission pack (hash-only, no vault bytes)`,
    `Grant ${grant.id} · subject ${grant.subjectName}`,
    `Organisation ${grant.oeName}`,
    `Documents (${hashes.length}):`,
    ...hashes.map((d) => `  · ${d.title} → ${d.hashSha256.slice(0, 24)}…`),
    '',
    'Synthetic fixture. Production returns share instances + signatures, still not PDF export.',
  ]

  return { ok: true, previewLines }
}

export function describePackFailure(result: PackAccessFailure): string {
  const parts = [result.message]
  if (result.honesty) parts.push(result.honesty)
  return parts.join(' ')
}
