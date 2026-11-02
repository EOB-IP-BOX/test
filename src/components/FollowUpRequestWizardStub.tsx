import { useState } from 'react'
import { useDemoStore } from '../demo/DemoStore'

const FOLLOW_UP_TEMPLATES = [
  'Missing proof of address follow-up',
  'Expired ID re-upload',
  'Clarify source of funds',
] as const

/** OE follow-up request wizard stub: no API, no wallet delivery. */
export function FollowUpRequestWizardStub() {
  const { state } = useDemoStore()
  const [step, setStep] = useState(1)
  const [caseId, setCaseId] = useState(state.cases[0]?.id ?? '')
  const [template, setTemplate] = useState<(typeof FOLLOW_UP_TEMPLATES)[number]>(
    FOLLOW_UP_TEMPLATES[0],
  )
  const [note, setNote] = useState('')

  const selectedCase = state.cases.find((c) => c.id === caseId)
  const subject = selectedCase
    ? state.subjects.find((s) => s.id === selectedCase.subjectId)
    : undefined

  function resetWizard() {
    setStep(1)
    setNote('')
  }

  return (
    <section
      className="panel honesty"
      style={{ marginBottom: '1rem' }}
      data-testid="follow-up-request-wizard-stub"
    >
      <h2 style={{ marginTop: 0 }}>Follow-up request wizard (stub)</h2>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8125rem' }}>
        Guided follow-up after an open case. Steps 1–3 are UI only; nothing is sent to Wallet or
        Platform API in this hub.
      </p>
      <p className="work-row-meta">Step {step} of 3</p>

      {step === 1 ? (
        <div className="field">
          <label htmlFor="fu-case">Linked case</label>
          <select id="fu-case" value={caseId} onChange={(e) => setCaseId(e.target.value)}>
            {state.cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.status})
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {step === 2 ? (
        <>
          <div className="field">
            <label htmlFor="fu-tpl">Follow-up template</label>
            <select
              id="fu-tpl"
              value={template}
              onChange={(e) => setTemplate(e.target.value as (typeof FOLLOW_UP_TEMPLATES)[number])}
            >
              {FOLLOW_UP_TEMPLATES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="fu-note">Analyst note (optional)</label>
            <textarea id="fu-note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </>
      ) : null}

      {step === 3 ? (
        <div style={{ fontSize: '0.875rem' }}>
          <p style={{ margin: 0 }}>
            <strong>Review (not submitted)</strong>
          </p>
          <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
            <li>Case: {selectedCase?.title ?? caseId}</li>
            <li>Subject: {subject?.displayName ?? 'unknown'}</li>
            <li>Template: {template}</li>
            {note.trim() ? <li>Note: {note.trim()}</li> : null}
          </ul>
          <p className="honesty" style={{ marginTop: '0.75rem' }}>
            follow_up_not_wired: production would create an OE request + Wallet notification. Use
            Compose above to save a draft request instead.
          </p>
        </div>
      ) : null}

      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {step > 1 ? (
          <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        ) : null}
        {step < 3 ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={step === 1 && !caseId}
            onClick={() => setStep((s) => s + 1)}
          >
            Next
          </button>
        ) : (
          <button type="button" className="btn btn-secondary" onClick={resetWizard}>
            Start over
          </button>
        )}
      </div>
    </section>
  )
}
