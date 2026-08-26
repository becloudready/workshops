// Mock data layer for teller features. Function signatures mirror the real
// backend endpoints so this can be swapped for real fetch calls later
// without changing anything that calls into it.

let customers = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    role: 'customer',
    first_name: 'Alice',
    last_name: 'Johnson',
    email: 'alice.johnson@example.com',
    dob: '1990-04-12',
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    role: 'customer',
    first_name: 'Brian',
    last_name: 'Smith',
    email: 'brian.smith@example.com',
    dob: '1985-11-02',
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    role: 'customer',
    first_name: 'Carla',
    last_name: 'Nguyen',
    email: 'carla.nguyen@example.com',
    dob: '1998-07-23',
  },
]

let accounts = [
  { id: 1, user_id: 'c1111111-1111-1111-1111-111111111111', account_type: 'checking', balance: 1250.5, status: 'active' },
  { id: 2, user_id: 'c1111111-1111-1111-1111-111111111111', account_type: 'savings', balance: 5000, status: 'active' },
  { id: 3, user_id: 'c2222222-2222-2222-2222-222222222222', account_type: 'checking', balance: 320.75, status: 'frozen' },
  { id: 4, user_id: 'c3333333-3333-3333-3333-333333333333', account_type: 'savings', balance: 0, status: 'active' },
]

let transactions = [
  { id: 1, account_id: 1, transaction_type: 'deposit', amount: 500, timestamp: '2026-08-01T10:15:00Z', description: 'Paycheck' },
  { id: 2, account_id: 1, transaction_type: 'withdrawal', amount: 60, timestamp: '2026-08-10T14:30:00Z', description: 'ATM' },
  { id: 3, account_id: 2, transaction_type: 'deposit', amount: 5000, timestamp: '2026-07-15T09:00:00Z', description: 'Initial deposit' },
]

let nextAccountId = 5
let nextTransactionId = 4

function delay(value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), 300))
}

export function listCustomers(query = '') {
  const q = query.trim().toLowerCase()
  const results = q
    ? customers.filter((c) =>
        `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(q)
      )
    : customers

  return delay(results)
}

export function getAccountsForUser(userId) {
  return delay(accounts.filter((a) => a.user_id === userId))
}

export function getAccount(accountId) {
  const account = accounts.find((a) => a.id === accountId)
  if (!account) return Promise.reject(new Error('Account not found'))
  return delay(account)
}

export function updateCustomer(userId, updates) {
  const customer = customers.find((c) => c.id === userId)
  if (!customer) return Promise.reject(new Error('User not found'))

  if (updates.email) {
    const email = updates.email.toLowerCase()
    const existing = customers.find((c) => c.email === email && c.id !== userId)
    if (existing) {
      return Promise.reject(new Error(`Email already registered: ${email}`))
    }
    updates = { ...updates, email }
  }

  Object.assign(customer, updates)

  return delay(customer)
}

export function getCustomerForAccount(accountId) {
  const account = accounts.find((a) => a.id === accountId)
  if (!account) return Promise.reject(new Error('Account not found'))

  const customer = customers.find((c) => c.id === account.user_id)
  if (!customer) return Promise.reject(new Error('Customer not found for this account'))

  return delay(customer)
}

export function getTransactions(accountId) {
  return delay(transactions.filter((t) => t.account_id === accountId))
}

export function deposit(accountId, amount, description = null) {
  if (amount <= 0) {
    return Promise.reject(new Error('Deposit amount must be greater than zero'))
  }

  const account = accounts.find((a) => a.id === accountId)
  if (!account) return Promise.reject(new Error('Account not found'))
  if (account.status !== 'active') {
    return Promise.reject(new Error(`Account is ${account.status} and cannot accept deposits`))
  }

  account.balance += amount

  const transaction = {
    id: nextTransactionId++,
    account_id: accountId,
    transaction_type: 'deposit',
    amount,
    timestamp: new Date().toISOString(),
    description,
  }
  transactions.push(transaction)

  return delay(transaction)
}

export function withdraw(accountId, amount, description = null) {
  if (amount <= 0) {
    return Promise.reject(new Error('Withdrawal amount must be greater than zero'))
  }

  const account = accounts.find((a) => a.id === accountId)
  if (!account) return Promise.reject(new Error('Account not found'))
  if (account.status !== 'active') {
    return Promise.reject(new Error(`Account is ${account.status} and cannot process withdrawals`))
  }
  if (amount > account.balance) {
    return Promise.reject(new Error('Insufficient funds'))
  }

  account.balance -= amount

  const transaction = {
    id: nextTransactionId++,
    account_id: accountId,
    transaction_type: 'withdrawal',
    amount,
    timestamp: new Date().toISOString(),
    description,
  }
  transactions.push(transaction)

  return delay(transaction)
}

export function createAccount({ userId, accountType, status = 'active' }) {
  const user = customers.find((c) => c.id === userId)
  if (!user) return Promise.reject(new Error('User not found'))

  const account = {
    id: nextAccountId++,
    user_id: userId,
    account_type: accountType,
    balance: 0,
    status,
  }
  accounts.push(account)

  return delay(account)
}
