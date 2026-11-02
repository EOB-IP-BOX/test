import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { conciergeStubReply } from './conciergeStub'
import { evaluatePackAccess, type PackAccessResult } from './packAccess'
import { createInitialDemoState } from './seed'
import type { DemoState, GrantStatus, OeCase, OeRequest, StepUpChallenge } from './types'

export const DEMO_HUB_STORAGE_KEY = 'letzz_demo_hub_state_v1'
const STORAGE_KEY = DEMO_HUB_STORAGE_KEY

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      return { ...createInitialDemoState(), ...parsed, stepUpChallenges: parsed.stepUpChallenges ?? [] }
    }
  } catch {
    /* use seed */
  }
  return createInitialDemoState()
}

function persistState(state: DemoState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* quota */
  }
}

function newChallengeId(): string {
  return `step-${Date.now().toString(36)}`
}

type DemoStoreValue = {
  state: DemoState
  resetDemo: () => void
  setGrantStatus: (id: string, status: GrantStatus) => void
  revokeGrant: (id: string) => void
  markInboxRead: (id: string) => void
  addRequest: (req: Omit<OeRequest, 'id' | 'createdAt' | 'status'>) => void
  sendRequest: (id: string) => void
  updateCaseStatus: (id: string, status: OeCase['status']) => void
  sharePackage: (id: string) => void
  createDraftPackage: (name: string, purpose: string, recipientLabel: string) => string
  togglePackageDocument: (packageId: string, documentId: string) => void
  markPackageReady: (packageId: string) => void
  appendAssistant: (text: string) => void
  toggleSetting: (key: keyof DemoState['settings']) => void
  ensureStepUpChallenge: (grantId: string) => StepUpChallenge
  approveStepUpChallenge: (challengeId: string) => void
  getLatestChallengeForGrant: (grantId: string) => StepUpChallenge | undefined
  tryPackPreview: (grantId: string, challenge?: StepUpChallenge | string) => PackAccessResult
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null)

