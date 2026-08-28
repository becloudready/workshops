import { useEffect, useState } from 'react'
import { getAccountsForUser } from './tellerApi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

// Displays the accounts belonging to whichever customer the teller has
// selected. Plain elements for now, same as TellerCustomerList — swap for
// the shared Table component later without touching the fetch logic.
//
// Render with key={customer.id} from the caller so switching customers
// remounts this component and resets loading/error state naturally,
// instead of resetting it manually inside the effect.

function TellerAccountList({ customer, onSelectAccount }) {
  const { token } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    getAccountsForUser(customer.id, token)
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
  }, [customer.id, token])

  if (loading) return <p className="text-sm text-slate-500">Loading accounts...</p>
  if (error) return <p role="alert" className="text-sm text-red-600">{error}</p>

  return (
    <div>
      {accounts.length === 0 ? (
        <p className="text-sm text-slate-500">No accounts found.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {accounts.map((account) => (
            <li key={account.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium capitalize text-slate-900">{account.account_type} Account</p>
                <p className="text-xs text-slate-500">
                  Account #{account.id} · {account.status}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-semibold text-slate-900">${account.balance.toFixed(2)}</p>
                {onSelectAccount && (
                  <Button type="button" onClick={() => onSelectAccount(account)}>
                    Select
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TellerAccountList
