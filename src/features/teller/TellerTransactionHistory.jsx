import { useEffect, useState } from 'react'
import { getTransactions } from './tellerApi'
import { useAuth } from '../../context/AuthContext'

// Shows transaction history for a single account. Render with
// key={account.id} from the caller so switching accounts remounts this
// component and resets loading/error state, same pattern as TellerAccountList.

// Transaction types that increase the account balance — shown in green
// with a "+" prefix. Everything else (withdrawal, an outgoing transfer)
// is shown in red with a "-" prefix.
const CREDIT_TYPES = new Set(['deposit', 'receive'])

function TellerTransactionHistory({ account }) {
  const { token } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getTransactions(account.id, token)
      .then((results) => {
        if (cancelled) return
        setTransactions(results)
        setLoading(false)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err.message)
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [account.id, token])

  if (loading) return <p className="text-sm text-slate-500">Loading transactions...</p>
  if (error) return <p role="alert" className="text-sm text-red-600">{error}</p>

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Transaction History</h3>

      {transactions.length === 0 ? (
        <p className="text-sm text-slate-500">No transactions found.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {[...transactions]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((transaction) => {
              const isCredit = CREDIT_TYPES.has(transaction.transaction_type)

              return (
                <li key={transaction.id} className="flex items-center justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium capitalize text-slate-900">
                      {transaction.description || transaction.transaction_type}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className={`font-semibold ${isCredit ? 'text-emerald-600' : 'text-red-600'}`}>
                    {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </li>
              )
            })}
        </ul>
      )}
    </div>
  )
}

export default TellerTransactionHistory
