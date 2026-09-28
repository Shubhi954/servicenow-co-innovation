import { Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar, TopBar } from './layout.jsx'
import { TaskModal, Toasts } from './components.jsx'
import { Dashboard, Tasks, Cases, CaseWorkspace, Dependencies, Messages, Requests, Analytics } from './pages.jsx'
import AdminOverview from './AdminOverview.jsx'
import AuthPage from './AuthPage.jsx'
import { useAuth } from './auth.jsx'

export default function App() {
  const { user } = useAuth()
  if (!user) return (
    <Routes>
      <Route path="/signin" element={<AuthPage mode="signin" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  )
  const uni = user.role === 'uni'
  const home = uni ? '/admin' : '/dashboard'
  return (
    <div className="flex h-screen flex-col">
      <TopBar />
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl">
            <Routes>
              <Route path="/" element={<Navigate to={home} replace />} />
              <Route path="/signin" element={<Navigate to={home} replace />} />
              <Route path="/signup" element={<Navigate to={home} replace />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/cases/:id" element={<CaseWorkspace />} />
              <Route path="/analytics" element={<Analytics />} />
              {uni ? <Route path="/admin" element={<AdminOverview />} /> : <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/dependencies" element={<Dependencies />} />
                <Route path="/messages" element={<Messages />} />
              </>}
              <Route path="*" element={<Navigate to={home} replace />} />
            </Routes>
          </div>
        </main>
      </div>
      <TaskModal />
      <Toasts />
    </div>
  )
}
