import { useEffect, useState } from 'react'
import { ArrowLeftRight, Home, Landmark, LogOut, Menu, UserCircle, X } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { currentUser } from '../../data/mockData'
import { logout } from '../../api/bankingApi'

export function CustomerLayout() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const initials = `${currentUser.firstName[0]}${currentUser.lastName[0]}`
  const signOut = () => { logout(); navigate('/') }
  useEffect(() => {
    const preventFormSubmit = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        event.preventDefault()
        event.target.blur()
      }
    }
    document.addEventListener('keydown', preventFormSubmit, true)
    return () => document.removeEventListener('keydown', preventFormSubmit, true)
  }, [])

  return <div className="app-shell">
    <header className="topbar">
      <button className="icon-button" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
      <div className="brand"><Landmark size={22} /><span>Northstar Bank</span></div>
      <div className="topbar-actions"><button className="signout-button" type="button" onClick={signOut}><LogOut size={17} /> Sign out</button></div>
    </header>
    {menuOpen && <button className="drawer-backdrop" aria-label="Close navigation" type="button" onClick={() => setMenuOpen(false)} />}
    <aside className={`drawer ${menuOpen ? 'drawer-open' : ''}`}>
      <div className="drawer-header"><span className="brand"><Landmark size={22} /> Northstar</span><button className="icon-button" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)}><X size={22} /></button></div>
      <nav className="drawer-nav">
        <NavLink className="nav-link" to="/dashboard" onClick={() => setMenuOpen(false)}><Home size={18} /> Dashboard</NavLink>
        <NavLink className="nav-link" to="/deposit" onClick={() => setMenuOpen(false)}><Landmark size={18} /> Deposit</NavLink>
        <NavLink className="nav-link" to="/transfer" onClick={() => setMenuOpen(false)}><ArrowLeftRight size={18} /> Transfers</NavLink>
        <NavLink className="nav-link" to="/profile" onClick={() => setMenuOpen(false)}><UserCircle size={18} /> Profile</NavLink>
      </nav>
      <div className="drawer-footer"><p>Signed in as</p><strong>{currentUser.firstName} {currentUser.lastName}</strong></div>
    </aside>
    <Outlet context={{ initials }} />
  </div>
}
