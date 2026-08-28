// Header.jsx
import { Link } from 'react-router-dom';
import '../App.css';

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__pin" />
        Noticeboard
      </div>
      <nav className="app-header__nav">
        <Link to="/onboarding" className="app-header__tab">Onboarding</Link>
        <Link to="/progress" className="app-header__tab">My Progress</Link>
      </nav>
    </header>
  );
}

export default Header;