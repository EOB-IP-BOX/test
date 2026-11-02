import { DemoPill } from '../../components/StatusBadge'
import { useDemoStore } from '../../demo/DemoStore'

export function SettingsPage() {
  const { state, toggleSetting, resetDemo } = useDemoStore()

  return (
    <>
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">
        DEBUG and demo toggles <DemoPill />
      </p>
      <div className="panel">
        {(Object.keys(state.settings) as (keyof typeof state.settings)[]).map((key) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <input type="checkbox" checked={state.settings[key]} onChange={() => toggleSetting(key)} />
            {key}
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
