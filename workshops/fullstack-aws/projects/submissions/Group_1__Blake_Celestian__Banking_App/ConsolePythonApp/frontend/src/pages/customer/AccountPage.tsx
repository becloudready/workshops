import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { TransactionList } from '../../components/transactions/TransactionList'
import { formatMoney, initialAccounts, initialTransactions } from '../../data/mockData'
import { fetchAccount, fetchTransactions, getSessionUserId, withdraw } from '../../api/bankingApi'
import type { Account, Transaction } from '../../types/banking'

export function AccountPage() {
  const { accountNumber = '' } = useParams()
  const [searchParams] = useSearchParams()
  const sessionUserId = getSessionUserId()
  const fallbackAccount = initialAccounts.find((item) => item.accountNumber === accountNumber) ?? initialAccounts[0]
  const [account, setAccount] = useState<Account | null>(sessionUserId ? null : fallbackAccount)
  const [transactions, setTransactions] = useState<Transaction[]>(sessionUserId ? [] : initialTransactions.filter((item) => item.accountNumber === fallbackAccount.accountNumber))
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState(searchParams.get('withdraw') ? 'Enter an amount to withdraw.' : '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!sessionUserId || !accountNumber) return
    Promise.all([fetchAccount(accountNumber), fetchTransactions(sessionUserId)]).then(([loadedAccount, loadedTransactions]) => {
      setAccount(loadedAccount)
      setTransactions(loadedTransactions.filter((item) => item.accountNumber === accountNumber))
    }).catch(() => setError('We could not load this account from the API.'))
  }, [accountNumber, sessionUserId])

  const submitWithdrawal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!amount || Number(amount) <= 0) { setMessage('Enter a valid withdrawal amount.'); return }
    if (!account || !sessionUserId) { setMessage(`${formatMoney(Number(amount))} withdrawal is ready for API connection.`); setAmount(''); return }
    try { const updatedAccount = await withdraw(sessionUserId, account.accountNumber, amount); setAccount(updatedAccount); setTransactions(await fetchTransactions(sessionUserId).then((items) => items.filter((item) => item.accountNumber === account.accountNumber))); setMessage(`${formatMoney(Number(amount))} withdrawal submitted.`); setAmount('') }
    catch { setMessage('The withdrawal could not be completed.') }
  }

  const updateAccountBalance = (accountNumber: string, balance: number) => {
    if (accountNumber === account?.accountNumber) setAccount((current) => current ? { ...current, balance } : current)
  }

  const handleWagerCreated = (transactionId: string, result: 'win' | 'loss') => {
    setTransactions((current) => current.map((t) => t.id === transactionId ? { ...t, wagerResult: result } : t))
  }

  if (!account) return <main className="page-content"><p className="error-message">{error || 'Loading account details...'}</p></main>
  return <main className="page-content account-page"><Link className="back-link" to="/dashboard"><ArrowLeft size={17} /> Back to dashboard</Link>{error && <p className="error-message">{error}</p>}<section className="account-detail-hero"><div><p className="eyebrow">{account.accountType.toUpperCase()} ACCOUNT</p><h1>•••• {account.accountNumber.slice(-4)}</h1><span className={`status-label ${account.isActive ? 'status-active' : 'status-inactive'}`}>{account.isActive ? 'Active account' : 'Closed account'}</span></div><div className="detail-balance"><span>Available balance</span><strong>{formatMoney(account.balance)}</strong></div></section><div className="account-info-strip"><span><CalendarDays size={16} /> Opened {account.createdDate}</span><span>Account ending in {account.accountNumber.slice(-4)}</span></div><section className="detail-section"><div className="section-heading"><div><p className="eyebrow">ACCOUNT ACTIVITY</p><h2>Transaction history</h2></div><span>{transactions.length} transactions</span></div><TransactionList transactions={transactions} onBalanceUpdated={updateAccountBalance} onWagerCreated={handleWagerCreated} /></section>{account.isActive && <section className="form-panel"><p className="eyebrow">WITHDRAW FUNDS</p><h2>Move money out of this account</h2><form onSubmit={submitWithdrawal}><label htmlFor="withdraw-amount">Amount</label><div className="money-input"><span>$</span><input id="withdraw-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></div><button className="primary-button" type="submit">Withdraw funds</button>{message && <p className="form-message">{message}</p>}</form></section>}</main>
}
