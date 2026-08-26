import { useState } from 'react'
import { createAccount } from './tellerApi'

// Opens a new account for the currently selected customer. New accounts
// always start active — freezing/closing is an admin action, not part of
// teller account creation.

function TellerCreateAccountForm({ customer, onSuccess }) {
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
      })
      onSuccess?.(account)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Create Account</h4>

      <label>
        Account type
        <select value={accountType} onChange={(event) => setAccountType(event.target.value)}>
          <option value="checking">Checking</option>
          <option value="savings">Savings</option>
        </select>
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Account'}
      </button>
    </form>
  )
}

export default TellerCreateAccountForm
