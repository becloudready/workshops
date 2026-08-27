import { useState } from 'react'
import { createAccount } from './tellerApi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'

// Opens a new account for the currently selected customer. New accounts
// always start active — freezing/closing is an admin action, not part of
// teller account creation.

function TellerCreateAccountForm({ customer, onSuccess }) {
  const { token } = useAuth()
  const [accountType, setAccountType] = useState('checking')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitting(true)
    setError(null)

    try {
      const account = await createAccount({
        userId: customer.id,
        accountType,
        status: 'active',
      }, token)
      onSuccess?.(account)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Create Account</h3>

      <div className="flex flex-col gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Account type</span>
          <select
            value={accountType}
            onChange={(event) => setAccountType(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </label>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Account'}
        </Button>
      </div>
    </form>
  )
}

export default TellerCreateAccountForm
