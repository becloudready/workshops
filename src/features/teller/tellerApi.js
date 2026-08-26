// Real data layer for teller features, calling the FastAPI backend directly.
// Function signatures match what the components already expect, so nothing
// outside this file needed to change when this stopped being a mock.

const API_BASE = 'http://localhost:8000'

// Stand-in for real auth until Person 2's JWT work lands. The backend's
// get_current_user() currently reads this header directly (see
// core/dependencies.py) instead of decoding a token. This is Olivia
// Turner, a seeded teller user — swap this for a real Authorization
// header once login exists.
const TELLER_USER_ID = 'b2e5703a-fedf-571b-9cf0-3707310d568d'

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': TELLER_USER_ID,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.detail || `Request failed: ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

export async function listCustomers(query = '') {
  const customers = await request('/users?role=customer&limit=100')

  const q = query.trim().toLowerCase()
  if (!q) return customers

  return customers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(q)
  )
}

export async function getAccountsForUser(userId) {
  const accounts = await request('/accounts')
  return accounts.filter((a) => a.user_id === userId)
}

export function getAccount(accountId) {
  return request(`/accounts/${accountId}`)
}

export async function getCustomerForAccount(accountId) {
  const account = await getAccount(accountId)
  return request(`/users/${account.user_id}`)
}

export async function getTransactions(accountId) {
  const transactions = await request(`/accounts/${accountId}/transactions`)
  // amount comes back as a string ("10.00") from this endpoint, unlike
  // account balances which come back as numbers — normalize here so
  // components can keep calling .toFixed() on it either way.
  return transactions.map((t) => ({ ...t, amount: Number(t.amount) }))
}

export async function deposit(accountId, amount, description = null) {
  const transaction = await request(`/accounts/${accountId}/deposit`, {
    method: 'POST',
    body: JSON.stringify({ amount, description }),
  })
  return { ...transaction, amount: Number(transaction.amount) }
}

export async function withdraw(accountId, amount, description = null) {
  const transaction = await request(`/accounts/${accountId}/withdraw`, {
    method: 'POST',
    body: JSON.stringify({ amount, description }),
  })
  return { ...transaction, amount: Number(transaction.amount) }
}

export function createAccount({ userId, accountType, status = 'active' }) {
  return request('/accounts', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      account_type: accountType,
      status,
    }),
  })
}

export function updateCustomer(userId, updates) {
  return request(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}
