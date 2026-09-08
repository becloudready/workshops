import { useEffect, useState } from 'react'
import { currentUser } from '../../data/mockData'
import { fetchUser, getSessionUserId } from '../../api/bankingApi'
import type { User } from '../../types/banking'

export function ProfilePage() {
  const sessionUserId = getSessionUserId()
  const [user, setUser] = useState<User | null>(sessionUserId ? null : currentUser)
  const [error, setError] = useState('')
  useEffect(() => {
    if (!sessionUserId) return
    fetchUser(sessionUserId).then(setUser).catch(() => setError('We could not load your personal information.'))
  }, [sessionUserId])
  if (!user) return <main className="page-content narrow-page"><p className="error-message">{error || 'Loading your personal information...'}</p></main>
  return <main className="page-content narrow-page"><p className="eyebrow">YOUR PROFILE</p><h1>Personal information</h1><p className="subtitle">Review the information connected to your banking profile.</p>{error && <p className="error-message">{error}</p>}<section className="profile-details"><div><span>Full name</span><strong>{user.firstName} {user.lastName}</strong></div><div><span>Email address</span><strong>{user.email}</strong></div><div><span>Phone number</span><strong>{user.phoneNumber}</strong></div><div><span>Date of birth</span><strong>{user.birthday}</strong></div></section></main>
}
