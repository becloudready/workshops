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
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-2 px-3 font-medium">Account ID</th>
              <th className="py-2 px-3 font-medium">Type</th>
              <th className="py-2 px-3 font-medium">Balance</th>
              <th className="py-2 px-3 font-medium">Status</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3">{account.id}</td>
                <td className="py-2 px-3">{account.account_type}</td>
                <td className="py-2 px-3">${account.balance.toFixed(2)}</td>
                <td className="py-2 px-3">{account.status}</td>
                <td className="py-2 px-3">
                  {onSelectAccount && (
                    <Button type="button" onClick={() => onSelectAccount(account)}>
                      Select
                    </Button>
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
