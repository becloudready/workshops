import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { post } from '../api/client'
import { AuthContext } from './context'
import type { User } from './context'

const STORAGE_KEY = 'noticeboardtracker_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // ignore storage failures (e.g. private browsing)
    }
  }, [user])

  async function login(email: string, password: string) {
    // If this throws (wrong password, network error, etc.), the caller's
    // try/catch handles it — user stays null until it actually succeeds.
    const loggedInUser = await post<User>('/login', { email, password })
    setUser(loggedInUser)
  }

  function loginAsMock(mockUser: User) {
    setUser(mockUser)
  }

  function logout() {
    setUser(null)
  }

  // Lets a page (e.g. ProfilePage after a successful PUT /users/{id}) push
  // fresh data back into the shared session - the header, home page, etc.
  // all read `user` from here, so this is what keeps them in sync
  // without every consumer re-fetching on its own.
  function updateUser(updated: User) {
    setUser(updated)
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn: user !== null, user, login, loginAsMock, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
