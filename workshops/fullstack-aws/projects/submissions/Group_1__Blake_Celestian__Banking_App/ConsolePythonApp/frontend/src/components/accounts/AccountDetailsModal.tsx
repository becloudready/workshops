import { CalendarDays, ChevronRight, X } from 'lucide-react'
import type { Account, Transaction } from '../../types/banking'
import { formatMoney } from '../../data/mockData'
import { TransactionList } from '../transactions/TransactionList'

type Props = { account: Account; transactions: Transaction[]; onClose: () => void; onWithdraw?: (account: Account) => void; onBalanceUpdated?: (accountNumber: string, balance: number) => void; admin?: boolean; ownerName?: string }

export function AccountDetailsModal({ account, transactions, onClose, onWithdraw, onBalanceUpdated, admin = false, ownerName }: Props) {
  const accountTransactions = transactions.filter((transaction) => transaction.accountNumber === account.accountNumber)
  return <div className="modal-backdrop" role="presentation" onClick={onClose}><section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-modal-title" onClick={(event) => event.stopPropagation()}>
    <div className="modal-header"><div><p className="eyebrow">{account.accountType.toUpperCase()} ACCOUNT</p><h2 id="account-modal-title">{account.accountNumber}</h2>{admin && <p className="modal-owner">{ownerName ?? 'Unknown owner'}</p>}</div><button className="icon-button" type="button" aria-label="Close account details" onClick={onClose}><X size={21} /></button></div>
    <div className="modal-balance"><span>Available balance</span><strong>{formatMoney(account.balance)}</strong></div>
    <div className="modal-meta"><span><CalendarDays size={16} /> Opened {account.createdDate}</span><span className={account.isActive ? 'status-active' : 'status-inactive'}>{account.isActive ? 'Currently active' : 'Currently closed'}</span></div>
    <div className="modal-section-heading"><h3>Recent transactions</h3><span>{accountTransactions.length} shown</span></div><TransactionList transactions={accountTransactions} onBalanceUpdated={onBalanceUpdated} wagersEnabled={!admin} categoriesEnabled={!admin} />
    {account.isActive && !admin && onWithdraw && <button className="full-width-button" type="button" onClick={() => onWithdraw(account)}>Withdraw from this account <ChevronRight size={17} /></button>}
  </section></div>
}
