import { useEffect, useState } from 'react'
import { getAccountsForUser } from './tellerApi'

// Displays the accounts belonging to whichever customer the teller has
// selected. Plain elements for now, same as TellerCustomerList — swap for
// the shared Table component later without touching the fetch logic.
//
// Render with key={customer.id} from the caller so switching customers
// remounts this component and resets loading/error state naturally,
// instead of resetting it manually inside the effect.

function TellerAccountList({ customer, onSelectAccount }) {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getAccountsForUser(customer.id)
      .then((results) => {
        if (cancelled) return
        setAccounts(results)
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
  }, [customer.id])

  if (loading) return <p>Loading accounts...</p>
  if (error) return <p role="alert">{error}</p>

  return (
    <div>
      <h3>Accounts for {customer.first_name} {customer.last_name}</h3>

      {accounts.length === 0 ? (
        <p>No accounts found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.id}</td>
                <td>{account.account_type}</td>
                <td>${account.balance.toFixed(2)}</td>
                <td>{account.status}</td>
                <td>
                  {onSelectAccount && (
                    <button type="button" onClick={() => onSelectAccount(account)}>
                      Select
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TellerAccountList
