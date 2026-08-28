import styled from 'styled-components'

export const AboutContainer = styled.div`
  width: 100%;
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;
  text-align: left;

  @media (max-width: 640px) {
    padding: 0 20px;
  }
`

// ── Full-bleed section shell (same break-out trick used by the header/footer
// and the landing page's problem strip) ─────────────────────────────────────
export const FullBleedSection = styled.section`
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
`

// ── Hero ─────────────────────────────────────────────────────────────────
export const Hero = styled(FullBleedSection)`
  position: relative;
  overflow: hidden;
  background: var(--hero-surface);
  background-image: linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  padding: 72px 24px;

  @media (max-width: 640px) {
    padding: 48px 20px;
  }
`

export const HeroEyebrow = styled.p`
  margin: 0 0 20px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
`

export const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`

export const HeroHeading = styled.h1`
  margin: 0 0 20px;
  font-size: 42px;
  line-height: 1.15;
  color: #fff;

  em {
    color: #fde68a;
    font-style: italic;
  }

  @media (max-width: 640px) {
    font-size: 32px;
  }
`

export const HeroSubtext = styled.p`
  max-width: 38ch;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
`

export const HeroStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.12);
`

export const HeroStatTile = styled.div`
  padding: 18px;
  background: rgba(255, 255, 255, 0.05);
`

export const HeroStatValue = styled.p`
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 600;
  color: #fff;
`

export const HeroStatLabel = styled.p`
  margin: 0;
  font-family: var(--mono);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
`

// ── Generic section spacing ─────────────────────────────────────────────
export const Section = styled.section`
  padding: 64px 0;

  @media (max-width: 640px) {
    padding: 40px 0;
  }
`

export const SectionIntro = styled.div`
  margin-bottom: 40px;
`

// ── Context ──────────────────────────────────────────────────────────────
export const ContextGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`

export const ContextBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 15px;
  line-height: 1.7;
  color: var(--text);
`

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 0;
`

// ── Problems ─────────────────────────────────────────────────────────────
export const ProblemsList = styled.div`
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
`

export const ProblemRow = styled.div<{ $alt: boolean }>`
  display: flex;
  gap: 20px;
  padding: 20px 24px;
  background: ${(props) => (props.$alt ? 'var(--accent-bg)' : 'var(--bg)')};

  &:not(:first-child) {
    border-top: 1px solid var(--border);
  }
`

export const ProblemNumber = styled.span`
  flex-shrink: 0;
  width: 24px;
  margin-top: 2px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
`

export const ProblemTitle = styled.p`
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-h);
`

export const ProblemBody = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text);
`

// ── Solution banner ──────────────────────────────────────────────────────
export const SolutionBanner = styled(FullBleedSection)`
  background: var(--hero-surface);
  padding: 48px 24px;
`

export const SolutionGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`

export const SolutionMain = styled.div`
  flex: 1;
`

export const SolutionEyebrow = styled.p`
  margin: 0 0 8px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
`

export const SolutionHeading = styled.h2`
  margin: 0;
  font-size: 26px;
  line-height: 1.3;
  color: #fff;
`

export const SolutionText = styled.p`
  margin: 0;
  max-width: 32ch;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
`