function mergeStoredState(raw: string): DemoState | null {
  try {
    const parsed = JSON.parse(raw) as DemoState
    return { ...createInitialDemoState(), ...parsed, stepUpChallenges: parsed.stepUpChallenges ?? [] }
  } catch {
    return null
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadState())

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY || e.newValue == null) return
      const merged = mergeStoredState(e.newValue)
      if (merged) setState(merged)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const commit = useCallback((updater: (prev: DemoState) => DemoState) => {
    setState((prev) => {
      const next = updater(prev)
      persistState(next)
      return next
    })
  }, [])

  const resetDemo = useCallback(() => {
    const fresh = createInitialDemoState()
    persistState(fresh)
    setState(fresh)
  }, [])

  const setGrantStatus = useCallback(
    (id: string, status: GrantStatus) => {
      commit((prev) => ({
        ...prev,
        grants: prev.grants.map((g) => (g.id === id ? { ...g, status } : g)),
      }))
    },
    [commit],
  )

  const revokeGrant = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        grants: prev.grants.map((g) => (g.id === id ? { ...g, status: 'revoked' as const } : g)),
      }))
    },
    [commit],
  )

  const markInboxRead = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        inbox: prev.inbox.map((i) => (i.id === id ? { ...i, unread: false } : i)),
      }))
    },
    [commit],
  )

  const addRequest = useCallback(
    (req: Omit<OeRequest, 'id' | 'createdAt' | 'status'>) => {
      commit((prev) => ({
        ...prev,
        requests: [
          {
            ...req,
            id: `req-${Date.now()}`,
            status: 'draft',
            createdAt: new Date().toISOString(),
          },
          ...prev.requests,
        ],
      }))
    },
    [commit],
  )

  const sendRequest = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        requests: prev.requests.map((r) =>
          r.id === id ? { ...r, status: 'sent' as const } : r,
        ),
      }))
    },
    [commit],
  )

  const updateCaseStatus = useCallback(
    (id: string, status: OeCase['status']) => {
      commit((prev) => ({
        ...prev,
        cases: prev.cases.map((c) =>
          c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c,
        ),
      }))
    },
    [commit],
  )

  const sharePackage = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        packages: prev.packages.map((p) =>
          p.id === id ? { ...p, status: 'shared' as const } : p,
        ),
      }))
    },
    [commit],
  )

  const createDraftPackage = useCallback(
    (name: string, purpose: string, recipientLabel: string): string => {
      const id = `pkg-${Date.now().toString(36)}`
      commit((prev) => ({
        ...prev,
        packages: [
          {
            id,
            name: name.trim() || 'Untitled pack (DEMO)',
            purpose: purpose.trim() || 'Hash-only bundle',
            documentIds: [],
            status: 'draft' as const,
            recipientLabel: recipientLabel.trim() || 'Demo recipient',
          },
          ...prev.packages,
        ],
      }))
      return id
    },
    [commit],
  )

  const togglePackageDocument = useCallback(
    (packageId: string, documentId: string) => {
      commit((prev) => ({
        ...prev,
        packages: prev.packages.map((p) => {
          if (p.id !== packageId || p.status !== 'draft') return p
          const has = p.documentIds.includes(documentId)
          return {
            ...p,
            documentIds: has
              ? p.documentIds.filter((d) => d !== documentId)
              : [...p.documentIds, documentId],
          }
        }),
      }))
    },
    [commit],
  )

  const markPackageReady = useCallback(
    (packageId: string) => {
      commit((prev) => ({
        ...prev,
        packages: prev.packages.map((p) =>
          p.id === packageId && p.documentIds.length > 0
            ? { ...p, status: 'ready' as const }
            : p,
        ),
      }))
    },
    [commit],
  )

  const appendAssistant = useCallback(
    (text: string) => {
      commit((prev) => {
        const reply = conciergeStubReply(text, prev)
        return {
          ...prev,
          assistantThread: [
            ...prev.assistantThread,
            { id: `u-${Date.now()}`, role: 'user', text },
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              text: reply,
            },
          ],
        }
      })
    },
    [commit],
  )

  const toggleSetting = useCallback(
    (key: keyof DemoState['settings']) => {
      commit((prev) => ({
        ...prev,
        settings: { ...prev.settings, [key]: !prev.settings[key] },
      }))
    },
    [commit],
  )

  const getLatestChallengeForGrant = useCallback(
    (grantId: string): StepUpChallenge | undefined => {
      const matches = state.stepUpChallenges.filter((c) => c.grantId === grantId)
      if (matches.length === 0) return undefined
      return matches[matches.length - 1]
    },
    [state.stepUpChallenges],
  )

  const ensureStepUpChallenge = useCallback(
    (grantId: string): StepUpChallenge => {
      const grant = state.grants.find((g) => g.id === grantId)
      const label = grant
        ? `view_full pack for ${grant.subjectName} (${grant.oeName})`
        : `view_full pack for grant ${grantId}`

      const forGrant = state.stepUpChallenges.filter((c) => c.grantId === grantId)
      const pending = forGrant.find((c) => c.status === 'pending')
      if (pending) return pending

      const approved = [...forGrant].reverse().find((c) => c.status === 'approved')
      if (approved) return approved

      const created: StepUpChallenge = {
        id: newChallengeId(),
        grantId,
        action: 'view_full',
        status: 'pending',
        createdAt: new Date().toISOString(),
        label,
      }

      commit((prev) => ({
        ...prev,
        stepUpChallenges: [...prev.stepUpChallenges, created],
      }))

      return created
    },
    [commit, state.grants, state.stepUpChallenges],
  )

  const approveStepUpChallenge = useCallback(
    (challengeId: string) => {
      commit((prev) => ({
        ...prev,
        stepUpChallenges: prev.stepUpChallenges.map((c) =>
          c.id === challengeId ? { ...c, status: 'approved' as const } : c,
        ),
      }))
    },
    [commit],
  )

  const tryPackPreview = useCallback(
    (grantId: string, challengeRef?: StepUpChallenge | string): PackAccessResult => {
      const grant = state.grants.find((g) => g.id === grantId)
      if (!grant) {
        return {
          ok: false,
          errorCode: 'GRANT_NOT_ACTIVE',
          message: 'Grant not found in demo state.',
        }
      }
      let challenge: StepUpChallenge | undefined
      if (typeof challengeRef === 'string') {
        challenge = state.stepUpChallenges.find((c) => c.id === challengeRef)
      } else if (challengeRef) {
        challenge = challengeRef
      } else {
        challenge = getLatestChallengeForGrant(grantId)
      }
      return evaluatePackAccess(grant, challenge, state.documents)
    },
    [getLatestChallengeForGrant, state.documents, state.grants, state.stepUpChallenges],
  )

  const value = useMemo(
    () => ({
      state,
      resetDemo,
      setGrantStatus,
      revokeGrant,
      markInboxRead,
      addRequest,
      sendRequest,
      updateCaseStatus,
      sharePackage,
      createDraftPackage,
      togglePackageDocument,
      markPackageReady,
      appendAssistant,
      toggleSetting,
      ensureStepUpChallenge,
      approveStepUpChallenge,
      getLatestChallengeForGrant,
      tryPackPreview,
    }),
    [
      state,
      resetDemo,
      setGrantStatus,
      revokeGrant,
      markInboxRead,
      addRequest,
      sendRequest,
      updateCaseStatus,
      sharePackage,
      createDraftPackage,
      togglePackageDocument,
      markPackageReady,
      appendAssistant,
      toggleSetting,
      ensureStepUpChallenge,
      approveStepUpChallenge,
      getLatestChallengeForGrant,
      tryPackPreview,
    ],
  )

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore(): DemoStoreValue {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error('useDemoStore outside provider')
  return ctx
}
