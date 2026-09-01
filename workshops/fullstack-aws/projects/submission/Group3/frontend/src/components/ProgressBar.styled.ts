import styled from 'styled-components'

export const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ProgressTrack = styled.div<{ $mini?: boolean }>`
  flex: 1;
  height: ${(props) => (props.$mini ? '4px' : '6px')};
  border-radius: 999px;
  overflow: hidden;
  background: var(--border);
`

export const ProgressFill = styled.div<{ $value: number; $completed: boolean }>`
  height: 100%;
  border-radius: 999px;
  width: ${(props) => props.$value}%;
  background: ${(props) => (props.$completed ? 'var(--success)' : 'var(--accent)')};
  transition: width 0.5s ease;
`

export const ProgressLabel = styled.span<{ $mini?: boolean }>`
  flex-shrink: 0;
  width: ${(props) => (props.$mini ? '28px' : '34px')};
  font-family: var(--mono);
  font-size: ${(props) => (props.$mini ? '10px' : '12px')};
  text-align: right;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
`

export const StatusBadgeWrapper = styled.span<{ $completed: boolean; $small?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 4px;
  padding: ${(props) => (props.$small ? '2px 8px' : '4px 8px')};
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 500;
  background: ${(props) => (props.$completed ? 'var(--success-bg)' : 'var(--pending-bg)')};
  color: ${(props) => (props.$completed ? 'var(--success)' : 'var(--pending)')};
`

export const StatusDot = styled.span<{ $completed: boolean; $small?: boolean }>`
  width: ${(props) => (props.$small ? '6px' : '8px')};
  height: ${(props) => (props.$small ? '6px' : '8px')};
  border-radius: 50%;
  flex-shrink: 0;
  background: ${(props) => (props.$completed ? 'var(--success)' : 'var(--pending)')};
`
