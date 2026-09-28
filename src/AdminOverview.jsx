import { useNavigate } from 'react-router-dom'
import { Building2, ShieldAlert, Timer, FolderOpen } from 'lucide-react'
import { useStore } from './store.jsx'
import { useAuth } from './auth.jsx'
import { PageHeader, Card, SectionTitle, KpiCard, StatusBadge, DependencyCard } from './components.jsx'

const DEPT_STATS = [
  ['Academic Services', 9, 1, 2, '2.4'], ['Financial Aid', 12, 2, 4, '2.8'], ['Accommodation', 6, 1, 3, '3.6'],
  ['Wellbeing', 5, 0, 1, '2.2'], ['Careers', 3, 0, 0, '1.9'], ['Accessibility', 4, 1, 2, '3.1'],
]
const EXTRA = [
  { id: 'X-1', status: 'Waiting', caseId: 1080, team: 'Accessibility', waitingFor: 'Wellbeing', required: 'Support plan sign-off', since: 'Yesterday' },
  { id: 'X-2', status: 'Waiting', caseId: 1093, team: 'Accommodation', waitingFor: 'Academic Services', required: 'Timetable confirmation', since: '10:15 AM' },
]

export default function AdminOverview() {
  const { deps, cases } = useStore()
  const { user } = useAuth()
  const nav = useNavigate()
  const blockers = [...deps, ...EXTRA]
  const multi = cases.filter((c) => c.teams.length >= 3)
  return (
    <>
      <PageHeader title="University overview" subtitle={`Welcome, ${user.name}. Cross-department cases across every support team.`} />
      <div className="mb-6 grid grid-cols-4 gap-4">
        <KpiCard label="Active cases" value="39" tone="text-brand-600" /><KpiCard label="Departments" value="6" />
        <KpiCard label="Open dependencies" value={blockers.length} tone="text-red-600" /><KpiCard label="Average resolution" value="2.8 days" tone="text-amber-600" />
      </div>
      <div className="grid grid-cols-[1.2fr_1fr] gap-5">
        <Card>
          <div className="px-4 pt-4"><SectionTitle>Departments</SectionTitle></div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-slate-200 text-left text-xs text-slate-500">{['Department', 'Active', 'Blocked', 'Waiting on others', 'Avg days'].map((h) => <th key={h} className="px-4 py-2.5 font-medium">{h}</th>)}</tr></thead>
            <tbody>{DEPT_STATS.map(([n, a, b, w, d]) => (
              <tr key={n} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-3 font-medium">{n}</td><td className="px-4 py-3">{a}</td>
                <td className="px-4 py-3">{b ? <span className="font-medium text-red-600">{b}</span> : 0}</td><td className="px-4 py-3">{w}</td><td className="px-4 py-3">{d}</td>
              </tr>))}</tbody>
          </table>
        </Card>
        <Card className="self-start p-4">
          <SectionTitle>Cross-team dependencies</SectionTitle>
          <div className="space-y-2">
            {blockers.map((d) => <DependencyCard key={d.id} variant="compact" dep={d} onOpen={cases.some((c) => c.id === d.caseId) ? () => nav(`/cases/${d.caseId}`) : undefined} />)}
          </div>
        </Card>
      </div>
      <Card className="mt-5 p-4">
        <SectionTitle>Cases involving three or more teams</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          {multi.map((c) => (
            <button key={c.id} onClick={() => nav(`/cases/${c.id}`)} className="rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50">
              <div className="flex items-center justify-between text-sm"><span className="font-medium">#{c.id} · {c.issue}</span><StatusBadge status={c.status} /></div>
              <div className="mt-1 text-xs text-slate-500">{c.teams.map((t) => t.name).join(' · ')}</div>
            </button>
          ))}
        </div>
      </Card>
    </>
  )
}
