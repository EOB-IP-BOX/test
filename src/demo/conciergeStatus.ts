import type { DemoState } from './types'

export type ConciergeStatusCode = 'local_degraded' | 'paywall_required' | 'server_unreachable'

const HEAVY_PROMPT = /\b(gpt|claude|heavy|server model|paywall|deep analysis)\b/i

export function isHeavyConciergePrompt(text: string): boolean {
  return HEAVY_PROMPT.test(text)
}

export function conciergeBannerCodes(settings: DemoState['settings']): ConciergeStatusCode[] {
  const codes: ConciergeStatusCode[] = []
  if (!settings.localConciergeStub) {
    codes.push('local_degraded')
  }
  if (settings.serverConciergeHeavy) {
    codes.push('paywall_required')
  }
  return codes
}

export type ConciergeReplyRoute =
  | { kind: 'stub' }
  | { kind: 'code'; code: ConciergeStatusCode; message: string }

export function resolveConciergeReplyRoute(
  text: string,
  settings: DemoState['settings'],
): ConciergeReplyRoute {
  const heavy = isHeavyConciergePrompt(text)

  if (settings.serverConciergeHeavy && heavy) {
    return {
      kind: 'code',
      code: 'server_unreachable',
      message:
        'DEMO Concierge (code server_unreachable): paywalled server models are not reachable on GitHub Pages. ' +
        'No heavy completion was simulated. Use local stub or Platform dev stack for real wiring.',
    }
  }

  if (settings.serverConciergeHeavy && !settings.localConciergeStub) {
    return {
      kind: 'code',
      code: 'paywall_required',
      message:
        'DEMO Concierge (code paywall_required): serverConciergeHeavy is on but local stub is off. ' +
        'This hub does not grant simulated subscription or fake GPT output. Enable localConciergeStub or turn off server heavy.',
    }
  }

  if (!settings.localConciergeStub) {
    return {
      kind: 'code',
      code: 'local_degraded',
      message:
        'DEMO Concierge (code local_degraded): localConciergeStub is off in Settings. ' +
        'Re-enable the rule-based local stub or configure server heavy with honest paywall gates.',
    }
  }

  return { kind: 'stub' }
}
