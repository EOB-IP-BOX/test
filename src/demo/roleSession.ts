/** DEBUG surface selector (mirrors LETZZ Platform web-oe sessionStorage key). */

export const DEBUG_LOCAL_ACCOUNT_STORAGE_KEY = 'letzz.debug.localAccount'

export type HubLocalAccount = 'Wallet Subject' | 'Analyst'

const VALID = new Set<string>(['Wallet Subject', 'Analyst'])

export function readPersistedLocalAccount(): HubLocalAccount | null {
  try {
    const raw = sessionStorage.getItem(DEBUG_LOCAL_ACCOUNT_STORAGE_KEY)
    if (raw && VALID.has(raw)) return raw as HubLocalAccount
  } catch {
    /* private mode */
  }
  return null
}

export function persistLocalAccount(role: HubLocalAccount): void {
  try {
    sessionStorage.setItem(DEBUG_LOCAL_ACCOUNT_STORAGE_KEY, role)
  } catch {
    /* quota */
  }
}
