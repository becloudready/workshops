import { useState } from 'react'
import { withdraw } from './tellerApi'

// Withdrawal form for a single account. Mirrors TellerDepositForm — plain
// elements for now, swap for shared Button/Input once they're built out.

function TellerWithdrawForm({ accountId, onSuccess }) {
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
      const transaction = await withdraw(accountId, parsedAmount, description || null)
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
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Amount</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Description (optional)</span>
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </label>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Withdrawing...' : 'Withdraw'}
        </button>
      </div>
    </form>
  )
}

export default TellerWithdrawForm
