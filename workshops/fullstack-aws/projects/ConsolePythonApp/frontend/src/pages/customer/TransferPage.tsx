import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { initialAccounts, formatMoney } from '../../data/mockData'
import { fetchAccounts, getSessionUserId, transfer } from '../../api/bankingApi'
import type { Account } from '../../types/banking'

export function TransferPage() {
  const sessionUserId = getSessionUserId()
  const [accounts, setAccounts] = useState<Account[]>(sessionUserId ? [] : initialAccounts)
  const [fromAccount, setFromAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!sessionUserId) return
    fetchAccounts(sessionUserId).then((loadedAccounts) => {
      setAccounts(loadedAccounts)
      setFromAccount(loadedAccounts[0]?.accountNumber ?? '')
    }).catch(() => setMessage('We could not load your accounts.'))
  }, [sessionUserId])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const recipient = String(form.get('transfer-to') ?? '')
    if (!amount || Number(amount) <= 0) { setMessage('Enter a valid transfer amount.'); return }
    if (!recipient) { setMessage('Enter a recipient account number.'); return }
    if (!sessionUserId) { setMessage(`${formatMoney(Number(amount))} transfer is ready for API connection.`); setAmount(''); return }
    try { await transfer(sessionUserId, fromAccount, recipient, amount); setMessage(`${formatMoney(Number(amount))} transfer submitted.`); setAmount('') }
    catch { setMessage('The transfer could not be completed.') }
  }

  return <main className="page-content narrow-page"><p className="eyebrow">MOVE MONEY</p><h1>Transfer funds</h1><p className="subtitle">Move money between accounts or to another Northstar customer.</p><section className="form-panel large-form"><form onSubmit={submit}><label htmlFor="transfer-from">From</label><select id="transfer-from" value={fromAccount} onChange={(event) => setFromAccount(event.target.value)}>{accounts.map((account) => <option key={account.accountNumber} value={account.accountNumber}>{account.accountType} · •••• {account.accountNumber}</option>)}</select><label htmlFor="transfer-to">Recipient account number</label><input id="transfer-to" name="transfer-to" inputMode="numeric" placeholder="8-digit account number" /><label htmlFor="transfer-amount">Amount</label><div className="money-input"><span>$</span><input id="transfer-amount" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" /></div><button className="primary-button" type="submit">Review transfer</button>{message && <p className="form-message">{message}</p>}</form></section></main>
}
