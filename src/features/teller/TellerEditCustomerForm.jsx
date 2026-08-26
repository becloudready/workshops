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
    <form onSubmit={handleSubmit}>
      <h4>Edit Customer Info</h4>

      <label>
        First name
        <input
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
      </label>

      <label>
        Last name
        <input
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}

export default TellerEditCustomerForm
