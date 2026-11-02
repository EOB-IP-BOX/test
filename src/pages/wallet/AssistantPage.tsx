import { useState, type FormEvent } from 'react'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function AssistantPage() {
  const { state, appendAssistant } = useDemoStore()
  const [draft, setDraft] = useState('')

  function onSend(e: FormEvent) {
    e.preventDefault()
    if (!draft.trim()) return
    appendAssistant(draft.trim())
    setDraft('')
  }

  return (
    <>
      <h1 className="page-title">AI Concierge</h1>
      <p className="page-sub">
        Wallet-only assistant simulation <DemoPill />
      </p>
      <p className="honesty">
        No paywalled server model in this hub. Proposals only; user confirms actions elsewhere in
        the sim.
      </p>
      <div className="panel">
        <div className="chat-thread">
          {state.assistantThread.map((m) => (
            <div key={m.id} className={`chat-bubble ${m.role === 'user' ? 'user' : ''}`}>
              {m.text}
            </div>
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
            Send (local stub)
          </button>
        </form>
      </div>
    </>
  )
}
