import styled from 'styled-components'

export const ResultsCount = styled.p`
  margin: 0 0 12px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`

export const Row = styled.tr<{ $selected: boolean }>`
  cursor: pointer;
  background: ${(props) => (props.$selected ? 'var(--accent-bg)' : 'transparent')};
  transition: background-color 0.15s;

  &:hover {
    background: var(--accent-bg);
  }
`

export const Td = styled.td`
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
`

export const IdText = styled.span`
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`

export const UsernameText = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
`

export const EmailText = styled.span`
  font-size: 14px;
  color: var(--text);
`

export const ProgressCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ProgressCellNote = styled.span`
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`

export const ChevronCell = styled.td`
  padding: 14px 16px;
  text-align: right;
  border-bottom: 1px solid var(--border);
`

export const Chevron = styled.svg<{ $open: boolean }>`
  width: 14px;
  height: 14px;
  display: inline-block;
  color: var(--text-muted);
  transition: transform 0.2s;
  transform: rotate(${(props) => (props.$open ? '180deg' : '0deg')});
`

export const ExpandedCell = styled.td`
  background: var(--accent-bg);
  border-bottom: 1px solid var(--border);
`

export const ExpandedInner = styled.div`
  padding: 16px 24px;
`

export const ExpandedLabel = styled.p`
  margin: 0 0 12px;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
`

export const EmptyNote = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
`

export const PlanRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const PlanRow = styled.div`
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid var(--border);
`

export const PlanRowHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  font: inherit;
  text-align: left;
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

export const PlanRowMain = styled.div`
  flex: 1;
  min-width: 0;
`

export const PlanRowName = styled.p`
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
`

export const PlanRowSide = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const PlanAssignmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-top: 1px solid var(--border);
`

export const PlanAssignmentIndex = styled.span`
  flex-shrink: 0;
  width: 18px;
  text-align: right;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`

export const PlanAssignmentName = styled.p<{ $completed: boolean }>`
  flex: 1;
  margin: 0;
  font-size: 13px;
  text-decoration: ${(props) => (props.$completed ? 'line-through' : 'none')};
  color: ${(props) => (props.$completed ? 'var(--text-muted)' : 'var(--text-h)')};
`

export const PlanAssignmentSteps = styled.span`
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`
