import styled from 'styled-components'

export const FilterGroup = styled.div`
  display: flex;
  flex-shrink: 0;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
`

export const FilterButton = styled.button<{ $active: boolean }>`
  padding: 10px 14px;
  border: none;
  border-right: 1px solid var(--border);
  font: inherit;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  background: ${(props) => (props.$active ? 'var(--accent)' : 'var(--bg)')};
  color: ${(props) => (props.$active ? '#fff' : 'var(--text)')};

  &:last-child {
    border-right: none;
  }

  &:focus-visible {
    outline: 3px solid var(--accent-border);
    outline-offset: -3px;
  }
`
