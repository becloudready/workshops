import { useEffect, useState } from 'react'
import { getTransactions } from './tellerApi'
import { useAuth } from '../../context/AuthContext'

// Shows transaction history for a single account. Render with
// key={account.id} from the caller so switching accounts remounts this
// component and resets loading/error state, same pattern as TellerAccountList.

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
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 px-3 font-medium">Date</th>
              <th className="py-2 px-3 font-medium">Type</th>
              <th className="py-2 px-3 font-medium">Amount</th>
              <th className="py-2 px-3 font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {[...transactions]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((transaction) => (
                <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3">{new Date(transaction.timestamp).toLocaleString()}</td>
                  <td className="py-2 px-3">{transaction.transaction_type}</td>
                  <td className="py-2 px-3">${transaction.amount.toFixed(2)}</td>
                  <td className="py-2 px-3">{transaction.description || '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TellerTransactionHistory
