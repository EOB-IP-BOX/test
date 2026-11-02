import { useState, type FormEvent } from 'react'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

const QUICK_PROMPTS = [
  'Summarize pending grants',
  'What packages do I have?',
  'Can I download a PDF from the vault?',
  'Explain step-up and WebAuthn in this hub',
]

export function AssistantPage() {
  const { state, appendAssistant } = useDemoStore()
  const [draft, setDraft] = useState('')
  const conciergeDegraded = !state.settings.localConcierge

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
      {conciergeDegraded ? (
        <div
          className="demo-banner"
          role="status"
          data-testid="concierge-degraded-banner"
          style={{ marginBottom: '1rem' }}
        >
          <strong>Concierge degraded</strong>
          <p style={{ margin: '0.35rem 0 0' }}>
            Code <code>server_unreachable</code>: localConcierge is off in Settings. Heavy GPT/Claude
            server path is not wired on GitHub Pages. Re-enable localConcierge for the rule-based
            local stub, or expect degraded replies only.
          </p>
        </div>
      ) : (
        <p className="honesty">
          Non-generative local stub only: fixed replies from demo state and help text. No paywalled
          server model, no invented compliance outcomes, no document send.
        </p>
      )}
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
            {conciergeDegraded ? 'Send (degraded path)' : 'Send (local stub)'}
          </button>
        </form>
      </div>
    </>
  )
}
