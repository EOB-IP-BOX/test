export type GrantStatus = 'pending' | 'granted' | 'rejected'

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

export type GrantRequest = {
  id: string
  oeName: string
  subjectName: string
  scope: string
  status: GrantStatus
  requestedAt: string
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
