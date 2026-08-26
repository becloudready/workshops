import { useState } from 'react'
import { deposit } from './tellerApi'

// Deposit form for a single account. Plain elements for now, same as the
// rest of the teller components — swap for shared Button/Input once
// they're built out.

function TellerDepositForm({ accountId, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError('Enter an amount greater than zero')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const transaction = await deposit(accountId, parsedAmount, description || null)
      setAmount('')
      setDescription('')
      onSuccess?.(transaction)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h4>Deposit</h4>

      <label>
        Amount
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />
      </label>

      <label>
        Description (optional)
        <input
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Depositing...' : 'Deposit'}
      </button>
    </form>
  )
}

export default TellerDepositForm
