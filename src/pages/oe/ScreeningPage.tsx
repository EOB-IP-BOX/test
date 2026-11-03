import { useMemo, useState } from 'react'
import { HonestyReloadControl } from '../../components/HonestyReloadControl'
import { DemoPill } from '../../components/StatusBadge'

type ScreeningJob = {
  id: string
  partyLabel: string
  status: 'open' | 'review' | 'closed'
  candidates: string[]
}

const SEED_JOBS: ScreeningJob[] = [
  {
    id: 'scr-job-1',
    partyLabel: 'DEMO: James Bond',
    status: 'open',
    candidates: ['Alias match (synthetic)', 'PEP false positive fixture'],
  },
  {
    id: 'scr-job-2',
    partyLabel: 'DEMO: Taylor Swift ASBL',
    status: 'review',
    candidates: ['Entity name collision (demo only)'],
  },
]

export function ScreeningPage() {
  const [jobs, setJobs] = useState(SEED_JOBS)
  const [openId, setOpenId] = useState<string | null>('scr-job-1')
  const [partyFixtureId, setPartyFixtureId] = useState('partyA-demo')
  const open = useMemo(() => jobs.find((j) => j.id === openId) ?? null, [jobs, openId])

  function refreshListAndOpen() {
    setJobs((prev) => prev.map((j) => ({ ...j })))
  }

  function refreshOpenJobOnly() {
    if (!openId) return
    setJobs((prev) =>
      prev.map((j) =>
        j.id === openId
          ? { ...j, candidates: [...j.candidates, `Re-probed @ ${new Date().toISOString().slice(11, 19)}`] }
          : j,
      ),
    )
  }

  return (
    <>
      <h1 className="page-title">Screening</h1>
      <p className="page-sub">
        DEMO screening jobs (not licensed clearance) <DemoPill />
      </p>
      <p className="honesty">
        Local synthetic fixtures only. List refresh stays list-scoped; open-job refresh is a separate
        single-job probe. This hub never claims a licensed screening provider.
      </p>

      <HonestyReloadControl
        surface="screening jobs list"
        testId="oe-screening-list-reload"
        honesty="List probe only. When a job is open, the follow-on below re-reads that job without claiming clearance."
        onReplaced={refreshListAndOpen}
      />

      <div className="panel" style={{ marginBottom: '1rem' }} data-testid="oe-screening-party-fixture">
        <h2>Create-job party fixture seed</h2>
        <p className="work-row-meta">Current seed: {partyFixtureId}</p>
        <HonestyReloadControl
          surface="screening party fixture seed"
          testId="oe-screening-party-fixture-reload"
          honesty="Local/dev fixture party id only. Not registry verification, not Cognito, not licensed clearance."
          onReplaced={() => setPartyFixtureId(`partyA-demo-${Date.now().toString(36).slice(-4)}`)}
        />
      </div>

      <div className="panel" style={{ marginBottom: '1rem' }}>
        <h2>Jobs</h2>
        <div className="row-list" data-testid="oe-screening-jobs">
          {jobs.map((job) => (
            <button
              key={job.id}
              type="button"
              className="work-row"
              style={{
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                border: openId === job.id ? '1px solid var(--letzz-crimson, #8C1E2D)' : undefined,
              }}
              onClick={() => setOpenId(job.id)}
            >
              <div>
                <strong>{job.partyLabel}</strong>
                <div className="work-row-meta">
                  {job.id} · {job.status} · {job.candidates.length} candidate(s)
                </div>
              </div>
              <span className="badge badge-demo">{openId === job.id ? 'open' : 'select'}</span>
            </button>
          ))}
        </div>
      </div>

      {open ? (
        <div className="panel" data-testid="oe-screening-job-detail">
          <h2>Open job detail</h2>
          <p className="work-row-meta">
            {open.partyLabel} · {open.status}
          </p>
          <HonestyReloadControl
            surface="screening job detail"
            testId="oe-screening-job-detail-reload"
            honesty="Single-job GET simulation only. Does not re-probe the full jobs list and does not claim licensed clearance."
            onReplaced={refreshOpenJobOnly}
          />
          <ul>
            {open.candidates.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  )
}
