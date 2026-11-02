import { useState, type FormEvent } from 'react'
import { FollowUpRequestWizardStub } from '../../components/FollowUpRequestWizardStub'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function RequestsPage() {
  const { state, addRequest, sendRequest } = useDemoStore()
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id ?? '')
  const [template, setTemplate] = useState('Standard KYC document request')
  const [message, setMessage] = useState('')

  function onCompose(e: FormEvent) {
    e.preventDefault()
    if (!subjectId || !message.trim()) return
    addRequest({ subjectId, template, message: message.trim() })
    setMessage('')
  }

  return (
    <>
      <h1 className="page-title">Requests</h1>
      <p className="page-sub">
        Compose outbound document requests <DemoPill />
      </p>
      <FollowUpRequestWizardStub />
      <div className="panel" style={{ marginBottom: '1rem' }}>
        <h2>Compose (DEMO)</h2>
        <form onSubmit={onCompose}>
          <div className="field">
            <label htmlFor="sub">Wallet subject</label>
            <select id="sub" value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.displayName}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="tpl">Template</label>
            <input id="tpl" value={template} onChange={(e) => setTemplate(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="msg">Message</label>
            <textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">
            Save draft
          </button>
        </form>
      </div>
      <div className="row-list">
        {state.requests.map((r) => {
          const sub = state.subjects.find((s) => s.id === r.subjectId)
          return (
            <div key={r.id} className="work-row">
              <div>
                <strong>{r.template}</strong> <span className="badge badge-pending">{r.status}</span>
                <div className="work-row-meta">{sub?.displayName}</div>
                <p style={{ margin: '0.35rem 0 0' }}>{r.message}</p>
              </div>
              {r.status === 'draft' ? (
                <button type="button" className="btn btn-primary" onClick={() => sendRequest(r.id)}>
                  Mark sent (DEMO)
                </button>
              ) : null}
            </div>
          )
        })}
      </div>
    </>
  )
}
