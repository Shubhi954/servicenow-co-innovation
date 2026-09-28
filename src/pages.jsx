import { useState, useEffect } from 'react'
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom'
import { AlertTriangle, Send, X, ArrowLeft } from 'lucide-react'
import { useStore } from './store.jsx'
import { generateBrief } from './ai.js'
import { CHECKLIST, analytics } from './data.js'
import { useAuth } from './auth.jsx'
import { PageHeader, Card, SectionTitle, Btn, StatusBadge, KpiCard, CaseTable, Filters, TeamStatus, Progress, Timeline, DependencyCard, TaskCard, AIBrief } from './components.jsx'

export function Dashboard() {
  const { cases, deps } = useStore()
  const nav = useNavigate()
  const { user } = useAuth()
  const mine = cases.filter((c) => c.teams.some((t) => t.name === user.dept)).slice(0, 4)
  const alerts = deps.filter((d) => d.status === 'Waiting')
  return (
    <>
      <PageHeader title={`${user.dept} Support Team`} subtitle="Your team’s cases, tasks and dependencies." />
      <div className="mb-6 grid grid-cols-4 gap-4">
        <KpiCard label="Active Cases" value="12" /><KpiCard label="Pending" value="7" tone="text-amber-600" />
        <KpiCard label="Due Today" value="3" tone="text-brand-600" /><KpiCard label="Blocked" value="2" tone="text-red-600" />
      </div>
      <div className="grid grid-cols-[1fr_320px] gap-6">
        <Card><div className="px-4 pt-4"><SectionTitle>My team’s cases</SectionTitle></div><CaseTable rows={mine} cols={['id', 'student', 'issue', 'status', 'due', 'owner']} /></Card>
        <Card className="h-fit p-4">
          <SectionTitle>Team alerts</SectionTitle>
          <p className="mb-3 flex items-start gap-2 text-sm text-amber-800"><AlertTriangle size={16} className="mt-0.5 shrink-0" /> {alerts.length} cases are currently waiting for another support team.</p>
          <div className="space-y-2">
            {alerts.map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-sm">
                <span>#{d.caseId} waiting for {d.waitingFor}</span><Btn onClick={() => nav(`/cases/${d.caseId}`)}>View Case</Btn>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

export function Tasks() {
  const { tasks, deps, remind, toast } = useStore()
  const nav = useNavigate()
  const [f, setF] = useState('All')
  const shown = tasks.filter((t) => f === 'All' || (f === 'Due Today' && t.due === 'Today') || (f === 'Overdue' && t.due === 'Overdue') || (f === 'Blocked' && t.status === 'Blocked') || (f === 'Completed' && t.status === 'Completed'))
  const requestInfo = (t) => { const d = deps.find((x) => x.caseId === t.caseId); d ? remind(d.id) : toast('Info request sent') }
  return (
    <>
      <PageHeader title="My Tasks" subtitle="Work assigned to your support team." />
      <div className="mb-4"><Filters options={['All', 'Due Today', 'Overdue', 'Blocked', 'Completed']} value={f} onChange={setF} /></div>
      <div className="grid grid-cols-2 gap-4">
        {shown.map((t) => <TaskCard key={t.id} task={t} onView={() => nav(`/cases/${t.caseId}`)} actions={{ requestInfo: () => requestInfo(t) }} />)}
      </div>
      {!shown.length && <p className="py-10 text-center text-slate-400">No tasks match this filter.</p>}
    </>
  )
}

export function Cases() {
  const { cases: all } = useStore()
  const { user } = useAuth()
  const cases = user.role === 'uni' ? all : all.filter((c) => c.teams.some((t) => t.name === user.dept))
  const [sp] = useSearchParams()
  const [f, setF] = useState('All')
  const [q, setQ] = useState(sp.get('q') || '')
  useEffect(() => setQ(sp.get('q') || ''), [sp])
  const rows = cases.filter((c) => (f === 'All' || (f === 'Active' ? ['In Progress', 'On Track'].includes(c.status) : c.status === f)) && `${c.id} ${c.student} ${c.issue}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title={user.role === 'uni' ? 'All Cases' : 'Team Cases'} subtitle={user.role === 'uni' ? 'Every case across all departments.' : 'Every case your team is part of.'} />
      <div className="mb-4 flex items-center justify-between">
        <Filters options={['All', 'Active', 'Pending', 'Blocked', 'Completed']} value={f} onChange={setF} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter by ID, student or issue" className="w-64 rounded-lg border border-slate-300 px-3 py-1.5 text-sm" />
      </div>
      <Card><CaseTable rows={rows} cols={['id', 'student', 'issue', 'priority', 'teams', 'status', 'updated']} /></Card>
    </>
  )
}

export function CaseWorkspace() {
  const { id } = useParams()
  const nav = useNavigate()
  const { cases, tasks, deps, convs, remind, resolveDependency, setTaskModal, completeTask } = useStore()
  const c = cases.find((x) => x.id === Number(id))
  const [brief, setBrief] = useState(null)
  const caseDeps = deps.filter((d) => d.caseId === Number(id))
  const task = tasks.find((t) => t.caseId === Number(id))
  useEffect(() => { c && generateBrief(c, deps).then(setBrief) }, [c, deps])
  if (!c) return <Navigate to="/cases" replace />
  const conv = convs.find((x) => x.caseId === c.id)
  const done = task?.status === 'Completed'
  return (
    <>
      <button onClick={() => nav('/cases')} className="mb-3 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft size={15} /> Team Cases</button>
      <Card className="mb-5 flex items-center justify-between p-5">
        <div>
          <h1 className="text-2xl font-semibold">Case #{c.id}</h1>
          <p className="mt-1 text-sm text-slate-500">{c.issue}</p>
        </div>
        <dl className="flex gap-8 text-sm">
          {[['Status', <StatusBadge status={c.status} />], ['Priority', c.priority], ['Student ID', c.student], ['Case Owner', c.caseOwner], ['Created', c.created]].map(([k, v]) => <div key={k}><dt className="mb-0.5 text-xs text-slate-500">{k}</dt><dd className="font-medium">{v}</dd></div>)}
        </dl>
      </Card>

      <SectionTitle>Support teams involved</SectionTitle>
      <div className="mb-5 flex gap-3">{c.teams.map((t) => <TeamStatus key={t.name} team={t} />)}</div>

      <Card className="mb-5 px-8 py-5"><Progress stage={c.stage} /></Card>

      <div className="grid grid-cols-[1fr_340px] gap-5">
        <div className="space-y-5">
          {task && (
            <Card className="border-brand-500 p-5">
              <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Your team’s task</h2><StatusBadge status={task.status} /></div>
              <div className="text-xs text-slate-500">Financial Aid</div>
              <div className="font-medium">{task.title}</div>
              <div className="mt-1 text-sm text-slate-500">Assigned to {task.assignee} · Due {task.due}</div>
              <ul className="mt-3 space-y-1 text-sm">{CHECKLIST.map((l, i) => <li key={l} className={task.checklist[i] ? 'text-slate-400 line-through' : ''}>{task.checklist[i] ? '☑' : '☐'} {l}</li>)}</ul>
              {!done && <div className="mt-4 flex gap-2"><Btn onClick={() => setTaskModal(task.id)}>Open Task</Btn><Btn variant="primary" onClick={() => completeTask(task.id)}>Mark Complete</Btn></div>}
            </Card>
          )}
          {caseDeps.map((d) => <DependencyCard key={d.id} dep={d} onRemind={() => remind(d.id)} onMessage={() => nav(conv ? `/messages?c=${conv.id}` : '/messages')} onResolve={() => resolveDependency(d.id)} />)}
          <Card className="p-5"><SectionTitle>Shared activity</SectionTitle><Timeline items={c.activity} /></Card>
        </div>
        <div className="space-y-5"><AIBrief brief={brief} /></div>
      </div>
    </>
  )
}

export function Dependencies() {
  const { deps, remind, resolveDependency } = useStore()
  const nav = useNavigate()
  const [sel, setSel] = useState(null)
  const cur = deps.find((d) => d.id === sel)
  const msg = (d) => nav(d.caseId === 1042 ? '/messages?c=c1' : d.caseId === 1062 ? '/messages?c=c2' : '/messages')
  return (
    <>
      <PageHeader title="Dependencies" subtitle="Cases waiting on another person, team or action." />
      <div className="flex gap-5">
        <Card className="flex-1 self-start">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-left text-xs text-slate-500">{['Case', 'Your Team', 'Waiting For', 'Required', 'Status', 'Waiting Since'].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
            <tbody>{deps.map((d) => (
              <tr key={d.id} onClick={() => setSel(d.id)} className={`cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 ${sel === d.id ? 'bg-brand-50' : ''}`}>
                <td className="px-4 py-3 font-medium text-brand-600">#{d.caseId}</td><td className="px-4 py-3">{d.team}</td><td className="px-4 py-3">{d.waitingFor}</td><td className="px-4 py-3">{d.required}</td><td className="px-4 py-3"><StatusBadge status={d.status} /></td><td className="px-4 py-3">{d.since}</td>
              </tr>))}</tbody>
          </table>
        </Card>
        {cur && <DependencyCard variant="detail" dep={cur} onRemind={() => remind(cur.id)} onMessage={() => msg(cur)} onResolve={() => resolveDependency(cur.id)} onOpen={() => nav(`/cases/${cur.caseId}`)} onClose={() => setSel(null)} />}
      </div>
    </>
  )
}

export function Messages() {
  const { convs, sendMessage } = useStore()
  const [sp] = useSearchParams()
  const [sel, setSel] = useState(sp.get('c') || convs[0].id)
  const [text, setText] = useState('')
  useEffect(() => { sp.get('c') && setSel(sp.get('c')) }, [sp])
  const cur = convs.find((c) => c.id === sel) || convs[0]
  const send = (e) => { e.preventDefault(); sendMessage(cur.id, text); setText('') }
  return (
    <>
      <PageHeader title="Messages" subtitle="Conversations between teams, linked to cases." />
      <Card className="grid h-[520px] grid-cols-[260px_1fr] overflow-hidden">
        <div className="border-r border-slate-200">
          {convs.map((c) => (
            <button key={c.id} onClick={() => setSel(c.id)} className={`block w-full border-b border-slate-100 p-3 text-left text-sm ${c.id === cur.id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
              <div className="font-medium">Case #{c.caseId}</div><div className="text-slate-500">Financial Aid ↔ {c.with}</div>
            </button>
          ))}
        </div>
        <div className="flex flex-col">
          <div className="border-b border-slate-200 p-3 text-sm font-semibold">Case #{cur.caseId} · Financial Aid ↔ {cur.with}</div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {cur.messages.map((m, i) => (
              <div key={i} className={`max-w-[75%] ${m.from === 'Financial Aid' ? 'ml-auto' : ''}`}>
                <div className="mb-0.5 text-xs text-slate-500">{m.from} · {m.time}</div>
                <div className={`rounded-xl px-3 py-2 text-sm ${m.from === 'Financial Aid' ? 'bg-brand-600 text-white' : 'bg-slate-100'}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-slate-200 p-3">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${cur.with}`} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <Btn variant="primary" type="submit" className="flex items-center gap-1.5"><Send size={14} /> Send</Btn>
          </form>
        </div>
      </Card>
    </>
  )
}

export function Requests() {
  const { reqs, acceptRequest, toast } = useStore()
  return (
    <>
      <PageHeader title="Requests" subtitle="Incoming requests relevant to Financial Aid." />
      <div className="grid grid-cols-2 gap-4">
        {reqs.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-start justify-between"><div className="text-xs font-medium text-brand-600">REQUEST #{r.id}</div><StatusBadge status={r.priority} /></div>
            <h3 className="mt-1 font-semibold">{r.title}</h3>
            <div className="mt-3 text-sm"><div className="text-xs text-slate-500">Student ID</div>{r.student}</div>
            <div className="mt-3 text-sm"><div className="text-xs text-slate-500">AI suggested departments (staff confirm)</div>{r.suggested.join(', ')}</div>
            <div className="mt-4 flex gap-2"><Btn variant="primary" onClick={() => acceptRequest(r.id)}>Accept</Btn><Btn onClick={() => toast(`Request ${r.id}: ${r.title} for ${r.student}`)}>View Request</Btn></div>
          </Card>
        ))}
      </div>
      {!reqs.length && <p className="py-10 text-center text-slate-400">No incoming requests. Accepted requests appear in Team Cases.</p>}
    </>
  )
}

const Bars = ({ title, data, unit = '' }) => {
  const max = Math.max(...data.map((d) => d[1]))
  return (
    <Card className="p-5">
      <SectionTitle>{title}</SectionTitle>
      <div className="space-y-2.5">
        {data.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[120px_1fr_40px] items-center gap-3 text-sm">
            <span className="text-slate-600">{k}</span>
            <div className="h-2.5 rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-500" style={{ width: `${(v / max) * 100}%` }} /></div>
            <span className="text-right font-medium">{v}{unit}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export function Analytics() {
  return (
    <>
      <PageHeader title="Analytics" subtitle="How your team and connected teams are performing." />
      <div className="mb-6 grid grid-cols-4 gap-4">
        <KpiCard label="Active Cases" value="12" /><KpiCard label="Average Resolution Time" value="2.8 days" />
        <KpiCard label="Blocked Cases" value="2" tone="text-red-600" /><KpiCard label="Cases Waiting on Other Teams" value="4" tone="text-amber-600" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Bars title="Cases by department" data={analytics.byDept} /><Bars title="Cases by status" data={analytics.byStatus} />
        <Bars title="Average resolution time (days)" data={analytics.resolution} />
      </div>
    </>
  )
}
