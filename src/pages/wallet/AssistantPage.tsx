import { useState, type FormEvent } from 'react'
import { HonestyReloadControl } from '../../components/HonestyReloadControl'
import { DemoPill } from '../../components/StatusBadge'
import { conciergeBannerCodes } from '../../demo/conciergeStatus'
import { useDemoStore } from '../../demo/DemoStore'

const QUICK_PROMPTS = [
  'Summarize pending grants',
  'What packages do I have?',
  'Can I download a PDF from the vault?',
  'Explain step-up and WebAuthn in this hub',
]

const BANNER_COPY: Record<
  ReturnType<typeof conciergeBannerCodes>[number],
  { title: string; body: string }
> = {
  local_degraded: {
    title: 'Concierge local degraded',
    body: 'Code local_degraded: localConciergeStub is off. Rule-based replies are disabled until you re-enable the stub in Settings.',
  },
  paywall_required: {
    title: 'Server heavy paywall',
    body: 'Code paywall_required: serverConciergeHeavy is on. Paywalled GPT/Claude-class jobs stay gated in this hub; no simulated subscription unlock.',
  },
  server_unreachable: {
    title: 'Server unreachable',
    body: 'Code server_unreachable: heavy server path is not wired on GitHub Pages. Prompts that request GPT/Claude-class work return this code instead of fake answers.',
  },
}

export function AssistantPage() {
  const { state, appendAssistant } = useDemoStore()
  const [draft, setDraft] = useState('')
  const [stackOk, setStackOk] = useState(true)
  const [conciergeStamp, setConciergeStamp] = useState<string | null>(null)
  const bannerCodes = conciergeBannerCodes(state.settings)
  const stubActive = state.settings.localConciergeStub

  function onSend(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    appendAssistant(draft.trim())
    setDraft('')
  }

  function sendQuick(text: string) {
    appendAssistant(text)
  }

  return (
    <>
      <h1 className="page-title">AI Concierge</h1>
      <p className="page-sub">
        Wallet-only assistant simulation <DemoPill />
      </p>

      <HonestyReloadControl
        surface="Local Cloud reachability"
        testId="wallet-assistant-stack-health-reload"
        honesty="API reachability simulation only. Does not re-read Concierge desk-status or invent a planner completion."
        onReplaced={() => setStackOk(true)}
      />
      <p className="work-row-meta" data-testid="wallet-assistant-stack-health-note">
        Connectivity: {stackOk ? 'reachable (DEMO)' : 'unknown'}
      </p>

      <HonestyReloadControl
        surface="Concierge honesty"
        testId="wallet-assistant-concierge-honesty-reload"
        honesty="Wallet-only Concierge desk-status + denial probe simulation. Separate from stack health. Not a planner, not vault tool execution, not a heavy server completion. Misses stay server_unreachable / local_degraded."
        onReplaced={() => setConciergeStamp(new Date().toISOString())}
      />
      {conciergeStamp ? (
        <p className="work-row-meta" data-testid="wallet-assistant-concierge-honesty-stamp">
          Last Concierge honesty re-read: {conciergeStamp}
        </p>
      ) : null}

      {bannerCodes.map((code) => {
        if (code === 'server_unreachable') return null
        const copy = BANNER_COPY[code]
        return (
          <div
            key={code}
            className="demo-banner concierge-status-banner"
            role="status"
            data-testid={`concierge-banner-${code}`}
            style={{ marginBottom: '0.75rem', textAlign: 'left' }}
          >
            <strong>{copy.title}</strong>
            <p style={{ margin: '0.35rem 0 0' }}>
              {copy.body}
            </p>
          </div>
        )
      })}
      {stubActive && !state.settings.serverConciergeHeavy ? (
        <p className="honesty">
          Non-generative local stub only: fixed replies from demo state and help text. No paywalled
          server model, no invented compliance outcomes, no document send.
        </p>
      ) : null}
      {stubActive && state.settings.serverConciergeHeavy ? (
        <p className="honesty" data-testid="concierge-hybrid-honesty">
          Hybrid mode: local stub for ordinary prompts. Messages that request GPT/Claude-class heavy
          work return code server_unreachable (never fake completion).
        </p>
      ) : null}
      <div className="panel" data-testid="wallet-assistant-panel">
        <div className="chat-thread" data-testid="wallet-assistant-thread">
          {state.assistantThread.map((m) => (
            <div key={m.id} className={`chat-bubble ${m.role === 'user' ? 'user' : ''}`}>
              {m.text}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {QUICK_PROMPTS.map((label) => (
            <button
              key={label}
              type="button"
              className="btn btn-secondary"
              onClick={() => sendQuick(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <form onSubmit={onSend}>
          <div className="field">
            <label htmlFor="chat">Message Concierge (DEMO)</label>
            <textarea
              id="chat"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about grants, packs, or documents…"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {stubActive ? 'Send (local stub path)' : 'Send (gated path)'}
          </button>
        </form>
      </div>
    </>
  )
}
