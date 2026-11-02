import type { DemoDocument } from './types'

export type HashVerifyResult = {
  ok: boolean
  message: string
}

/** Demo-only: compares user paste to indexed hash (no byte read). */
export function verifyHashAgainstIndex(
  doc: DemoDocument,
  pasted: string,
): HashVerifyResult {
  const normalized = pasted.trim().toLowerCase()
  if (!normalized) {
    return { ok: false, message: 'Paste a hash to compare (demo index only, no vault read).' }
  }
  if (normalized === doc.hashSha256.toLowerCase()) {
    return {
      ok: true,
      message:
        'DEMO: Index match. Production would verify against locally stored bytes; this hub has no vault file.',
    }
  }
  return {
    ok: false,
    message: 'DEMO: No match with indexed hash. Mismatch does not prove forgery in this synthetic fixture.',
  }
}
