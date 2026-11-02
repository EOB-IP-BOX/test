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
}

export type OeRequest = {
  id: string
  subjectId: string
  template: string
  message: string
  status: 'draft' | 'sent'
  createdAt: string
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
  assistantThread: AssistantMessage[]
  settings: {
    demoMode: boolean
    localConcierge: boolean
    notifications: boolean
    debugLoopback: boolean
  }
}
