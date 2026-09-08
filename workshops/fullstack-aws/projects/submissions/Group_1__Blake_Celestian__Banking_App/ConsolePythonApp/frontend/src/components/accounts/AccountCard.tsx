import { Ban, CheckCircle2, ChevronRight } from 'lucide-react'
import type { Account } from '../../types/banking'
import { formatMoney } from '../../data/mockData'

type Props = { account: Account; admin?: boolean; ownerName?: string; onSelect: (account: Account) => void; onToggleStatus?: (accountNumber: string) => void }

export function AccountCard({ account, admin = false, ownerName, onSelect, onToggleStatus }: Props) {
  return <article className={`account-card ${!account.isActive ? 'account-closed' : ''}`}>
    <button className="account-card-main" type="button" onClick={() => onSelect(account)}>
      <div className="card-topline"><span className="account-type"><span className="status-dot" /> {account.accountType}</span><ChevronRight size={19} /></div>
      {admin && <span className="account-owner">{ownerName ?? 'Unknown owner'}</span>}
      <strong className="balance">{formatMoney(account.balance)}</strong><span className="balance-label">Available balance</span>
      <span className="account-number">•••• {account.accountNumber.slice(-4)}</span>
      <span className={`status-label ${account.isActive ? 'status-active' : 'status-inactive'}`}>{account.isActive ? 'Active' : 'Closed'}</span>
    </button>
    {admin && onToggleStatus && <button className="edit-status" type="button" onClick={() => onToggleStatus(account.accountNumber)}>{account.isActive ? <><Ban size={16} /> Close account</> : <><CheckCircle2 size={16} /> Reopen account</>}</button>}
  </article>
}
