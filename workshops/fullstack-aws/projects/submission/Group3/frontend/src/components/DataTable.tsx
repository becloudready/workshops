import type { ReactNode } from 'react'
import { TableWrap, Table, Th, Tbody, EmptyRowCell } from './DataTable.styled'

function DataTable({
  columns,
  isEmpty,
  emptyMessage,
  children,
}: {
  columns: string[]
  isEmpty: boolean
  emptyMessage: string
  children: ReactNode
}) {
  return (
    <TableWrap>
      <Table>
        <thead>
          <tr>
            {columns.map((column) => (
              <Th key={column}>{column}</Th>
            ))}
          </tr>
        </thead>
        <Tbody>
          {isEmpty ? (
            <tr>
              <EmptyRowCell colSpan={columns.length}>{emptyMessage}</EmptyRowCell>
            </tr>
          ) : (
            children
          )}
        </Tbody>
      </Table>
    </TableWrap>
  )
}

export default DataTable
