import { useState } from 'react'
import { updateCustomer } from './tellerApi'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/Button'
import Input from '../../components/Input'

// Edits a customer's contact info. Only first name, last name, and email
// are editable here — that matches the real backend's UserUpdate schema,
// which doesn't allow changing DOB or role.

function TellerEditCustomerForm({ customer, onSuccess }) {
  const { token } = useAuth()
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
      }, token)
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
        <Input
          id="edit-first-name"
          label="First name"
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />

        <Input
          id="edit-last-name"
          label="Last name"
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />

        <Input
          id="edit-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}

export default TellerEditCustomerForm
