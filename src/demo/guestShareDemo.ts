/** Codex 4.3 guest share honesty (static hub; no Platform API). */

export const DEMO_GUEST_SHARE_TOKEN = 'demo-hub-guest-share'
export const DEMO_GUEST_DOCUMENT_ID = 'demo-hub-guest-doc-001'

export const GUEST_SHARE_REGISTRATION_INVITE_PATH = '/register?from=guest-share'

export const HASH_ONLY_PACK_HONESTY =
  'Hash-only evidence: content hashes and share metadata are recorded. Document bytes stay on the Wallet Subject device and are not delivered to the platform.'

export const GUEST_OPEN_API_NOTE =
  'One-time page. Document materialization is hash-metadata unless an approved release path supplies selected bytes. This response is not production mesh delivery and not vault byte streaming.'

export type GuestShareDocumentRow = {
  document_id: string
  content_hash: string | null
  honesty: 'download_not_available' | 'view_not_available'
}

export type GuestShareOpenPayload = {
  ok: boolean
  headline: string
  body: string
  show_register_cta: boolean
  access_mode: 'download'
  note: string
  registration_invite_path: string
  materialization: {
    honesty: 'hash_metadata_only'
    note: string
    documents: GuestShareDocumentRow[]
  }
}

const DEMO_DOC_HASH =
  'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'

export function resolveGuestShareOpen(token: string): GuestShareOpenPayload | null {
  const key = token.trim()
  if (key !== DEMO_GUEST_SHARE_TOKEN) {
    return null
  }
  return {
    ok: true,
    headline: 'One-time share opened',
    body:
      'The link was accepted once. Document viewing or download depends on an approved materialization path; this desk does not mirror wallet vault bytes. Create a LETZZ Wallet account to manage your own documents.',
    show_register_cta: true,
    access_mode: 'download',
    note: GUEST_OPEN_API_NOTE,
    registration_invite_path: GUEST_SHARE_REGISTRATION_INVITE_PATH,
    materialization: {
      honesty: 'hash_metadata_only',
      note: HASH_ONLY_PACK_HONESTY,
      documents: [
        {
          document_id: DEMO_GUEST_DOCUMENT_ID,
          content_hash: DEMO_DOC_HASH,
          honesty: 'download_not_available',
        },
      ],
    },
  }
}

export function checkGuestShareDownloadAvailability(input: {
  token: string
  documentId: string
}): { honesty: string; message: string; httpStatus: 501 } {
  const open = resolveGuestShareOpen(input.token)
  if (!open) {
    return {
      honesty: 'download_not_available',
      message: 'Share unavailable in demo hub.',
      httpStatus: 501,
    }
  }
  const row = open.materialization.documents.find((d) => d.document_id === input.documentId)
  if (!row) {
    return {
      honesty: 'download_not_available',
      message: 'Document not listed on this share.',
      httpStatus: 501,
    }
  }
  return {
    honesty: row.honesty,
    message:
      'Download was requested, but platform byte delivery is not available under the hash-only evidence model.',
    httpStatus: 501,
  }
}

export function resolveGuestShareRegistration(fromParam: string | null): {
  from_guest_share: boolean
  headline: string
  body: string
  local_dev_hint: string
} {
  const from_guest_share = fromParam === 'guest-share'
  return {
    from_guest_share,
    headline: from_guest_share ? 'Create LETZZ Wallet' : 'Registration',
    body: from_guest_share
      ? 'Guest share links do not create a wallet account on this web page. Install LETZZ Wallet on iPhone to manage documents, packages, and future shares with device-key release.'
      : 'Production web registration is not wired on this desk. Use LETZZ Wallet on iPhone or return to sign in when you already have a local development session.',
    local_dev_hint:
      'Local Cloud developers may use the demo chooser and Wallet Subject desk for DEBUG loopback. That path is not Cognito and not a substitute for App Store onboarding.',
  }
}
