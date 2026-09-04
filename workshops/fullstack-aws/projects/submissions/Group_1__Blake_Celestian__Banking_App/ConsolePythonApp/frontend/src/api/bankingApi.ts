import axios from 'axios'
import type { Account, AccountType, Transaction, User } from '../types/banking'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'
})


// Add JWT to every API request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('banking_access_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const getSessionUserId = () =>
  localStorage.getItem('banking_user_id')

export async function login(
  email: string,
  password: string
): Promise<{ userId: string; isAdmin: boolean }> {
  const response = await api.post('/login', {
    email,
    password
  })

  localStorage.setItem(
    'banking_access_token',
    response.data.access_token
  )

  localStorage.setItem(
    'banking_user_id',
    response.data.user_id
  )

  localStorage.setItem(
    'banking_is_admin',
    String(response.data.is_admin)
  )

  return {
    userId: response.data.user_id,
    isAdmin: response.data.is_admin
  }
}

export function logout() {
  localStorage.removeItem('banking_access_token')
  localStorage.removeItem('banking_user_id')
  localStorage.removeItem('banking_is_admin')
}

export async function createUser(user: { email: string; password: string; isAdmin: boolean; birthday: string; phoneNumber: string; firstName: string; lastName: string }) {
  const response = await api.post('/users', { email: user.email, password: user.password, is_admin: user.isAdmin, birthday: user.birthday, phone_number: user.phoneNumber, first_name: user.firstName, last_name: user.lastName })
  return response.data as { id: string; is_admin: boolean }
}

//goes through 
export async function isEmailAvailable(email: string) {
  const response = await api.get('/users')
  return !(response.data.users as { email: string }[]).some((user) => user.email.toLowerCase() === email.trim().toLowerCase())
}

export async function fetchUsers(): Promise<{ id: string; firstName: string; lastName: string }[]> {
  const response = await api.get('/users')
  return (response.data.users as { id: string; first_name: string; last_name: string }[]).map((user) => ({ id: String(user.id), firstName: user.first_name, lastName: user.last_name }))
}

//this function is used to convert our account objects from the API format to the frontend format
const accountFromApi = (account: { account_number: number; account_type: AccountType; balance: number; created_date: string; is_active: boolean; owner_id?: string }): Account => ({
  accountNumber: String(account.account_number), accountType: account.account_type, balance: Number(account.balance), createdDate: account.created_date, isActive: account.is_active, ownerId: account.owner_id ? String(account.owner_id) : undefined,
})

const transactionFromApi = (transaction: { id: number; from_owner_id: string; from_owner_account_number: number; to_owner_id?: string | null; to_owner_account_number?: number | null; description?: string; amount: number; transaction_date: string; category?: string; type: string; wager_result?: 'win' | 'loss' | null }, viewerId: string): Transaction => {
  //transfers are only a credit for the recipient; everyone else sees them as money leaving their account
  const isRecipient = transaction.type === 'transfer' && String(transaction.to_owner_id) === viewerId
  const accountNumber = isRecipient && transaction.to_owner_account_number ? transaction.to_owner_account_number : transaction.from_owner_account_number
  const amount = transaction.type === 'deposit' || isRecipient ? Number(transaction.amount) : -Number(transaction.amount)
  return {
    id: String(transaction.id), merchant: transaction.description || (isRecipient ? 'Transfer received' : transaction.type), date: new Date(transaction.transaction_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }), amount, category: transaction.category ?? undefined, accountNumber: String(accountNumber), type: transaction.type, wagerResult: transaction.wager_result,
  }
}

type ApiTransaction = { id: number; from_owner_id: string; from_owner_account_number: number; to_owner_id?: string | null; to_owner_account_number?: number | null; description?: string; amount: number; transaction_date: string; category?: string; type: string; wager_result?: 'win' | 'loss' | null }

