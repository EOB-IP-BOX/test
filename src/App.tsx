import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './components/RequireAuth'
import { DemoStoreProvider } from './demo/DemoStore'
import { OEShell } from './layouts/OEShell'
import { WalletShell } from './layouts/WalletShell'
import { Chooser } from './pages/Chooser'
import { PasswordGate } from './pages/PasswordGate'
import { CaseDetailPage } from './pages/oe/CaseDetailPage'
import { CasesPage } from './pages/oe/CasesPage'
import { DashboardPage } from './pages/oe/DashboardPage'
import { GrantsPage } from './pages/oe/GrantsPage'
import { RequestsPage } from './pages/oe/RequestsPage'
import { SearchPage } from './pages/oe/SearchPage'
import { SubjectDetailPage } from './pages/oe/SubjectDetailPage'
import { SubjectsPage } from './pages/oe/SubjectsPage'
import { AssistantPage } from './pages/wallet/AssistantPage'
import { DataSubjectPage } from './pages/wallet/DataSubjectPage'
import { DocumentsPage } from './pages/wallet/DocumentsPage'
import { HomePage } from './pages/wallet/HomePage'
import { PackagesPage } from './pages/wallet/PackagesPage'
import { SettingsPage } from './pages/wallet/SettingsPage'
import { WelcomePage } from './pages/wallet/WelcomePage'
import { GuestShareOpenPage } from './pages/GuestShareOpenPage'
import { GuestShareRegisterPage } from './pages/GuestShareRegisterPage'

function AuthedRoutes() {
  return (
    <RequireAuth>
      <Routes>
        <Route path="/choose" element={<Chooser />} />
        <Route path="/guest/:token" element={<GuestShareOpenPage />} />
        <Route path="/register" element={<GuestShareRegisterPage />} />
        <Route path="/wallet" element={<WalletShell />}>
          <Route path="welcome" element={<WelcomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="data-subject" element={<DataSubjectPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route index element={<Navigate to="welcome" replace />} />
        </Route>
        <Route path="/oe" element={<OEShell />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subjects/:id" element={<SubjectDetailPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="cases/:id" element={<CaseDetailPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="grants" element={<GrantsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        <Route path="*" element={<Navigate to="/choose" replace />} />
      </Routes>
    </RequireAuth>
  )
}

export default function App() {
  return (
    <DemoStoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<PasswordGate />} />
          <Route path="/*" element={<AuthedRoutes />} />
        </Routes>
      </HashRouter>
    </DemoStoreProvider>
  )
}
