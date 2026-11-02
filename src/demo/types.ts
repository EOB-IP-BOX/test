export type GrantStatus = 'pending' | 'granted' | 'rejected' | 'revoked'

export type DemoDocument = {
  id: string
  title: string
  category: string
  hashSha256: string
  synthetic: true
  note: string
}

export type DemoPackage = {
  id: string
  name: string
  purpose: string
  documentIds: string[]
  status: 'draft' | 'ready' | 'shared'
  recipientLabel: string
}

export type InboxItem = {
  id: string
  from: string
  subject: string
  preview: string
  unread: boolean
}

export type StepUpChallengeStatus = 'pending' | 'approved' | 'denied'

export type StepUpChallenge = {
  id: string
  grantId: string
  action: 'view_full'
  status: StepUpChallengeStatus
  createdAt: string
  label: string
}

export type GrantRequest = {
  id: string
  oeName: string
  subjectName: string
  scope: string
  status: GrantStatus
  requestedAt: string
  /** Document ids included in view_full pack preview (hash-only). */
  packDocumentIds?: string[]
}

export type WalletSubject = {
  id: string
  displayName: string
  role: string
  demoLabel: string
}

export type OeCase = {
  id: string
  title: string
  subjectId: string
  status: 'open' | 'review' | 'closed'
  assignee: string
  updatedAt: string
  /** Optional grant whose hash-only pack preview matches this case file. */
  linkedGrantId?: string
}

export type OeRequest = {
  id: string
  subjectId: string
  template: string
  message: string
  status: 'draft' | 'sent'
  createdAt: string
}

export type LifeStoreSourceStatus = 'not_configured' | 'indexing' | 'ready' | 'denied'

/** Codex 4.4: locally indexed life-store connector (device index; no Platform vault bytes). */
export type LifeStoreSource = {
  id: string
  label: string
  connector: string
  status: LifeStoreSourceStatus
  /** Document ids indexed from device vault (hash references only in this hub). */
  linkedDocumentIds: string[]
  /** Simulated read-only grant to an OE desk (consent distinct from delivery). */
  readOnlyGrantOe: string | null
}

export type DataSubjectRecord = {
  id: string
  label: string
  source: string
  readOnly: boolean
}

export type AssistantMessage = {
  id: string
  role: 'assistant' | 'user'
  text: string
}

export type DemoState = {
  documents: DemoDocument[]
  packages: DemoPackage[]
  inbox: InboxItem[]
  grants: GrantRequest[]
  stepUpChallenges: StepUpChallenge[]
  subjects: WalletSubject[]
  cases: OeCase[]
  requests: OeRequest[]
  dataSubjectRows: DataSubjectRecord[]
  lifeStoreSources: LifeStoreSource[]
  assistantThread: AssistantMessage[]
  settings: {
    demoMode: boolean
    /** Rule-based on-device stub (no GPT). */
    localConciergeStub: boolean
    /** Simulated paywalled / server heavy path (never fakes completion in this hub). */
    serverConciergeHeavy: boolean
    notifications: boolean
    debugLoopback: boolean
  }
}
