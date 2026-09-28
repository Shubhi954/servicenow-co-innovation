import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Check, Circle, Clock } from 'lucide-react'
import { useAuth, DEPARTMENTS, DEMO, ADMIN_CODE } from './auth.jsx'
import { Logo } from './layout.jsx'

const Field = ({ label, ...p }) => (
  <label className="block text-sm font-medium text-slate-700">{label}
    <input {...p} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-brand-500" />
  </label>
)

export default function AuthPage({ mode }) {
  const { signIn, signUp } = useAuth()
  const nav = useNavigate()
  const up = mode === 'signup'
  const [role, setRole] = useState('dept')
  const [f, setF] = useState({ name: '', email: '', password: '', dept: '', code: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const r = up ? signUp({ ...f, role }) : signIn({ ...f, role })
    if (r) setErr(r); else nav(role === 'uni' ? '/admin' : '/dashboard')
  }
  const demo = () => { const d = DEMO[role]; setF({ ...f, email: d.email, password: d.password }); setErr('') }
  return (
    <div className="grid min-h-screen grid-cols-[1.05fr_1fr]">
      <div className="flex flex-col justify-between bg-[#0f1e3d] p-12 text-white">
        <Logo dark />
        <div>
          <h1 className="max-w-md text-4xl font-semibold leading-tight">One case. Every team. One resolution.</h1>
          <p className="mt-4 max-w-md text-slate-300">Huddle joins university support teams around a single student case, so nobody works in isolation.</p>
          <div className="mt-8 max-w-sm rounded-xl bg-white/10 p-4 backdrop-blur">
            <div className="mb-3 text-sm font-medium">Case #1042 · Fee Support</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-emerald-300"><Check size={15} /> Academic Services — completed</div>
              <div className="flex items-center gap-2 text-blue-200"><Circle size={15} /> Financial Aid — in progress</div>
              <div className="flex items-center gap-2 text-slate-300"><Clock size={15} /> Accommodation — pending</div>
            </div>
          </div>
        </div>
        <p className="text-xs text-slate-400">Prototype with mock data. No real student information.</p>
      </div>
      <div className="flex items-center justify-center bg-white p-10">
        <form onSubmit={submit} className="w-full max-w-sm space-y-4">
          <div><h2 className="text-2xl font-semibold">{up ? 'Create your account' : 'Sign in to Huddle'}</h2><p className="mt-1 text-sm text-slate-500">{up ? 'Choose the type of admin account you need.' : 'Welcome back. Choose your account type.'}</p></div>
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            {[['dept', 'Department Admin'], ['uni', 'University Admin']].map(([k, l]) => (
              <button type="button" key={k} onClick={() => { setRole(k); setErr('') }} className={`rounded-md py-1.5 text-sm font-medium ${role === k ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500'}`}>{l}</button>
            ))}
          </div>
          {up && <Field label="Full name" value={f.name} onChange={set('name')} autoComplete="name" />}
          <Field label="Work email" type="email" value={f.email} onChange={set('email')} autoComplete="email" />
          <Field label="Password" type="password" value={f.password} onChange={set('password')} autoComplete={up ? 'new-password' : 'current-password'} />
          {up && role === 'dept' && (
            <label className="block text-sm font-medium text-slate-700">Department
              <select value={f.dept} onChange={set('dept')} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal">
                <option value="">Select your department</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </label>
          )}
          {up && role === 'uni' && <Field label="Admin access code" value={f.code} onChange={set('code')} placeholder={`Demo code: ${ADMIN_CODE}`} />}
          {err && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}
          <button type="submit" className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">{up ? 'Create account' : 'Sign in'}</button>
          {!up && <button type="button" onClick={demo} className="w-full rounded-lg border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50">Fill demo {role === 'uni' ? 'University Admin' : 'Department Admin'} credentials</button>}
          <p className="text-center text-sm text-slate-500">{up ? 'Already have an account?' : 'New to Huddle?'} <Link to={up ? '/signin' : '/signup'} className="font-medium text-brand-600">{up ? 'Sign in' : 'Create an account'}</Link></p>
        </form>
      </div>
    </div>
  )
}
