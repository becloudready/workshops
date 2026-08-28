import { createContext } from 'react'

// Matches the shape the backend's /login endpoint returns.
export type User = {
  user_id: number
  username: string
  email: string
  role: 'TrainingManager' | 'Trainee'
}

export type AuthContextValue = {
  isLoggedIn: boolean
  user: User | null
  login: (email: string, password: string) => Promise<void>
  // Signs a user in directly, bypassing the real API call — a stand-in
  // until the backend distinguishes roles, used by the dev login shortcuts.
  loginAsMock: (user: User) => void
  logout: () => void
  updateUser: (updated: User) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)
