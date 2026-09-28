import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, FolderOpen, Inbox, GitBranch, MessageSquare, BarChart3, Search, Bell, X, Check, Circle, Clock, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react'
import { CURRENT_USER, STAGES, CHECKLIST } from './data.js'
import { useStore } from './store.jsx'

export const PageHeader = ({ title, subtitle, children }) => (
  <div className="mb-6 flex items-start justify-between">
    <div><h1 className="text-2xl font-semibold">{title}</h1>{subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}</div>
    {children}
  </div>
)

export const Card = ({ className = '', children }) => <section className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>
export const SectionTitle = ({ children }) => <h2 className="mb-3 text-sm font-semibold text-slate-700">{children}</h2>

export const Btn = ({ variant = 'secondary', className = '', ...p }) => (
  <button {...p} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${variant === 'primary' ? 'bg-brand-600 text-white hover:bg-brand-700' : variant === 'warn' ? 'bg-amber-600 text-white hover:bg-amber-700' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'} ${className}`} />
)

const BADGE = {
  'In Progress': 'bg-blue-50 text-blue-700', Blocked: 'bg-red-50 text-red-700', 'On Track': 'bg-emerald-50 text-emerald-700', Pending: 'bg-amber-50 text-amber-700',
  Completed: 'bg-slate-100 text-slate-600', Waiting: 'bg-amber-50 text-amber-700', Resolved: 'bg-emerald-50 text-emerald-700',
  High: 'bg-red-50 text-red-700', Medium: 'bg-slate-100 text-slate-700', Low: 'bg-slate-50 text-slate-500',
}
export const StatusBadge = ({ status }) => <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${BADGE[status] || BADGE.Completed}`}>{status}</span>

export const KpiCard = ({ label, value, tone = '' }) => {
  const bar = tone.includes('red') ? 'bg-red-500' : tone.includes('amber') ? 'bg-amber-500' : tone.includes('brand') ? 'bg-brand-500' : 'bg-slate-300'
  return (
    <Card className="relative overflow-hidden p-4 pl-5"><span className={`absolute inset-y-0 left-0 w-1 ${bar}`} /><div className="text-sm text-slate-500">{label}</div><div className={`mt-1 text-3xl font-semibold tracking-tight ${tone}`}>{value}</div></Card>
  )
}

export function CaseTable({ rows, cols }) {
  const nav = useNavigate()
  const heads = { id: 'Case ID', student: 'Student ID', issue: 'Issue', status: 'Status', due: 'Due', owner: 'Owner', priority: 'Priority', teams: 'Teams Involved', updated: 'Last Updated' }
  const cell = (c, k) => k === 'id' ? <span className="font-medium text-brand-600">#{c.id}</span> : k === 'status' || k === 'priority' ? <StatusBadge status={c[k]} /> : k === 'teams' ? `${c.teams.length} teams` : c[k]
  return (
    <table className="w-full text-sm">
      <thead><tr className="border-b border-slate-200 text-left text-xs text-slate-500">{cols.map((k) => <th key={k} className="px-4 py-2.5 font-medium">{heads[k]}</th>)}</tr></thead>
      <tbody>
        {rows.map((c) => (
          <tr key={c.id} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && nav(`/cases/${c.id}`)} onClick={() => nav(`/cases/${c.id}`)} className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50">
            {cols.map((k) => <td key={k} className="px-4 py-3">{cell(c, k)}</td>)}
          </tr>
        ))}
        {!rows.length && <tr><td colSpan={cols.length} className="px-4 py-8 text-center text-slate-400">No cases match this filter.</td></tr>}
      </tbody>
    </table>
  )
}

export const Filters = ({ options, value, onChange }) => (
  <div className="flex gap-2">
    {options.map((o) => (
      <button key={o} onClick={() => onChange(o)} className={`rounded-full border px-3 py-1 text-sm ${value === o ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'}`}>{o}</button>
    ))}
  </div>
)

const STATE = {
  done: { Icon: CheckCircle2, cls: 'border-emerald-200 bg-emerald-50 text-emerald-700', label: 'Completed' },
  active: { Icon: Circle, cls: 'border-brand-500 bg-brand-50 text-brand-700', label: 'In Progress' },
  pending: { Icon: Clock, cls: 'border-slate-200 bg-white text-slate-500', label: 'Pending' },
}
export function TeamStatus({ team }) {
  const s = STATE[team.state]
  const mine = team.name === 'Financial Aid'
  return (
    <div className={`flex-1 rounded-xl border p-4 ${s.cls} ${mine ? 'ring-2 ring-brand-500/30' : ''}`}>
      <div className="flex items-center gap-2 font-semibold text-slate-800"><s.Icon size={16} className="shrink-0" /> {team.name}</div>
      <div className="mt-1 text-sm">{mine && <span className="mr-2 font-medium">Your team</span>}{s.label}</div>
    </div>
  )
}

