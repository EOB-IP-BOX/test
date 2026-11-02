/** Path B honesty probe only. Never satisfies pack step-up in this hub. */

export type WebAuthnProbeKind = 'webauthn_unavailable' | 'webauthn_verify_not_wired'

export type WebAuthnProbeResult = {
  kind: WebAuthnProbeKind
  message: string
  honesty: string
}

export async function probeWebAuthnPathB(): Promise<WebAuthnProbeResult> {
  if (typeof window === 'undefined') {
    return {
      kind: 'webauthn_unavailable',
      message: 'WebAuthn unavailable (no browser context).',
      honesty: 'Path B does not unlock view_full packs here. Path A loopback on Wallet Subject is required.',
    }
  }

  const cred = window.PublicKeyCredential
  if (!cred) {
    return {
      kind: 'webauthn_unavailable',
      message: 'WebAuthn API not exposed (webauthn_unavailable).',
      honesty:
        'This static Pages hub has no platform step-up verify endpoint. Pack stays locked until Path A approves the loopback challenge.',
    }
  }

  try {
    if (typeof cred.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
      await cred.isUserVerifyingPlatformAuthenticatorAvailable()
    }
  } catch {
    return {
      kind: 'webauthn_unavailable',
      message: 'Platform authenticator probe failed (webauthn_unavailable).',
      honesty: 'Path B probe only; no pack unlock. Use Wallet Subject loopback approve (Path A).',
    }
  }

  return {
    kind: 'webauthn_verify_not_wired',
    message: 'WebAuthn verify not wired in test hub (webauthn_verify_not_wired).',
    honesty:
      'Browser may support credentials, but this demo never calls navigator.credentials.get() or verifies against LETZZ Platform. Path A loopback remains the only unlock path.',
  }
}
