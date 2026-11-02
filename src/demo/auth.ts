export const SESSION_KEY = 'letzz_demo_hub_session_v1'

/** SHA-256 of demo password (documented in README for owner). */
export const PASSWORD_SHA256 =
  '112850868fd082f1e47c9920e8f037b92047fbc9ad91eaf38afd5c583a40f89e'

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyDemoPassword(input: string): Promise<boolean> {
  const digest = await sha256Hex(input)
  return digest === PASSWORD_SHA256
}

export function isSessionUnlocked(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function unlockSession(): void {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function lockSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}