export function Progress({ stage }) {
  return (
    <div className="flex items-center">
      {STAGES.map((s, i) => (
        <div key={s} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${i < stage ? 'bg-emerald-500 text-white' : i === stage ? 'bg-brand-600 text-white ring-4 ring-brand-100' : 'bg-slate-200 text-slate-500'}`}>{i < stage ? <Check size={14} /> : i + 1}</div>
            <span className={`text-xs ${i === stage ? 'font-semibold text-brand-700' : 'text-slate-500'}`}>{s}</span>
          </div>
          {i < STAGES.length - 1 && <div className={`mx-2 mb-5 h-0.5 flex-1 ${i < stage ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
        </div>
      ))}
    </div>
  )
}

export function Timeline({ items }) {
  return (
    <ol className="space-y-4 border-l-2 border-slate-200 pl-5">
      {items.map((a, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand-500" />
          <div className="text-xs text-slate-500">{a.time} · {a.team}</div>
          <div className="text-sm">{a.text}</div>
        </li>
      ))}
    </ol>
  )
}

// One component for every dependency / blocker, in every place it appears.
// variant: 'full' (case workspace) | 'detail' (side panel) | 'compact' (list rows)
const DEP_TONE = {
  Waiting: 'border-amber-400 bg-amber-50 text-amber-800',
  Blocked: 'border-red-400 bg-red-50 text-red-800',
  Resolved: 'border-emerald-300 bg-emerald-50 text-emerald-800',
}
export function DependencyCard({ dep, variant = 'full', onRemind, onMessage, onResolve, onOpen, onClose }) {
  const resolved = dep.status === 'Resolved'
  const tone = DEP_TONE[dep.status] || DEP_TONE.Waiting
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-sm">
        <div><div className="font-medium">#{dep.caseId} · {dep.team} → {dep.waitingFor}</div><div className="text-xs text-slate-500">{dep.required} · since {dep.since}</div></div>
        <div className="flex items-center gap-2"><StatusBadge status={dep.status} />{onOpen && <Btn onClick={onOpen}>View Case</Btn>}</div>
      </div>
    )
  }
  const actions = !resolved && (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {onRemind && <Btn variant="warn" onClick={onRemind}>Remind Team</Btn>}
      {onMessage && <Btn onClick={onMessage}>Message Team</Btn>}
      {onResolve && <Btn onClick={onResolve}>Mark Resolved</Btn>}
      {dep.reminded && <span className="text-xs">Reminder sent</span>}
    </div>
  )
  if (variant === 'detail') {
    return (
      <Card className="h-fit w-80 shrink-0 p-5">
        <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Case #{dep.caseId} dependency</h2>{onClose && <button aria-label="Close" onClick={onClose}><X size={16} /></button>}</div>
        <StatusBadge status={dep.status} />
        <dl className="mt-3 space-y-3 text-sm">
          {[['What is required', dep.required], ['Who is responsible', dep.responsible], ['When it was requested', dep.since], ['Why it is blocking the case', dep.reason]].map(([k, v]) => <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd>{v}</dd></div>)}
        </dl>
        {actions}
        {onOpen && <button onClick={onOpen} className="mt-3 text-sm text-brand-600">Open case</button>}
      </Card>
    )
  }
  return (
    <div className={`rounded-xl border-2 p-5 ${tone}`}>
      <div className="mb-3 flex items-center justify-between text-sm font-bold">
        <span className="flex items-center gap-2">{resolved ? <CheckCircle2 size={17} /> : <AlertTriangle size={17} />} Cross-team dependency{resolved ? ' · resolved' : dep.status === 'Blocked' ? ' · blocking this case' : ' · action required'}</span>
        <StatusBadge status={dep.status} />
      </div>
      <div className="mb-4 flex items-center gap-3 text-sm font-medium text-slate-800">
        <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm">{dep.team}<br /><span className="text-xs font-normal text-slate-500">{resolved ? 'can proceed' : 'cannot complete its task'}</span></span>
        <span>{resolved ? 'received from' : 'waiting on'}</span>
        <span className="rounded-lg bg-white px-3 py-1.5 shadow-sm">{dep.waitingFor}<br /><span className="text-xs font-normal text-slate-500">{resolved ? 'provided' : 'holds the information'}</span></span>
      </div>
      <dl className="grid grid-cols-[90px_1fr] gap-y-1 text-sm text-slate-800">
        <dt className="text-slate-500">Required</dt><dd className="font-medium">{dep.required}</dd>
        <dt className="text-slate-500">Requested</dt><dd>{dep.since}</dd>
        <dt className="text-slate-500">Reason</dt><dd>{dep.reason}</dd>
      </dl>
      {actions}
    </div>
  )
}

