import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <Link className="brand" to="/" aria-label="Notice Board home">
        <span className="brand-mark" aria-hidden="true">
          N
        </span>
        <span>Notice Board</span>
      </Link>
      <Link className="nav-link" to="/notices">
        View notices
        <span aria-hidden="true">↗</span>
      </Link>
    </nav>
  )
}

export default Header
