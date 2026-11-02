import type { DemoState } from './types'

const NON_GENERATIVE_PREFIX =
  'DEMO Concierge (local stub, no GPT): '

export function conciergeStubReply(userText: string, state: DemoState): string {
  const q = userText.trim().toLowerCase()

  if (q.includes('download') || q.includes('pdf') || q.includes('vault byte')) {
    return (
      NON_GENERATIVE_PREFIX +
      'This hub never serves vault bytes. Production Wallet keeps files on device; sharing uses hash references and grants only.'
    )
  }

  if (q.includes('pending grant') || q.includes('grant')) {
    const pending = state.grants.filter((g) => g.status === 'pending')
    if (pending.length === 0) {
      return NON_GENERATIVE_PREFIX + 'No pending grants in demo state. Check Home or reset in Settings.'
    }
    const lines = pending.map((g) => `${g.oeName}: ${g.scope.slice(0, 48)}…`)
    return (
      NON_GENERATIVE_PREFIX +
      `You have ${pending.length} pending grant(s). Approve or reject on Home:\n` +
      lines.join('\n')
    )
  }

  if (q.includes('pack') || q.includes('package')) {
    const ready = state.packages.filter((p) => p.status !== 'shared')
    const summary = ready
      .map((p) => `${p.name} (${p.status}, ${p.documentIds.length} hashes)`)
      .join('; ')
    return (
      NON_GENERATIVE_PREFIX +
      `Packages desk lists hash bundles only. Current: ${summary || 'none'}. Mark shared does not upload bytes.`
    )
  }

  if (q.includes('document') || q.includes('hash')) {
    return (
      NON_GENERATIVE_PREFIX +
      `Vault index has ${state.documents.length} DEMO documents (metadata + SHA-256 references). Open Documents to copy a hash or run verify-only.`
    )
  }

  if (q.includes('step-up') || q.includes('webauthn')) {
    const pending = state.stepUpChallenges.filter((c) => c.status === 'pending')
    return (
      NON_GENERATIVE_PREFIX +
      `${pending.length} pending step-up challenge(s). Approve on Wallet Home (Path A). Path B WebAuthn probe on OE Grants never unlocks in this hub.`
    )
  }

  return (
    NON_GENERATIVE_PREFIX +
    'I only echo demo state and fixed help text. I do not call a server model, invent compliance outcomes, or send documents. Try: "pending grants", "packages", or "hash".'
  )
}