export function TaskCard({ task, onView, actions }) {
  const { setTaskModal } = useStore()
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div><div className="text-xs font-medium text-brand-600">CASE #{task.caseId}</div><h3 className="mt-0.5 font-semibold">{task.title}</h3></div>
        <StatusBadge status={task.status} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <div><div className="text-xs text-slate-500">Student</div>{task.student}</div>
        <div><div className="text-xs text-slate-500">Due</div><span className={task.due === 'Overdue' ? 'font-medium text-red-600' : ''}>{task.due}</span></div>
        <div><div className="text-xs text-slate-500">Assigned to</div>{task.assignee}</div>
      </div>
      {task.dependency && <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 p-2.5 text-sm text-amber-900"><AlertTriangle size={15} className="mt-0.5 shrink-0" />{task.dependency}</div>}
      <div className="mt-4 flex gap-2">
        <Btn onClick={onView}>View Case</Btn>
        {task.status === 'Blocked' ? <Btn variant="primary" onClick={actions.requestInfo}>Request Info</Btn> : task.status !== 'Completed' && <Btn variant="primary" onClick={() => setTaskModal(task.id)}>Update Task</Btn>}
      </div>
    </Card>
  )
}

export function AIBrief({ brief }) {
  if (!brief) return null
  return (
    <Card className="border-brand-100 bg-gradient-to-b from-brand-50/60 to-white p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-700"><Sparkles size={16} /> AI Case Brief</div>
      <p className="text-sm leading-relaxed">{brief.summary}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {brief.done.map((n) => <li key={n} className="text-emerald-700">✓ {n} work completed</li>)}
        {brief.active.map((n) => <li key={n} className="text-brand-700">● {n} in progress</li>)}
        {brief.pending.map((n) => <li key={n} className="text-slate-500">○ {n} pending</li>)}
      </ul>
      <div className="mt-4 text-xs font-medium text-slate-500">Current blocker</div><p className="text-sm">{brief.blocker}</p>
      <div className="mt-3 text-xs font-medium text-slate-500">Suggested next action</div><p className="text-sm">{brief.next}</p>
      <p className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400">Suggestions only. Staff make every decision and assignment.</p>
    </Card>
  )
}

export function Modal({ title, onClose, children }) {
  useEffect(() => { const h = (e) => e.key === 'Escape' && onClose(); window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h) }, [onClose])
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4" onClick={onClose}>
      <div role="dialog" aria-label={title} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold">{title}</h2><button aria-label="Close" onClick={onClose}><X size={18} /></button></div>
        {children}
      </div>
    </div>
  )
}

export function TaskModal() {
  const { taskModal, setTaskModal, tasks, toggleCheck, saveUpdate, completeTask } = useStore()
  const [text, setText] = useState('')
  const task = tasks.find((t) => t.id === taskModal)
  if (!task) return null
  return (
    <Modal title="Financial Aid Task" onClose={() => setTaskModal(null)}>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {[['Case', `#${task.caseId}`], ['Student', task.student], ['Assigned to', task.assignee], ['Due', task.due], ['Priority', task.priority]].map(([k, v]) => <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <div className="mt-4 space-y-2">
        {CHECKLIST.map((c, i) => (
          <label key={c} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={task.checklist[i]} onChange={() => toggleCheck(task.id, i)} className="h-4 w-4 accent-blue-600" /> {c}</label>
        ))}
      </div>
      <label className="mt-4 block text-sm font-medium">Add update
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm font-normal" placeholder="What changed on this task?" />
      </label>
      <div className="mt-4 flex justify-end gap-2">
        <Btn onClick={() => { saveUpdate(task.id, text); setText('') }}>Save Update</Btn>
        <Btn variant="primary" onClick={() => completeTask(task.id)}>Mark Complete</Btn>
      </div>
    </Modal>
  )
}

export function Toasts() {
  const { toasts } = useStore()
  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-2" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white shadow-lg"><Check size={15} className="text-emerald-400" />{t.msg}</div>)}
    </div>
  )
}
