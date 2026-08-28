export type AccountType = 'Checking' | 'Savings'

export type Account = {
  accountNumber: string
  accountType: AccountType
  balance: number
  createdDate: string
  isActive: boolean
  ownerId?: string
}

export type Transaction = {
  id: string
  merchant: string
  date: string
  amount: number
  category: string
  accountNumber: string
}

export type User = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  birthday: string
}
