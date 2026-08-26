import { useEffect, useState } from 'react'
import { getTransactions } from './tellerApi'

// Shows transaction history for a single account. Render with
// key={account.id} from the caller so switching accounts remounts this
// component and resets loading/error state, same pattern as TellerAccountList.

function TellerTransactionHistory({ account }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getTransactions(account.id)
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
  }, [account.id])

  if (loading) return <p>Loading transactions...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <div>
      <h4>Transaction History — Account #{account.id}</h4>

      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {[...transactions]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.timestamp).toLocaleString()}</td>
                  <td>{transaction.transaction_type}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{transaction.description || '—'}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TellerTransactionHistory
