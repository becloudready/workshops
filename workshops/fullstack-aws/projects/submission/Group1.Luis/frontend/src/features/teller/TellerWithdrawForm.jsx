import { useState } from 'react'
import { withdraw } from './tellerApi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import Input from '../../components/Input'

// Withdrawal form for a single account. Mirrors TellerDepositForm.

function TellerWithdrawForm({ accountId, onSuccess }) {
  const { token } = useAuth()
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
      const transaction = await withdraw(accountId, parsedAmount, description || null, token)
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
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Withdraw</h3>

      <div className="flex flex-col gap-3">
        <Input
          id="withdraw-amount"
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <Input
          id="withdraw-description"
          label="Description (optional)"
          type="text"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Withdrawing...' : 'Withdraw'}
        </Button>
      </div>
    </form>
  )
}

export default TellerWithdrawForm
