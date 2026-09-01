import Layout from '../components/Layout'
import { SectionEyebrow, SectionHeading } from '../components/SectionHeading.styled'
import { StatsGrid, StatTile, StatLabel, StatValue, StatSub } from './AssignmentPage.styled'
import {
  AboutContainer,
  Hero,
  HeroEyebrow,
  HeroGrid,
  HeroHeading,
  HeroSubtext,
  HeroStatsGrid,
  HeroStatTile,
  HeroStatValue,
  HeroStatLabel,
  Section,
  SectionIntro,
  ContextGrid,
  ContextBody,
  Divider,
  ProblemsList,
  ProblemRow,
  ProblemNumber,
  ProblemTitle,
  ProblemBody,
  SolutionBanner,
  SolutionGrid,
  SolutionMain,
  SolutionEyebrow,
  SolutionHeading,
  SolutionText,
} from './AboutPage.styled'

const HERO_STATS = [
  { n: '2', label: 'Roles supported' },
  { n: '1', label: 'Source of truth' },
  { n: '∞', label: 'Cohort capacity' },
  { n: '0', label: 'Spreadsheets needed' },
]

const PROBLEMS = [
  {
    n: '01',
    title: 'One-to-one chaos',
    body: "Managers chase trainees through emails and direct messages. Every update lives in a separate thread, invisible to anyone else.",
  },
  {
    n: '02',
    title: 'Manual spreadsheets',
    body: "Progress is logged by hand into Excel files that go stale the moment they're saved — version conflicts, formula errors, and no single source of truth.",
  },
  {
    n: '03',
    title: 'Delayed & inaccurate updates',
    body: "By the time a status reaches the Training Manager, it's often wrong. Decisions get made on yesterday's data.",
  },
  {
    n: '04',
    title: 'Duplicates & missing trainees',
    body: 'Without a central registry, the same trainee gets enrolled twice — or falls through the cracks entirely and never starts.',
  },
  {
    n: '05',
    title: 'No holistic view',
    body: "No one can see the full picture: which cohorts are on track, who's stuck, and where the bottlenecks are across all training plans.",
  },
]

const PILLARS = [
  { label: 'Cohort Training', desc: 'Groups move through plans together, with shared visibility for managers.' },
  { label: 'Solo Pipelines', desc: 'Client-specific training plans run independently alongside cohort programmes.' },
  { label: 'Notice Board', desc: 'Announcements reach every relevant trainee instantly, not buried in an inbox.' },
  { label: 'Progress Tracking', desc: 'Trainees report progress; managers see it reflected live — no manual relay.' },
  { label: 'Audit Trail', desc: 'Every enrolment, completion, and status change is logged and traceable.' },
  { label: 'Single Source of Truth', desc: 'One system of record replaces every scattered spreadsheet and message thread.' },
]

function AboutPage() {
  return (
    <Layout>
      <Hero>
        <AboutContainer>
          <HeroEyebrow>About NoticeBoardTracker</HeroEyebrow>
          <HeroGrid>
            <div>
              <HeroHeading>
                Training, tracked.
                <br />
                <em>Finally.</em>
              </HeroHeading>
              <HeroSubtext>
                NoticeBoardTracker is a full-stack training management platform built for EdTech
                organisations that are done with scattered spreadsheets and missed messages.
              </HeroSubtext>
            </div>

            <HeroStatsGrid>
              {HERO_STATS.map((stat) => (
                <HeroStatTile key={stat.label}>
                  <HeroStatValue>{stat.n}</HeroStatValue>
                  <HeroStatLabel>{stat.label}</HeroStatLabel>
                </HeroStatTile>
              ))}
            </HeroStatsGrid>
          </HeroGrid>
        </AboutContainer>
      </Hero>

      <AboutContainer>
        <Section>
          <ContextGrid>
            <div>
              <SectionEyebrow>The Context</SectionEyebrow>
              <SectionHeading>An EdTech organisation with a people problem</SectionHeading>
            </div>
            <ContextBody>
              <p>
                Trainees join the organisation and the Training Manager designs their programme
                directly — assembling training plans, attaching assignments, and determining
                whether a trainee will train as part of a cohort or follow a solo,
                client-specific path.
              </p>
              <p>
                Both sides of that relationship carry communication obligations. The organisation
                needs to notify trainees of new plans, schedule changes, and progress milestones.
                Trainees need a structured way to report back — not a direct message, not a
                reply-all email chain.
              </p>
              <p>
                The Training Manager, sitting at the centre, needs a live, accurate picture of
                every trainee's status across every plan they own. That picture has never existed
                — until now.
              </p>
            </ContextBody>
          </ContextGrid>
        </Section>

        <Divider />

        <Section>
          <SectionIntro>
            <SectionEyebrow>The Problem</SectionEyebrow>
            <SectionHeading>Things have been done the scattered way</SectionHeading>
          </SectionIntro>

          <ProblemsList>
            {PROBLEMS.map((problem, i) => (
              <ProblemRow key={problem.n} $alt={i % 2 === 1}>
                <ProblemNumber>{problem.n}</ProblemNumber>
                <div>
                  <ProblemTitle>{problem.title}</ProblemTitle>
                  <ProblemBody>{problem.body}</ProblemBody>
                </div>
              </ProblemRow>
            ))}
          </ProblemsList>
        </Section>
      </AboutContainer>

      <SolutionBanner>
        <AboutContainer>
          <SolutionGrid>
            <SolutionMain>
              <SolutionEyebrow>The Solution</SolutionEyebrow>
              <SolutionHeading>One efficient, full-stack platform to replace it all</SolutionHeading>
            </SolutionMain>
            <SolutionText>
              NoticeBoardTracker centralises every touchpoint &mdash; plan creation, assignment
              tracking, cohort management, and two-way notifications &mdash; into a single system
              that everyone can trust.
            </SolutionText>
          </SolutionGrid>
        </AboutContainer>
      </SolutionBanner>

      <AboutContainer>
        <Section>
          <SectionIntro>
            <SectionEyebrow>What it does</SectionEyebrow>
            <SectionHeading>Six pillars of the platform</SectionHeading>
          </SectionIntro>

          <StatsGrid style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {PILLARS.map((pillar, i) => (
              <StatTile key={pillar.label}>
                <StatLabel>{String(i + 1).padStart(2, '0')}</StatLabel>
                <StatValue style={{ fontSize: '16px' }}>{pillar.label}</StatValue>
                <StatSub>{pillar.desc}</StatSub>
              </StatTile>
            ))}
          </StatsGrid>
        </Section>
      </AboutContainer>
    </Layout>
  )
}

export default AboutPage
