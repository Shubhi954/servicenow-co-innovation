import { createContext, useContext, useState, useCallback } from 'react'
import * as seed from './data.js'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)
const now = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

export function StoreProvider({ children }) {
  const [cases, setCases] = useState(seed.cases)
  const [tasks, setTasks] = useState(seed.tasks)
  const [deps, setDeps] = useState(seed.dependencies)
  const [convs, setConvs] = useState(seed.conversations)
  const [reqs, setReqs] = useState(seed.requests)
  const [toasts, setToasts] = useState([])
  const [taskModal, setTaskModal] = useState(null)

  const toast = useCallback((msg) => {
    const id = Math.random()
    setToasts((t) => [...t, { id, msg }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500)
  }, [])

  const log = (caseId, text, team = 'Financial Aid') =>
    setCases((cs) => cs.map((c) => (c.id === caseId ? { ...c, updated: 'Today', activity: [...c.activity, { time: now(), team, text }] } : c)))

  const toggleCheck = (taskId, i) =>
    setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, checklist: t.checklist.map((v, j) => (j === i ? !v : v)) } : t)))

  const saveUpdate = (taskId, text) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!text.trim()) return toast('Write an update before saving.')
    setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, notes: [...t.notes, text] } : t)))
    log(task.caseId, `Task update: ${text.trim()}`)
    toast('Update saved')
  }

  const completeTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId)
    setTasks((ts) => ts.map((t) => (t.id === taskId ? { ...t, status: 'Completed', checklist: t.checklist.map(() => true), dependency: null } : t)))
    setCases((cs) => cs.map((c) => c.id !== task.caseId ? c : {
      ...c, updated: 'Today', stage: Math.max(c.stage, 4),
      teams: c.teams.map((x) => (x.name === 'Financial Aid' ? { ...x, state: 'done' } : x)),
      status: c.status === 'Blocked' ? 'In Progress' : c.status,
      activity: [...c.activity, { time: now(), team: 'Financial Aid', text: 'Financial Aid task completed.' }],
    }))
    toast(`Task complete. Case #${task.caseId} updated.`)
    setTaskModal(null)
  }

  const remind = (depId) => {
    const d = deps.find((x) => x.id === depId)
    setDeps((ds) => ds.map((x) => (x.id === depId ? { ...x, reminded: true } : x)))
    log(d.caseId, `Reminder sent to ${d.waitingFor} for ${d.required.toLowerCase()}`)
    toast(`Reminder sent to ${d.waitingFor}`)
  }

  const resolveDependency = (depId) => {
    const d = deps.find((x) => x.id === depId)
    setDeps((ds) => ds.map((x) => (x.id === depId ? { ...x, status: 'Resolved' } : x)))
    setTasks((ts) => ts.map((t) => (t.caseId === d.caseId && t.dependency ? { ...t, dependency: null, status: t.status === 'Blocked' ? 'In Progress' : t.status } : t)))
    setCases((cs) => cs.map((c) => (c.id === d.caseId && c.status === 'Blocked' ? { ...c, status: 'In Progress' } : c)))
    log(d.caseId, `${d.required} received from ${d.waitingFor}. Dependency resolved.`, d.waitingFor)
    toast(`Dependency resolved on Case #${d.caseId}`)
  }

  const sendMessage = (convId, text) => {
    if (!text.trim()) return
    setConvs((cs) => cs.map((c) => (c.id === convId ? { ...c, messages: [...c.messages, { from: 'Financial Aid', text, time: now() }] } : c)))
  }

  const acceptRequest = (id) => {
    const r = reqs.find((x) => x.id === id)
    const caseId = 1090 + cases.length
    setReqs((rs) => rs.filter((x) => x.id !== id))
    setCases((cs) => [{ id: caseId, student: r.student, issue: r.title, priority: r.priority, status: 'Pending', due: '5 Oct', updated: 'Today', owner: 'Rahul', caseOwner: 'Student Support Team', created: '28 Sep 2026', stage: 2,
      teams: r.suggested.map((n) => ({ name: n, state: n === 'Financial Aid' ? 'active' : 'pending' })), activity: [{ time: now(), team: 'Financial Aid', text: `Request ${r.id} accepted` }] }, ...cs])
    toast(`Request ${r.id} accepted as Case #${caseId}`)
  }

  const value = { cases, tasks, deps, convs, reqs, toasts, taskModal, setTaskModal, toast, toggleCheck, saveUpdate, completeTask, remind, resolveDependency, sendMessage, acceptRequest }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
