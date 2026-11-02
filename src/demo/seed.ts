import type { DemoState } from './types'

function fakeHash(label: string): string {
  let h = 0
  for (let i = 0; i < label.length; i++) h = (h * 31 + label.charCodeAt(i)) >>> 0
  return `demo_${h.toString(16).padStart(8, '0')}_${label.replace(/\s+/g, '_').toLowerCase()}`.padEnd(
    64,
    '0',
  )
}

export function createInitialDemoState(): DemoState {
  const documents = [
    {
      id: 'doc-passport-bond',
      title: 'Passport scan (DEMO: James Bond)',
      category: 'Identity',
      hashSha256: fakeHash('bond-passport'),
      synthetic: true as const,
      note: 'Vault bytes stay on device in production. Here: metadata + hash only.',
    },
    {
      id: 'doc-utility-cruise',
      title: 'Utility bill (DEMO: Tom Cruise)',
      category: 'Address proof',
      hashSha256: fakeHash('cruise-utility'),
      synthetic: true as const,
      note: 'Synthetic celebrity fixture for UI testing.',
    },
    {
      id: 'doc-contract-swift',
      title: 'Consulting agreement (DEMO: Taylor Swift ASBL)',
      category: 'Contract',
      hashSha256: fakeHash('swift-contract'),
      synthetic: true as const,
      note: 'Fake entity name for demo pack assembly.',
    },
    {
      id: 'doc-id-eob',
      title: 'Staff ID card (DEMO: Karlo Definis, EOB Cap)',
      category: 'Identity',
      hashSha256: fakeHash('karlo-id'),
      synthetic: true as const,
      note: 'EOB-ish team member, not a real HR record.',
    },
    {
      id: 'doc-bank-oprah',
      title: 'Bank statement excerpt (DEMO: Oprah Winfrey)',
      category: 'Financial',
      hashSha256: fakeHash('oprah-bank'),
      synthetic: true as const,
      note: 'Hash-only reference; no PDF export as production.',
    },
    {
      id: 'doc-degree-hawking',
      title: 'Degree certificate (DEMO: Stephen Hawking)',
      category: 'Education',
      hashSha256: fakeHash('hawking-degree'),
      synthetic: true as const,
      note: 'Clearly fictional demo document.',
    },
    {
      id: 'doc-residence-musk',
      title: 'Residence permit (DEMO: Elon Musk)',
      category: 'Identity',
      hashSha256: fakeHash('musk-residence'),
      synthetic: true as const,
      note: 'Celebrity fixture for cross-border pack demos.',
    },
    {
      id: 'doc-payroll-nick',
      title: 'Payroll excerpt (DEMO: Nick Product Owner, EOB Cap)',
      category: 'Financial',
      hashSha256: fakeHash('nick-payroll'),
      synthetic: true as const,
      note: 'Team fixture, not HR payroll export.',
    },
  ]

  const packages = [
    {
      id: 'pkg-kyc-lite',
      name: 'KYC refresh pack (DEMO)',
      purpose: 'Onboarding re-check for obliged entity desk',
      documentIds: ['doc-passport-bond', 'doc-utility-cruise', 'doc-id-eob'],
      status: 'ready' as const,
      recipientLabel: 'Lux Compliance Demo OE',
    },
    {
      id: 'pkg-fund-sub',
      name: 'Fund subscription bundle (DEMO)',
      purpose: 'Investor onboarding simulation',
      documentIds: ['doc-contract-swift', 'doc-bank-oprah'],
      status: 'draft' as const,
      recipientLabel: 'Arcor Capital Demo RAIF',
    },
  ]

  const inbox = [
    {
      id: 'inbox-1',
      from: 'Lux Compliance Demo OE',
      subject: 'Grant request: proof of address',
      preview: 'We request read access to utility bill hash doc-utility-cruise...',
      unread: true,
    },
    {
      id: 'inbox-2',
      from: 'LETZZ DEBUG loopback',
      subject: 'Synthetic grant ping (DEBUG)',
      preview: 'Loopback inbox item for Wallet Subject web desk testing.',
      unread: true,
    },
    {
      id: 'inbox-3',
      from: 'Demo Concierge',
      subject: 'Package ready to review',
      preview: 'Your KYC refresh pack has 3 document hashes attached.',
      unread: false,
    },
  ]

  const grants = [
    {
      id: 'grant-1',
      oeName: 'Lux Compliance Demo OE',
      subjectName: 'DEMO: James Bond',
      scope: 'Read metadata for doc-utility-cruise',
      status: 'pending' as const,
      requestedAt: '2026-11-01T09:15:00Z',
      packDocumentIds: ['doc-passport-bond', 'doc-utility-cruise'],
    },
    {
      id: 'grant-2',
      oeName: 'EOB Cap Sandbox OE',
      subjectName: 'DEMO: Karlo Definis',
      scope: 'Case file LF-2026-014 document hashes',
      status: 'pending' as const,
      requestedAt: '2026-11-02T07:00:00Z',
      packDocumentIds: ['doc-id-eob', 'doc-payroll-nick'],
    },
    {
      id: 'grant-3',
      oeName: 'Arcor Capital Demo RAIF',
      subjectName: 'DEMO: Taylor Swift ASBL',
      scope: 'Subscription pack pkg-fund-sub (view_full, hash list only)',
      status: 'granted' as const,
      requestedAt: '2026-10-28T14:22:00Z',
      packDocumentIds: ['doc-contract-swift', 'doc-bank-oprah'],
    },
    {
      id: 'grant-4',
      oeName: 'Lux Compliance Demo OE',
      subjectName: 'DEMO: Elon Musk',
      scope: 'Revoked pack demo (exercise GRANT_REVOKED honesty)',
      status: 'revoked' as const,
      requestedAt: '2026-10-15T11:00:00Z',
      packDocumentIds: ['doc-residence-musk'],
    },
    {
      id: 'grant-5',
      oeName: 'EOB Cap Sandbox OE',
      subjectName: 'DEMO: Oprah Winfrey',
      scope: 'KYC refresh pack after wallet grant (view_full)',
      status: 'granted' as const,
      requestedAt: '2026-11-02T08:00:00Z',
      packDocumentIds: ['doc-bank-oprah', 'doc-passport-bond'],
    },
  ]

  const stepUpChallenges: DemoState['stepUpChallenges'] = []

  const subjects = [
    { id: 'sub-bond', displayName: 'DEMO: James Bond', role: 'Wallet Subject', demoLabel: 'Celebrity fixture' },
    { id: 'sub-karlo', displayName: 'DEMO: Karlo Definis', role: 'Wallet Subject', demoLabel: 'EOB Cap team' },
    { id: 'sub-swift', displayName: 'DEMO: Taylor Swift ASBL', role: 'Corporate entity', demoLabel: 'Synthetic entity' },
    { id: 'sub-cruise', displayName: 'DEMO: Tom Cruise', role: 'Wallet Subject', demoLabel: 'Celebrity fixture' },
    { id: 'sub-oprah', displayName: 'DEMO: Oprah Winfrey', role: 'Wallet Subject', demoLabel: 'Celebrity fixture' },
    { id: 'sub-musk', displayName: 'DEMO: Elon Musk', role: 'Wallet Subject', demoLabel: 'Celebrity fixture' },
    { id: 'sub-hawking', displayName: 'DEMO: Stephen Hawking', role: 'Wallet Subject', demoLabel: 'Celebrity fixture' },
  ]

  const cases = [
    {
      id: 'case-014',
      title: 'LF-2026-014 Onboarding (DEMO: Bond)',
      subjectId: 'sub-bond',
      status: 'review' as const,
      assignee: 'DEMO: Nick Product Owner',
      updatedAt: '2026-11-02T06:30:00Z',
      linkedGrantId: 'grant-1',
    },
    {
      id: 'case-022',
      title: 'LF-2026-022 Address refresh (DEMO: Cruise)',
      subjectId: 'sub-cruise',
      status: 'open' as const,
      assignee: 'DEMO: Thierry CTO',
      updatedAt: '2026-11-01T16:00:00Z',
      linkedGrantId: 'grant-5',
    },
    {
      id: 'case-008',
      title: 'LF-2026-008 Fund sub (DEMO: Swift ASBL)',
      subjectId: 'sub-swift',
      status: 'closed' as const,
      assignee: 'DEMO: Mauro CFO',
      updatedAt: '2026-10-20T11:00:00Z',
      linkedGrantId: 'grant-3',
    },
  ]

  const requests = [
    {
      id: 'req-101',
      subjectId: 'sub-bond',
      template: 'Standard KYC document request',
      message: 'Please share passport and proof of address hashes via wallet grant.',
      status: 'sent' as const,
      createdAt: '2026-10-30T10:00:00Z',
    },
  ]

  const dataSubjectRows = [
    { id: 'ds-1', label: 'Home address (DEMO)', source: 'Local index', readOnly: true },
    { id: 'ds-2', label: 'Employment timeline (DEMO: EOB Cap)', source: 'User-controlled store', readOnly: true },
    { id: 'ds-3', label: 'Grant history export (DEMO)', source: 'Derived from grants table', readOnly: true },
  ]

  const lifeStoreSources = [
    {
      id: 'life-vault',
      label: 'Device vault index (DEMO)',
      connector: 'letzwallet_local_vault',
      status: 'ready' as const,
      indexingPercent: null,
      linkedDocumentIds: ['doc-passport-bond', 'doc-utility-cruise', 'doc-id-eob'],
      readOnlyGrantOe: null,
    },
    {
      id: 'life-calendar',
      label: 'Calendar excerpts (DEMO stub)',
      connector: 'on_device_calendar_stub',
      status: 'ready' as const,
      indexingPercent: null,
      linkedDocumentIds: [],
      readOnlyGrantOe: 'Lux Compliance Demo OE',
    },
    {
      id: 'life-health',
      label: 'Health records export (DEMO indexing)',
      connector: 'on_device_health_stub',
      status: 'indexing' as const,
      indexingPercent: 36,
      linkedDocumentIds: [],
      readOnlyGrantOe: null,
    },
    {
      id: 'life-cloud',
      label: 'Cloud drive folder (DEMO: not configured)',
      connector: 'cloud_connector_stub',
      status: 'not_configured' as const,
      indexingPercent: null,
      linkedDocumentIds: [],
      readOnlyGrantOe: null,
    },
    {
      id: 'life-grants-derived',
      label: 'Grant-to-source map (derived)',
      connector: 'local_derived_index',
      status: 'ready' as const,
      indexingPercent: null,
      linkedDocumentIds: ['doc-bank-oprah', 'doc-contract-swift'],
      readOnlyGrantOe: null,
    },
  ]

  const assistantThread = [
    {
      id: 'a1',
      role: 'assistant' as const,
      text: 'DEMO Concierge: I can propose pack assembly steps. I do not send documents or impersonate you.',
    },
    {
      id: 'a2',
      role: 'user' as const,
      text: 'Summarize my pending grants.',
    },
    {
      id: 'a3',
      role: 'assistant' as const,
      text: 'You have 2 pending grants from Lux Compliance Demo OE and EOB Cap Sandbox OE. Approve or reject on Home or this simulated inbox.',
    },
  ]

  return {
    documents,
    packages,
    inbox,
    grants,
    stepUpChallenges,
    subjects,
    cases,
    requests,
    dataSubjectRows,
    lifeStoreSources,
    assistantThread,
    settings: {
      demoMode: true,
      localConciergeStub: true,
      serverConciergeHeavy: false,
      notifications: true,
      debugLoopback: true,
    },
  }
}
