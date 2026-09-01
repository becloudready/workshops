import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { initialAccounts, formatMoney } from '../../data/mockData'
import { deposit, fetchAccounts, getSessionUserId } from '../../api/bankingApi'
import type { Account } from '../../types/banking'

export function DepositPage() {
  const sessionUserId = getSessionUserId()
  const [accounts, setAccounts] = useState<Account[]>(sessionUserId ? [] : initialAccounts)
  const [accountNumber, setAccountNumber] = useState(sessionUserId ? '' : initialAccounts[0]?.accountNumber ?? '')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(Boolean(sessionUserId))

  useEffect(() => {
    if (!sessionUserId) return
    fetchAccounts(sessionUserId).then((loadedAccounts) => { setAccounts(loadedAccounts); setAccountNumber(loadedAccounts[0]?.accountNumber ?? '') }).catch(() => setMessage('We could not load your accounts.')).finally(() => setLoading(false))
  }, [sessionUserId])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!accountNumber) { setMessage('Choose an account for this deposit.'); return }
    if (!amount || Number(amount) <= 0) { setMessage('Enter a valid deposit amount.'); return }
    if (!sessionUserId) { setMessage(`${formatMoney(Number(amount))} deposit is ready for API connection.`); setAmount(''); return }
    try { const updatedAccount = await deposit(sessionUserId, accountNumber, amount, description); setAccounts((items) => items.map((account) => account.accountNumber === updatedAccount.accountNumber ? updatedAccount : account)); setMessage(`${formatMoney(Number(amount))} deposit submitted.`); setAmount(''); setDescription('') }
    catch { setMessage('The deposit could not be completed.') }
  }

  return <main className="page-content narrow-page"><p className="eyebrow">MOVE MONEY</p><h1>Deposit funds</h1><p className="subtitle">Add money to one of your Northstar accounts.</p><section className="form-panel large-form"><form onSubmit={submit}><label htmlFor="deposit-account">Deposit to</label><select id="deposit-account" value={accountNumber} onChange={(event) => setAccountNumber(event.target.value)} disabled={loading || accounts.length === 0}>{accounts.map((account) => <option key={account.accountNumber} value={account.accountNumber}>{account.accountType} · •••• {account.accountNumber.slice(-4)}</option>)}</select>{accounts.length === 0 && !loading && <p className="form-hint">No accounts are available yet. Open one from your dashboard first.</p>}<label htmlFor="deposit-amount">Amount</label><div className="money-input"><span>$</span><input id="deposit-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></div><label htmlFor="deposit-description">Description <span>(optional)</span></label><input id="deposit-description" type="text" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this deposit for?" /><button className="primary-button" type="submit" disabled={loading || accounts.length === 0}>Submit deposit</button>{message && <p className="form-message">{message}</p>}</form></section></main>
}
