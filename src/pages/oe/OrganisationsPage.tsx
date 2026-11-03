import { useMemo, useState } from 'react'
import { HonestyReloadControl } from '../../components/HonestyReloadControl'
import { DemoPill } from '../../components/StatusBadge'

type Org = {
  id: string
  name: string
  registryNote: string
  detailLine: string
}

const SEED: Org[] = [
  {
    id: 'org-a',
    name: 'Lux Compliance Demo OE',
    registryNote: 'DEMO fixture (not RCS verified)',
    detailLine: 'Seeded detail payload for directory follow-on.',
  },
  {
    id: 'org-b',
    name: 'Arcor Capital Demo RAIF',
    registryNote: 'DEMO fixture (not RCS verified)',
    detailLine: 'Fund-shaped label only; no LP economics in this hub.',
  },
]

export function OrganisationsPage() {
  const [orgs, setOrgs] = useState(SEED)
  const [selectedId, setSelectedId] = useState<string | null>('org-a')
  const selected = useMemo(() => orgs.find((o) => o.id === selectedId) ?? null, [orgs, selectedId])

  return (
    <>
      <h1 className="page-title">Organisations</h1>
      <p className="page-sub">
        DEMO organisation directory <DemoPill />
      </p>
      <p className="honesty">
        Directory probe stays list-scoped. Open-org follow-on re-reads one organisation. Not registry
        verification and not licensed clearance.
      </p>

      <HonestyReloadControl
        surface="organisation directory"
        testId="oe-organisations-list-reload"
        honesty="Paginated directory simulation. When an organisation is selected, the detail control below re-reads that row only."
        onReplaced={() => setOrgs((prev) => prev.map((o) => ({ ...o })))}
      />

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <h2>Directory</h2>
        <div className="row-list" data-testid="oe-organisations-list">
          {orgs.map((org) => (
            <button
              key={org.id}
              type="button"
              className="work-row"
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                border: selectedId === org.id ? '1px solid var(--letzz-crimson, #8C1E2D)' : undefined,
              }}
              onClick={() => setSelectedId(org.id)}
            >
              <div>
                <strong>{org.name}</strong>
                <div className="work-row-meta">
                  {org.id} · {org.registryNote}
                </div>
              </div>
              <span className="badge badge-demo">{selectedId === org.id ? 'selected' : 'open'}</span>
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div className="panel" data-testid="oe-organisation-detail">
          <h2>{selected.name}</h2>
          <p className="work-row-meta">{selected.detailLine}</p>
          <HonestyReloadControl
            surface="organisation detail"
            testId="oe-organisation-detail-reload"
            honesty="getOrganisation simulation for the selected id only. Not RCS/RBE verification."
            onReplaced={() =>
              setOrgs((prev) =>
                prev.map((o) =>
                  o.id === selected.id
                    ? {
                        ...o,
                        detailLine: `Re-read ${new Date().toISOString()} (local API sim, not registry).`,
                      }
                    : o,
                ),
              )
            }
          />
        </div>
      ) : null}
    </>
  )
}
