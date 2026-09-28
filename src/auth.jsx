import { createContext, useContext, useState } from 'react'

export const DEPARTMENTS = ['Academic Services', 'Financial Aid', 'Accommodation', 'Wellbeing', 'Careers', 'Accessibility']
export const ADMIN_CODE = 'HUDDLE-ADMIN' // demo only. A real backend would verify invitations.
const SEED = [
  { name: 'Dr. Meera Kapoor', email: 'admin@huddle.edu', password: 'admin123', role: 'uni', dept: null },
  { name: 'Rahul Sharma', email: 'rahul@huddle.edu', password: 'rahul123', role: 'dept', dept: 'Financial Aid' },
]
export const DEMO = { uni: SEED[0], dept: SEED[1] }

const read = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb } catch { return fb } }
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} }

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('huddle_session', null))
  const users = () => [...SEED, ...read('huddle_users', [])]
  const start = (u) => { const s = { name: u.name, email: u.email, role: u.role, dept: u.dept }; setUser(s); write('huddle_session', s) }

  const signIn = ({ email, password, role }) => {
    const u = users().find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password)
    if (!u) return 'Email or password is incorrect.'
    if (u.role !== role) return `This account is a ${u.role === 'uni' ? 'University' : 'Department'} Admin account. Switch the tab above.`
    start(u); return null
  }
  const signUp = ({ name, email, password, role, dept, code }) => {
    if (!name.trim() || !email.trim()) return 'Enter your name and email.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (users().some((x) => x.email.toLowerCase() === email.trim().toLowerCase())) return 'An account with this email already exists. Sign in instead.'
    if (role === 'uni' && code !== ADMIN_CODE) return 'Invalid admin access code.'
    if (role === 'dept' && !dept) return 'Choose your department.'
    const u = { name: name.trim(), email: email.trim(), password, role, dept: role === 'dept' ? dept : null }
    write('huddle_users', [...read('huddle_users', []), u]); start(u); return null
  }
  const signOut = () => { setUser(null); write('huddle_session', null) }
  return <Ctx.Provider value={{ user, signIn, signUp, signOut }}>{children}</Ctx.Provider>
}
