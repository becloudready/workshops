import styled from 'styled-components'

export const PageWrap = styled.div`
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 48px 24px 64px;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 32px 16px 48px;
  }
`

export const Eyebrow = styled.p`
  margin: 0 0 8px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
`

export const Title = styled.h1`
  margin: 0 0 24px;
  font-size: 32px;
  line-height: 1.2;
  color: var(--text-h);

  @media (max-width: 640px) {
    font-size: 26px;
  }
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--border);
  border: 1px solid var(--border);

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

export const StatTile = styled.div`
  padding: 16px;
  background: var(--bg);
`

export const StatLabel = styled.p`
  margin: 0 0 4px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
`

export const StatValue = styled.p`
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 600;
  line-height: 1;
  color: var(--text-h);
`

export const StatSub = styled.p`
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
`

export const SearchFilterRow = styled.div`
  display: flex;
  gap: 12px;
  margin: 32px 0 24px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`

export const ResultsCount = styled.p`
  margin: 0 0 16px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`

export const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 12px;
  color: var(--text-muted);
  font-size: 14px;
`

export const PlanList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