//admins aren't the sender or recipient, so transfers must be split into a debit row (sender's account) and a credit row (recipient's account) to show up under both
const adminTransactionsFromApi = (transaction: ApiTransaction): Transaction[] => {
  const date = new Date(transaction.transaction_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  const category = transaction.category ?? undefined
  const debit: Transaction = { id: String(transaction.id), merchant: transaction.description || transaction.type, date, amount: transaction.type === 'deposit' ? Number(transaction.amount) : -Number(transaction.amount), category, accountNumber: String(transaction.from_owner_account_number), type: transaction.type, wagerResult: transaction.wager_result }
  if (transaction.type !== 'transfer' || !transaction.to_owner_account_number) return [debit]
  const credit: Transaction = { id: `${transaction.id}-credit`, merchant: 'Transfer received', date, amount: Number(transaction.amount), category, accountNumber: String(transaction.to_owner_account_number), type: transaction.type, wagerResult: transaction.wager_result }
  return [debit, credit]
}

export async function fetchUser(userId: string): Promise<User> {
  const response = await api.get(`/users/${userId}`)
  return { firstName: response.data.first_name, lastName: response.data.last_name, email: response.data.email, phoneNumber: response.data.phone_number, birthday: response.data.birthday }
}

export async function fetchAccounts(userId: string, admin = false): Promise<Account[]> {
  const response = await api.get('/accounts', { params: { requester_id: userId, ...(admin ? {} : { owner_id: userId }) } })
  return response.data.accounts.map(accountFromApi)
}

export async function fetchAccount(accountNumber: string): Promise<Account> {
  const response = await api.get(`/accounts/${accountNumber}`)
  return accountFromApi(response.data)
}

export async function fetchTransactions(userId: string, admin = false): Promise<Transaction[]> {
  const response = await api.get('/transactions', { params: { owner_id: userId } })
  if (admin) return (response.data as ApiTransaction[]).flatMap(adminTransactionsFromApi)
  return response.data.map((transaction: ApiTransaction) => transactionFromApi(transaction, userId))
}

export async function fetchSpending(userId: string): Promise<Transaction[]> {
  const response = await api.get('/transactions/spending', { params: { owner_id: userId } })
  return response.data.map(transactionFromApi)
}

export async function createAccount(userId: string, accountType: AccountType, amount = '0') {
  const response = await api.post('/accounts', { owner_id: userId, account_type: accountType, amount }, { params: { requester_id: userId } })
  return accountFromApi(response.data)
}

export async function deposit(userId: string, accountNumber: string, amount: string, description?: string) {
  const response = await api.post('/transactions/deposit', { account_number: Number(accountNumber), amount, description }, { params: { owner_id: userId } })
  return accountFromApi(response.data)
}

export async function withdraw(userId: string, accountNumber: string, amount: string, description?: string) {
  const response = await api.post('/transactions/withdraw', { account_number: Number(accountNumber), amount, description }, { params: { owner_id: userId } })
  return accountFromApi(response.data)
}

export async function transfer(userId: string, fromAccountNumber: string, toAccountNumber: string, amount: string) {
  return api.post('/transactions/transfer', { from_account_number: Number(fromAccountNumber), to_account_number: Number(toAccountNumber), amount }, { params: { owner_id: userId } })
}

export async function createWager(transactionId: string, ownerId: string): Promise<{ wagerResult: 'win' | 'loss'; updatedBalance: number }> {
  const response = await api.post(`/transactions/${transactionId}/wager`, null, { params: { owner_id: ownerId } })
  return { wagerResult: response.data.wager_result, updatedBalance: Number(response.data.updated_balance) }
}

export async function fetchTransactionCategories(ownerId: string): Promise<string[]> {
  const response = await api.get(`/transactions/owners/${ownerId}/categories`)
  return (response.data as string[]).map(String)
}

export async function updateTransactionCategory(transactionId: string, ownerId: string, category?: string) {
  const response = await api.put(`/transactions/${transactionId}/category`, null, { params: { owner_id: ownerId, ...(category ? { category } : {}) } })
  return response.data
}

export async function updateAccountStatus(requesterId: string, accountNumber: string, isActive: boolean) {
  const response = await api.patch(`/accounts/${accountNumber}/status`, { is_active: isActive }, { params: { requester_id: requesterId } })
  return accountFromApi(response.data)
}
