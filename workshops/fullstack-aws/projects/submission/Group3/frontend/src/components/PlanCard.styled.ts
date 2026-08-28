import styled from 'styled-components'

export const PlanCardWrapper = styled.div`
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
`

export const PlanHeaderButton = styled.button`
  width: 100%;
  text-align: left;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background: var(--accent-bg);
  }

  &:focus-visible {
    outline: 3px solid var(--accent-border);
    outline-offset: -3px;
  }
`

export const PlanIndex = styled.span`
  flex-shrink: 0;
  width: 28px;
  margin-top: 2px;
  font-family: var(--mono);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  text-align: right;
`

export const PlanMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const PlanTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text-h);
`

export const PlanMeta = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  color: var(--text-muted);
`

export const PlanSide = styled.div`
  flex-shrink: 0;
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
`

export const Chevron = styled.svg<{ $open: boolean }>`
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  transition: transform 0.2s;
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
`

export const AssignmentsPanel = styled.div`
  border-top: 1px solid var(--border);
`

export const AssignmentsPanelLabel = styled.div`
  padding: 8px 24px;
  background: var(--accent-bg);
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
`

export const AssignmentRowStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 24px;
  border-top: 1px solid var(--border);
  transition: background-color 0.15s;

  &:hover {
    background: var(--accent-bg);
  }
`

export const AssignmentIndex = styled.span`
  flex-shrink: 0;
  width: 20px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
  text-align: right;
`

export const AssignmentInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const AssignmentTitle = styled.p<{ $completed: boolean }>`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
  color: ${(props) => (props.$completed ? 'var(--text-muted)' : 'var(--text-h)')};
`

export const AssignmentSteps = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--text-muted);
`
