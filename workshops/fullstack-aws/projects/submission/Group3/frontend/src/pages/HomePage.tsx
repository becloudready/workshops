import Layout from '../components/Layout'
import { PrimaryButton } from '../components/Button.styled'
import { Card, CardIcon, CardIconChip, CardLabel, CardText, CardTitle } from '../components/Card.styled'
import '../App.css'

function HomePage() {
  return (
    <Layout>
      <section className="hero" aria-labelledby="hero-heading">
        <p className="eyebrow">For EdTech Training Teams</p>
        <h1 id="hero-heading">One board. Every trainee. No more scattered updates.</h1>
        <p className="hero-subtext">
          NoticeBoardTracker replaces one-off messages and manual spreadsheets with a
          single shared view: Training Managers see how every cohort is progressing,
          and trainees always know what's next.
        </p>
        <PrimaryButton to="/login">Get Started</PrimaryButton>
      </section>

      <section className="problem-strip" aria-labelledby="problem-heading">
        <div className="problem-strip-inner page-container">
          <h2 id="problem-heading" className="visually-hidden">
            Problems we solve
          </h2>
          <ul className="problem-list">
            <li>
              <Card $layout="row">
                <CardIconChip>
                  <svg viewBox="0 0 20 20" role="presentation" aria-hidden="true">
                    <path d="M4 3h9l3 3v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                    <path d="M13 3v3h3" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" />
                  </svg>
                </CardIconChip>
                <span>
                  <CardLabel>No more manual spreadsheets</CardLabel>
                  <CardText>Training plans and status live in one place, not scattered Excel files.</CardText>
                </span>
              </Card>
            </li>
            <li>
              <Card $layout="row">
                <CardIconChip>
                  <svg viewBox="0 0 20 20" role="presentation" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" />
                    <path d="M10 6v4l2.5 2.5" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </CardIconChip>
                <span>
                  <CardLabel>No more delayed updates</CardLabel>
                  <CardText>Progress and notices sync instantly instead of waiting on one-to-one messages.</CardText>
                </span>
              </Card>
            </li>
            <li>
              <Card $layout="row">
                <CardIconChip>
                  <svg viewBox="0 0 20 20" role="presentation" aria-hidden="true">
                    <circle cx="7" cy="7" r="3" />
                    <path d="M2 17c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                    <path d="M14 4.5a3 3 0 0 1 0 5.8M18 17c0-2.3-1.7-4.2-4-4.8" fill="none" stroke="var(--accent)" strokeWidth="1.4" />
                  </svg>
                </CardIconChip>
                <span>
                  <CardLabel>No more missing trainees</CardLabel>
                  <CardText>Every trainee in every cohort is tracked, so nobody falls through the cracks.</CardText>
                </span>
              </Card>
            </li>
          </ul>
        </div>
      </section>

      <section id="roles" className="roles-section" aria-labelledby="roles-heading">
        <h2 id="roles-heading">Built around the two people who matter most</h2>
        <div className="role-cards">
          <Card $layout="column">
            <CardIcon viewBox="0 0 24 24" role="presentation" aria-hidden="true">
              <rect x="3" y="4" width="18" height="14" rx="2" />
              <path d="M3 9h18M7 13h4M7 16h7" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" strokeLinecap="round" />
            </CardIcon>
            <CardTitle>Training Manager</CardTitle>
            <CardText>
              Set up training plans for cohorts or solo clients, and get a holistic,
              real-time view of how every trainee is progressing &mdash; no more piecing
              together updates from scattered messages.
            </CardText>
          </Card>
          <Card $layout="column">
            <CardIcon viewBox="0 0 24 24" role="presentation" aria-hidden="true">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M5 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5" fill="none" stroke="var(--icon-stroke)" strokeWidth="1.5" strokeLinecap="round" />
            </CardIcon>
            <CardTitle>Trainees</CardTitle>
            <CardText>
              Get every notice the moment it's posted, and report your progress
              directly &mdash; no more waiting on emails or filling out someone else's
              spreadsheet.
            </CardText>
          </Card>
        </div>
      </section>

      <section className="how-it-works" aria-labelledby="how-heading">
        <h2 id="how-heading">How it works</h2>
        <ol className="steps">
          <li>
            <span className="step-number" aria-hidden="true">1</span>
            <h3>Set up the plan</h3>
            <p>Training Manager creates a training plan for a cohort or solo trainee.</p>
          </li>
          <li>
            <span className="step-number" aria-hidden="true">2</span>
            <h3>Track progress</h3>
            <p>Trainees log updates as they go; the Training Manager sees it all in one board.</p>
          </li>
          <li>
            <span className="step-number" aria-hidden="true">3</span>
            <h3>Stay notified</h3>
            <p>Notices and status changes reach everyone instantly &mdash; no chasing required.</p>
          </li>
        </ol>
      </section>
    </Layout>
  )
}

export default HomePage
