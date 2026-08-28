import styled from 'styled-components'

export const DashboardWrap = styled.div`
  padding: 32px 24px 64px;
  box-sizing: border-box;
`

export const DashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  column-gap: 24px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

export const Sidebar = styled.aside`
  grid-column: 1;
  grid-row: 2;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 16px;
  border-radius: 12px;
  background: var(--accent);

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 2;
  }
`

export const SidebarEyebrow = styled.p`
  margin: 0 0 4px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
`

export const SidebarTitle = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`

export const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const SidebarNavButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  border-left: 3px solid ${(props) => (props.$active ? '#fff' : 'transparent')};
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: ${(props) => (props.$active ? 600 : 400)};
  text-align: left;
  cursor: pointer;
  background: ${(props) => (props.$active ? 'rgba(255, 255, 255, 0.15)' : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : 'rgba(255, 255, 255, 0.7)')};
  transition: background-color 0.15s;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:focus-visible {
    outline: 3px solid #fff;
    outline-offset: -3px;
  }

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }
`

export const SidebarFooter = styled.div`
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  gap: 10px;
`

export const Avatar = styled.div`
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--mono);
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(255, 255, 255, 0.2);
`

export const SidebarUserInfo = styled.div`
  min-width: 0;
`

export const SidebarUserName = styled.p`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const SidebarUserRole = styled.p`
  margin: 0;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const MainArea = styled.main`
  grid-column: 2;
  grid-row: 2;
  min-width: 0;

  @media (max-width: 768px) {
    grid-column: 1;
    grid-row: 3;
  }
`

export const MainHeader = styled.header`
  grid-column: 2;
  grid-row: 1;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-column: 1;
  }
`

export const MainTitle = styled.h1`
  margin: 0 0 4px;
  font-size: 28px;
  line-height: 1.2;
  color: var(--text-h);
`

export const MainSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--text-muted);
`
