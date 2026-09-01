import { ArrowLeftRight } from 'lucide-react'
import type { Transaction } from '../../types/banking'
import { formatMoney } from '../../data/mockData'

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return <div className="transaction-list">{transactions.map((transaction) => <div className="transaction-row" key={transaction.id}>
    <div className="transaction-icon"><ArrowLeftRight size={17} /></div>
    <div className="transaction-copy"><strong>{transaction.merchant}</strong><span>{transaction.category} · {transaction.date}</span></div>
    <strong className={transaction.amount > 0 ? 'credit' : ''}>{formatMoney(transaction.amount)}</strong>
  </div>)}</div>
}
