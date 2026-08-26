import { useState } from 'react'
import { updateCustomer } from './tellerApi'

// Edits a customer's contact info. Only first name, last name, and email
// are editable here — that matches the real backend's UserUpdate schema,
// which doesn't allow changing DOB or role.

function TellerEditCustomerForm({ customer, onSuccess }) {
  const [firstName, setFirstName] = useState(customer.first_name)
  const [lastName, setLastName] = useState(customer.last_name)
  const [email, setEmail] = useState(customer.email)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitting(true)
    setError(null)

    try {
      const updated = await updateCustomer(customer.id, {
        first_name: firstName,
        last_name: lastName,
        email,
      })
      onSuccess?.(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">Edit Customer Info</h3>

      <div className="flex flex-col gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">First name</span>
          <input
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Last name</span>
          <input
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none"
          />
        </label>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}

export default TellerEditCustomerForm
