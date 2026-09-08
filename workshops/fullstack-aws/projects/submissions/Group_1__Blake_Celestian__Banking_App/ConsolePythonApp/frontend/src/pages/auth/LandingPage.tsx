import { useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, Landmark, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../../api/bankingApi'

export function LandingPage() {
  const navigate = useNavigate()
  const location = useLocation() //useLocation is for accessing the current location object which contains information about the URL and state passed during navigation
  const accountCreated = Boolean((location.state as { accountCreated?: boolean } | null)?.accountCreated) //checks if customer or admin successfuly created a user account
  const [email, setEmail] = useState('') //use states to store the inputted values
  const [password, setPassword] = useState('')
  const [adminLogin, setAdminLogin] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true); setError('')
    try { const result = await login(email, password); if (result.isAdmin !== adminLogin) { setError(`This account is registered as a ${result.isAdmin ? 'admin' : 'customer'} account.`); return } localStorage.setItem('banking_user_id', result.userId); navigate(result.isAdmin ? '/admin/accounts' : '/dashboard') } catch { setError('We could not sign you in. Check your email and password.') } finally { setSubmitting(false) }
  }
  return <main className="landing-page"><header className="landing-nav"><Link className="landing-brand" to="/"><span className="logo-mark"><Landmark size={21} /></span><span>Northstar Bank</span></Link><Link className="landing-signup" to="/signup">Open an account <ArrowRight size={16} /></Link></header><section className="landing-content"><div className="landing-copy"><p className="eyebrow"><Sparkles size={14} /> BANKING, MADE CLEAR</p><h1>A steadier way to manage your money.</h1><p className="landing-lede">Everyday banking with a clearer view of what matters, from your first account to your next milestone.</p><div className="landing-points"><span><ShieldCheck size={17} /> Built around your privacy</span><span><Landmark size={17} /> Accounts that work together</span></div></div><section className="login-panel"><p className="eyebrow">WELCOME BACK</p><h2>Sign in to Northstar</h2><p className="login-subtitle">Access your accounts securely.</p>{accountCreated && <p className="success-message">Your account was created. Sign in to continue.</p>}<form onSubmit={submit}><label htmlFor="login-email">Email address</label><input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /><label htmlFor="login-password">Password</label><input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Enter your password" /><label className="checkbox-label"><input type="checkbox" checked={adminLogin} onChange={(event) => setAdminLogin(event.target.checked)} /> Sign in as an administrator</label>{error && <p className="error-message">{error}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'} <ArrowRight size={17} /></button></form><p className="form-footer">New to Northstar? <Link to="/signup">Create an account</Link></p></section></section><footer className="landing-footer"><span>Northstar Bank</span><span>Simple tools for everyday money.</span><span>Secure access · Member FDIC</span></footer></main>
}
