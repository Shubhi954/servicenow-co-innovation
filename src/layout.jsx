import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, FolderOpen, Inbox, GitBranch, MessageSquare, BarChart3, Search, Bell, LogOut, Building2 } from 'lucide-react'
import { useStore } from './store.jsx'
import { useAuth } from './auth.jsx'

const DEPT_NAV = [
  ['/dashboard', 'Dashboard', LayoutDashboard], ['/tasks', 'My Tasks', ListChecks], ['/cases', 'Team Cases', FolderOpen],
  ['/requests', 'Requests', Inbox], ['/dependencies', 'Dependencies', GitBranch], ['/messages', 'Messages', MessageSquare], ['/analytics', 'Analytics', BarChart3],
]
const UNI_NAV = [['/admin', 'Overview', Building2], ['/cases', 'All Cases', FolderOpen], ['/analytics', 'Analytics', BarChart3]]

export const Logo = ({ dark }) => (
  <div className="flex items-center gap-2.5">
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <circle cx="10" cy="11" r="7" fill="#60a5fa" fillOpacity=".9" /><circle cx="18" cy="11" r="7" fill="#2563eb" fillOpacity=".9" /><circle cx="14" cy="18" r="7" fill="#93c5fd" fillOpacity=".8" />
    </svg>
    <span className={`text-lg font-bold tracking-[0.16em] ${dark ? 'text-white' : 'text-brand-700'}`}>HUDDLE</span>
  </div>
)

export function Sidebar() {
  const { user, signOut } = useAuth()
  const nav = user.role === 'uni' ? UNI_NAV : DEPT_NAV
  return (
    <aside className="flex w-56 shrink-0 flex-col bg-[#0f1e3d] p-3">
      <nav className="space-y-0.5">
        {nav.map(([to, label, Icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'border-brand-500 bg-white/10 text-white' : 'border-transparent text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            <Icon size={17} /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto space-y-3">
        <p className="px-3 text-xs leading-relaxed text-slate-400">One case. Every team. One resolution.</p>
        <button onClick={signOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"><LogOut size={16} /> Sign out</button>
      </div>
    </aside>
  )
}

export function TopBar() {
  const nav = useNavigate()
  const { deps } = useStore()
  const { user } = useAuth()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const waiting = deps.filter((d) => d.status !== 'Resolved')
  const initials = user.name.split(' ').filter((w) => /^[A-Za-z]/.test(w)).map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  return (
    <header className="flex h-14 items-center border-b border-slate-200 bg-white">
      <div className="flex h-full w-56 items-center bg-[#0f1e3d] px-5"><Logo dark /></div>
      <div className="flex flex-1 items-center gap-4 px-5">
        <form className="relative max-w-md flex-1" onSubmit={(e) => { e.preventDefault(); nav(`/cases?q=${encodeURIComponent(q)}`) }}>
          <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cases or student IDs" className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm" />
        </form>
        <div className="ml-auto flex items-center gap-4">
          {user.role === 'dept' && (
            <div className="relative">
              <button aria-label="Notifications" onClick={() => setOpen(!open)} className="relative rounded-lg p-2 hover:bg-slate-100"><Bell size={18} /><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" /></button>
              {open && (
                <div className="absolute right-0 z-30 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {waiting.map((d) => <button key={d.id} onClick={() => { setOpen(false); nav(`/cases/${d.caseId}`) }} className="block w-full rounded-lg p-2 text-left text-sm hover:bg-slate-50">Case #{d.caseId} is waiting on {d.waitingFor}</button>)}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">{initials}</div>
            <div className="text-xs leading-tight"><div className="text-sm font-semibold">{user.name}</div><div className="text-slate-500">{user.role === 'uni' ? 'University Admin' : `${user.dept} Support Team`}</div></div>
          </div>
        </div>
      </div>
    </header>
  )
}
