import { useState } from 'react'
import { listCustomers, getCustomerForAccount } from './tellerApi'
import TellerCustomerList from './TellerCustomerList'

// Search box + results list. onSelectCustomer is passed straight through
// to TellerCustomerList so a parent (the teller dashboard page) can react
// when a teller picks a customer to work with.

function TellerCustomerSearch({ onSelectCustomer }) {
  const [query, setQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch(event) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    const trimmed = query.trim()
    const isAccountNumber = trimmed !== '' && /^\d+$/.test(trimmed)

    try {
      if (isAccountNumber) {
        const customer = await getCustomerForAccount(Number(trimmed))
        setCustomers([customer])
      } else {
        const results = await listCustomers(query)
        setCustomers(results)
      }
      setSearched(true)
    } catch (err) {
      setCustomers([])
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email, or account #"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p role="alert">{error}</p>}

      {searched && !loading && !error && (
        <TellerCustomerList customers={customers} onSelectCustomer={onSelectCustomer} />
      )}
    </div>
  )
}

export default TellerCustomerSearch
