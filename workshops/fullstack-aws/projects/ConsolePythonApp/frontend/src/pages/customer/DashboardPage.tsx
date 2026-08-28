import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { AccountCard } from '../../components/accounts/AccountCard'
import { AccountDetailsModal } from '../../components/accounts/AccountDetailsModal'
import { TransactionList } from '../../components/transactions/TransactionList'

import {
  initialAccounts,
  initialTransactions,
} from '../../data/mockData'

import type { Account } from '../../types/banking'
import { createAccount, fetchAccounts, fetchTransactions, fetchUser, getSessionUserId, fetchSpending } from '../../api/bankingApi'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface SpendingTransaction {
  id: string;
  merchant: string;
  date: string;
  category: string;
  accountNumber: string;
  amount: number;
}

export function DashboardPage() {
  const navigate = useNavigate()
  const sessionUserId = getSessionUserId()

  const [accounts, setAccounts] = useState<Account[]>(
    sessionUserId ? [] : initialAccounts
  )

  const [transactions, setTransactions] = useState(
    sessionUserId ? [] : initialTransactions
  )

  const [displayName, setDisplayName] = useState('')

  const [error, setError] = useState('')

  const [selectedAccount, setSelectedAccount] =
    useState<Account | null>(null)

  const [openAccountType, setOpenAccountType] =
    useState<'Checking' | 'Savings' | null>(null)

  const [openingDeposit, setOpeningDeposit] =
    useState('0')


  const [spending, setSpending] = useState<SpendingTransaction[]>([])
  useEffect(() => {
    if (!sessionUserId) return
    Promise.all([fetchAccounts(sessionUserId), fetchTransactions(sessionUserId), fetchUser(sessionUserId), fetchSpending(sessionUserId)])
      .then(([loadedAccounts, loadedTransactions, user, loadedSpending]) => { setAccounts(loadedAccounts); setTransactions(loadedTransactions); setDisplayName(`${user.firstName} ${user.lastName}`); setSpending(
    loadedSpending.map((transaction) => ({
      ...transaction,
      amount: Math.abs(Number(transaction.amount)),
    }))
  ) })
      .catch(() => setError('We could not load your live account data. Please try again.'))
  }, [sessionUserId])
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const spendingByCategory = spending.reduce((acc: Record<string, number>, transaction: any) => {
  const category = transaction.category || 'Other'
  const amount = Math.abs(Number(transaction.amount))

  acc[category] = (acc[category] || 0) + amount

  return acc
  }, {})

  const spendingChartData = Object.entries(spendingByCategory).map(([category, amount]) => ({
    name: category,
    value: amount,
  }))

  const openAccount = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (!sessionUserId || !openAccountType) return; if (Number(openingDeposit) < 0 || openingDeposit === '') { setError('Enter zero or a positive opening deposit.'); return } try { const account = await createAccount(sessionUserId, openAccountType, openingDeposit); setAccounts((items) => [...items, account]); setOpenAccountType(null); setOpeningDeposit('0') } catch { setError('The account could not be opened right now.') } }
  return <main className="page-content"><section className="welcome-row"><div><p className="eyebrow">PERSONAL BANKING</p><h1>{greeting}, {displayName.split(' ')[0]}</h1><p className="subtitle">Here is your financial snapshot.</p></div><div className="profile-chip"><span>JS</span><div><strong>{displayName}</strong><small>Customer</small></div></div></section>
    {error && <p className="error-message">{error}</p>}
    <section className="account-section"><div className="section-heading"><div><p className="eyebrow">YOUR ACCOUNTS</p><h2>Accounts</h2></div><span className="account-count">{accounts.length} accounts</span></div><div className="account-grid">
      {accounts.map((account) => <AccountCard key={account.accountNumber} account={account} onSelect={setSelectedAccount} />)}
      <article className="open-account-card"><h3>Grow your banking setup</h3><p>Open an account that fits the way you save and spend.</p><div className="open-account-actions"><button type="button" onClick={() => setOpenAccountType('Checking')}><Plus size={16} /> Checking</button><button type="button" onClick={() => setOpenAccountType('Savings')}><Plus size={16} /> Savings</button></div></article>
    </div></section>
    {/* Pi Chart */}
    {spendingChartData.length > 0 && (
  <section className="spending-section">
    <div className="section-heading">
      <div>
        <p className="eyebrow">SPENDING</p>
        <h2>Spending by category this month</h2>
      </div>
    </div>

    <div style={{ width: '100%', height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
  data={spendingChartData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={110}
  label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
>
  {spendingChartData.map((_, index) => (
    <Cell
      key={`cell-${index}`}
      fill={[
        '#2563eb',
        '#16a34a',
        '#f59e0b',
        '#dc2626',
        '#9333ea',
        '#0891b2',
      ][index % 6]}
    />
  ))}
</Pie>

          <Tooltip
            formatter={(value) => [
              `$${Number(value).toFixed(2)}`,
              'Spent',
            ]}
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </section>
)}
    <section className="activity-preview"><div className="section-heading"><div><p className="eyebrow">LATEST ACTIVITY</p><h2>Recent transactions</h2></div><a href={`/account/${accounts[0]?.accountNumber ?? '8472'}`}>View all</a></div><TransactionList transactions={transactions.slice(0, 3)} /></section>
    {selectedAccount && <AccountDetailsModal account={selectedAccount} transactions={transactions} onClose={() => setSelectedAccount(null)} onWithdraw={(account) => navigate(`/account/${account.accountNumber}?withdraw=true`)} />}
    {openAccountType && <div className="modal-backdrop" role="presentation" onClick={() => setOpenAccountType(null)}><section className="account-modal open-account-modal" role="dialog" aria-modal="true" aria-labelledby="open-account-title" onClick={(event) => event.stopPropagation()}><div className="modal-header"><div><p className="eyebrow">NEW ACCOUNT</p><h2 id="open-account-title">Open {openAccountType.toLowerCase()}</h2></div><button className="icon-button" type="button" aria-label="Close account opening form" onClick={() => setOpenAccountType(null)}><X size={21} /></button></div><form className="form-panel account-opening-form" onSubmit={openAccount}><label htmlFor="opening-deposit">Opening deposit <span>(optional)</span></label><div className="money-input"><span>$</span><input id="opening-deposit" type="number" min="0" step="0.01" value={openingDeposit} onChange={(event) => setOpeningDeposit(event.target.value)} /></div><p className="form-hint">You can also add funds later from Deposit.</p><button className="primary-button" type="submit">Open {openAccountType.toLowerCase()} account</button></form></section></div>}
  </main>
}
