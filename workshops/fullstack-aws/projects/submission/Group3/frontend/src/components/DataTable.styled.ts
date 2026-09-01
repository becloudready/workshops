import styled from 'styled-components'

export const TableWrap = styled.div`
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`

export const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  background: var(--accent-bg);
  font-family: var(--mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
`

export const Tbody = styled.tbody`
  background: var(--bg);
`

export const EmptyRowCell = styled.td`
  padding: 40px 16px;
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
`
