import styled from 'styled-components'

export const Card = styled.article<{ $layout?: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${(props) => (props.$layout === 'row' ? 'row' : 'column')};
  align-items: ${(props) => (props.$layout === 'row' ? 'flex-start' : 'stretch')};
  gap: 14px;
  text-align: left;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: ${(props) => (props.$layout === 'row' ? '20px' : '28px')};
  background: var(--bg);
  box-shadow: var(--shadow);
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(29, 78, 216, 0.25), 0 8px 10px -6px rgba(29, 78, 216, 0.2);
    transform: translateY(-4px);
  }
`

export const CardIconChip = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--accent-bg);

  svg {
    width: 22px;
    height: 22px;
    fill: var(--accent);
  }
`

export const CardIcon = styled.svg`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  fill: var(--accent);
`

export const CardTitle = styled.h3`
  color: var(--text-h);
  font-size: 20px;
  margin: 4px 0 8px;
`

export const CardLabel = styled.strong`
  display: block;
  color: var(--text-h);
  font-size: 16px;
  margin-bottom: 4px;
`

export const CardText = styled.p`
  font-size: 15px;
  margin: 0;
`
