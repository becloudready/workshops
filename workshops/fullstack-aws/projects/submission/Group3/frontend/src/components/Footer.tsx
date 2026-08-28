import { Link } from 'react-router-dom'
import './Footer.css'

const FOOTER_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
]

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <p>NoticeBoardTracker &mdash; built for EdTech training teams.</p>
        <nav aria-label="Footer">
          <ul>
            {FOOTER_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
