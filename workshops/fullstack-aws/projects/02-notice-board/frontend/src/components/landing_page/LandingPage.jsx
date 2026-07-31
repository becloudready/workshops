import { Link } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  return (
    <>
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">A better way to stay informed</p>
          <h1 id="hero-title">
            Keep your
            <span className="heading-accent"> community </span>
            in the know.
          </h1>
          <p className="hero-description">
            One clear place for announcements, updates, and the moments that
            matter. Share what&apos;s happening and never miss what&apos;s next.
          </p>
          <Link className="primary-button" to="/notices">
            Explore the notice board
            <span className="button-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="notice-preview" aria-label="Notice board preview">
          <div className="preview-header">
            <div>
              <p className="preview-label">Latest updates</p>
              <h2>Community board</h2>
            </div>
            <span className="live-indicator">
              <span aria-hidden="true" />
              Live
            </span>
          </div>
          <div className="preview-list">
            <article className="preview-notice featured-notice">
              <span className="notice-icon notice-icon-blue" aria-hidden="true">
                ✦
              </span>
              <div>
                <p className="notice-meta">Community · Today</p>
                <h3>Welcome to your shared space</h3>
                <p className="notice-excerpt">
                  Stay connected with everything happening around you.
                </p>
              </div>
            </article>
            <article className="preview-notice">
              <span className="notice-icon notice-icon-yellow" aria-hidden="true">
                ◷
              </span>
              <div>
                <p className="notice-meta">Events · Tomorrow</p>
                <h3>Monthly community gathering</h3>
              </div>
            </article>
            <article className="preview-notice">
              <span className="notice-icon notice-icon-pink" aria-hidden="true">
                ♥
              </span>
              <div>
                <p className="notice-meta">News · This week</p>
                <h3>Small updates, big difference</h3>
              </div>
            </article>
          </div>
          <Link className="preview-footer" to="/notices">
            See all notices <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  )
}

export default LandingPage
