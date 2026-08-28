import { useState } from 'react'
import { listCustomers, getCustomerForAccount } from './tellerApi'
import { useAuth } from '../../context/AuthContext'
import TellerCustomerList from './TellerCustomerList'
import Button from '../../components/Button'
import Input from '../../components/Input'

// Search box + results list. onSelectCustomer is passed straight through
// to TellerCustomerList so a parent (the teller dashboard page) can react
// when a teller picks a customer to work with.

function TellerCustomerSearch({ onSelectCustomer }) {
  const { token } = useAuth()
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
        const customer = await getCustomerForAccount(Number(trimmed), token)
        setCustomers([customer])
      } else {
        const results = await listCustomers(query, token)
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
      <form onSubmit={handleSearch} className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            id="customer-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, email, or account #"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

      {searched && !loading && !error && (
        <div className="mt-4">
          <TellerCustomerList customers={customers} onSelectCustomer={onSelectCustomer} />
        </div>
      )}
    </div>
  )
}

export default TellerCustomerSearch
