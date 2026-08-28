import styled from 'styled-components'

export const CreatePanelWrap = styled.div`
  max-width: 36rem;
  margin: 0 auto;
`

export const FormStack = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const TabSwitch = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 24px;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--accent-bg);
`

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font: inherit;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: ${(props) => (props.$active ? 'var(--accent)' : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : 'var(--text)')};

  &:focus-visible {
    outline: 3px solid var(--accent-border);
    outline-offset: 2px;
  }
`

export const TabDescription = styled.p`
  margin: 0 0 20px;
  font-size: 14px;
  color: var(--text-muted);
`

export const ChecklistWrap = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  max-height: 260px;
  overflow-y: auto;
`

export const ChecklistItem = styled.label<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-top: 1px solid var(--border);
  background: ${(props) => (props.$checked ? 'var(--accent-bg)' : 'var(--bg)')};

  &:first-child {
    border-top: none;
  }

  input {
    flex-shrink: 0;
    accent-color: var(--accent);
  }
`

export const ChecklistItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const ChecklistItemTitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--text-h);
`

export const ChecklistItemSub = styled.p`
  margin: 2px 0 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`

export const ChecklistItemId = styled.span`
  flex-shrink: 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-muted);
`

export const SelectedCount = styled.p`
  margin: 8px 0 0;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--accent);
`
