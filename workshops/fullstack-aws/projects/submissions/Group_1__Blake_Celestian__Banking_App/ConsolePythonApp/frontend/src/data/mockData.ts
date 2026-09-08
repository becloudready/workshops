import type { Account, Transaction, User } from '../types/banking'

export const currentUser: User = {
  firstName: 'Jesiel',
  lastName: 'Smith',
  email: 'jesiel.smith@example.com',
  phoneNumber: '(555) 013-4820',
  birthday: '1998-04-12',
}

export const initialAccounts: Account[] = [
  { accountNumber: '8472', accountType: 'Checking', balance: 4280.55, createdDate: 'March 14, 2024', isActive: true },
  { accountNumber: '1936', accountType: 'Savings', balance: 12650, createdDate: 'November 02, 2023', isActive: true },
]

export const initialTransactions: Transaction[] = [
  { id: '1', merchant: 'Northstar Market', date: 'Aug 24, 2026', amount: -84.32, category: 'Groceries', accountNumber: '8472' },
  { id: '2', merchant: 'Payroll deposit', date: 'Aug 22, 2026', amount: 2450, category: 'Income', accountNumber: '8472' },
  { id: '3', merchant: 'Metro Transit', date: 'Aug 20, 2026', amount: -42, category: 'Transport', accountNumber: '1936' },
  { id: '4', merchant: 'Harbor Coffee', date: 'Aug 19, 2026', amount: -6.75, category: 'Dining', accountNumber: '8472' },
  { id: '5', merchant: 'Utility payment', date: 'Aug 16, 2026', amount: -126.4, category: 'Bills', accountNumber: '1936' },
]

export const formatMoney = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
