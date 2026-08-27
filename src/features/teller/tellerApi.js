// Teller-specific data layer, calling the FastAPI backend directly.
// Fetch/auth/error-handling plumbing lives in the shared request() from
// ../../api/api — this file only knows about teller endpoints and shapes.
// Every function takes the caller's JWT (from useAuth()) as its last
// argument and forwards it to request().

import { request } from '../../api/api'

export async function listCustomers(query = '', token) {
  const customers = await request('/users?role=customer&limit=100', { token })

  const q = query.trim().toLowerCase()
  if (!q) return customers

  return customers.filter((c) =>
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(q)
  )
}

export async function getAccountsForUser(userId, token) {
  const accounts = await request('/accounts', { token })
  return accounts.filter((a) => a.user_id === userId)
}

export function getAccount(accountId, token) {
  return request(`/accounts/${accountId}`, { token })
}

export async function getCustomerForAccount(accountId, token) {
  const account = await getAccount(accountId, token)
  return request(`/users/${account.user_id}`, { token })
}

export async function getTransactions(accountId, token) {
  const transactions = await request(`/accounts/${accountId}/transactions`, { token })
  // amount comes back as a string ("10.00") from this endpoint, unlike
  // account balances which come back as numbers — normalize here so
  // components can keep calling .toFixed() on it either way.
  return transactions.map((t) => ({ ...t, amount: Number(t.amount) }))
}

export async function deposit(accountId, amount, description = null, token) {
  const transaction = await request(`/accounts/${accountId}/deposit`, {
    method: 'POST',
    body: { amount, description },
    token,
  })
  return { ...transaction, amount: Number(transaction.amount) }
}

export async function withdraw(accountId, amount, description = null, token) {
  const transaction = await request(`/accounts/${accountId}/withdraw`, {
    method: 'POST',
    body: { amount, description },
    token,
  })
  return { ...transaction, amount: Number(transaction.amount) }
}

export function createAccount({ userId, accountType, status = 'active' }, token) {
  return request('/accounts', {
    method: 'POST',
    body: {
      user_id: userId,
      account_type: accountType,
      status,
    },
    token,
  })
}

export function updateCustomer(userId, updates, token) {
  return request(`/users/${userId}`, {
    method: 'PATCH',
    body: updates,
    token,
  })
}
