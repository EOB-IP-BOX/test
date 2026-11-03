import { useState } from 'react'
import { HonestyReloadControl } from '../../components/HonestyReloadControl'
import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'
import type { DemoState } from '../../demo/types'

const SETTING_LABELS: Record<keyof DemoState['settings'], string> = {
  demoMode: 'Demo mode banner',
  localConciergeStub: 'Local Concierge stub (rule-based, no GPT)',
  serverConciergeHeavy: 'Simulated paywalled server heavy (honest gates only)',
  notifications: 'In-app notifications (demo)',
  debugLoopback: 'DEBUG loopback inbox on Wallet Home',
}

export function SettingsPage() {
  const { state, toggleSetting, resetDemo } = useDemoStore()
  const [recoveryStamp, setRecoveryStamp] = useState<string | null>(null)

  const keys = Object.keys(state.settings) as (keyof typeof state.settings)[]

  return (
    <>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">
        DEBUG and demo toggles <DemoPill />
      </p>

      <HonestyReloadControl
        surface="recovery honesty"
        testId="wallet-settings-recovery-honesty-reload"
        honesty="Device-key recovery status and send probe simulation only. Separate from Local Cloud reachability. No Cognito restore, no live WebAuthn, no completed same-key recovery on this Pages hub."
        onReplaced={() => setRecoveryStamp(new Date().toISOString())}
      />
      {recoveryStamp ? (
        <p className="work-row-meta" data-testid="wallet-settings-recovery-honesty-stamp">
          Last recovery honesty re-read: {recoveryStamp} · gated (not restored)
        </p>
      ) : null}

      <div className="panel" data-testid="wallet-settings-panel">
        <h2>Concierge</h2>
        <p className="honesty" style={{ marginTop: 0 }}>
          Local stub and server heavy are separate. This hub never fakes paywalled model completion.
        </p>
        {keys.map((key) => (
          <label
            key={key}
            htmlFor={`setting-${key}`}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}
          >
            <input
              id={`setting-${key}`}
              type="checkbox"
              checked={state.settings[key]}
              onChange={() => toggleSetting(key)}
              aria-label={SETTING_LABELS[key]}
            />
            {SETTING_LABELS[key]}
          </label>
        ))}
        <button type="button" className="btn btn-secondary" onClick={resetDemo}>
          Reset all demo data
        </button>
        <p className="honesty">Resets in-memory and localStorage seed for this browser.</p>
      </div>
    </>
  )
}
