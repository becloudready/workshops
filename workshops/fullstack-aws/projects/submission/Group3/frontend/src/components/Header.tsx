import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import './Header.css'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Courses/Assignments', to: '/courses' },
  { label: 'About', to: '/about' },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  function closeMenu() {
    setIsMenuOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" aria-label="NoticeBoardTracker home" onClick={closeMenu}>
          <svg
            className="brand-mark"
            viewBox="0 0 24 24"
            role="presentation"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 9h18" stroke="var(--icon-stroke)" strokeWidth="1.5" />
            <path d="M7 13h6M7 16h9" stroke="var(--icon-stroke)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span>NoticeBoardTracker</span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="visually-hidden">
            {isMenuOpen ? 'Close menu' : 'Open menu'}
          </span>
          <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
            {isMenuOpen ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>

        <nav
          id="primary-nav"
          className={`primary-nav${isMenuOpen ? ' is-open' : ''}`}
          aria-label="Primary"
        >
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} onClick={closeMenu}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {isLoggedIn ? (
            <button type="button" className="nav-cta" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <Link to="/login" className="nav-cta" onClick={closeMenu}>
              Log In / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
