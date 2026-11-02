import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createInitialDemoState } from './seed'
import type { DemoState, GrantStatus, OeCase, OeRequest } from './types'

const STORAGE_KEY = 'letzz_demo_hub_state_v1'

function loadState(): DemoState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState
      return { ...createInitialDemoState(), ...parsed }
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

type DemoStoreValue = {
  state: DemoState
  resetDemo: () => void
  setGrantStatus: (id: string, status: GrantStatus) => void
  markInboxRead: (id: string) => void
  addRequest: (req: Omit<OeRequest, 'id' | 'createdAt' | 'status'>) => void
  sendRequest: (id: string) => void
  updateCaseStatus: (id: string, status: OeCase['status']) => void
  sharePackage: (id: string) => void
  appendAssistant: (text: string) => void
  toggleSetting: (key: keyof DemoState['settings']) => void
}

const DemoStoreContext = createContext<DemoStoreValue | null>(null)

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(() => loadState())

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

  const appendAssistant = useCallback(
    (text: string) => {
      commit((prev) => ({
        ...prev,
        assistantThread: [
          ...prev.assistantThread,
          { id: `u-${Date.now()}`, role: 'user', text },
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            text: 'DEMO: Local Concierge acknowledgement only. No server GPT call in this hub.',
          },
        ],
      }))
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

  const value = useMemo(
    () => ({
      state,
      resetDemo,
      setGrantStatus,
      markInboxRead,
      addRequest,
      sendRequest,
      updateCaseStatus,
      sharePackage,
      appendAssistant,
      toggleSetting,
    }),
    [
      state,
      resetDemo,
      setGrantStatus,
      markInboxRead,
      addRequest,
      sendRequest,
      updateCaseStatus,
      sharePackage,
      appendAssistant,
      toggleSetting,
    ],
  )

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore(): DemoStoreValue {
  const ctx = useContext(DemoStoreContext)
  if (!ctx) throw new Error('useDemoStore outside provider')
  return ctx
}
