import styled from 'styled-components'

export const SearchBoxWrapper = styled.div`
  position: relative;
  flex: 1;
`

export const SearchIcon = styled.svg`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  pointer-events: none;
  color: var(--text-muted);
`

export const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 36px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-h);
  font: inherit;
  font-size: 14px;

  &:focus-visible {
    outline: 3px solid var(--accent-border);
    outline-offset: 1px;
    border-color: var(--accent);
  }
`

export const ClearButton = styled.button`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  padding: 4px;
  cursor: pointer;
  color: var(--text-muted);
  display: flex;

  &:hover {
    color: var(--text-h);
  }
  &:focus-visible {
    outline: 3px solid var(--accent-border);
    outline-offset: 2px;
    border-radius: 4px;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`
