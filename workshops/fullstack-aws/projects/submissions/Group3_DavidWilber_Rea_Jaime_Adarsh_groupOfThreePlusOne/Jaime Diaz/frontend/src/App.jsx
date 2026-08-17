import { useEffect, useState } from 'react'
import { getNotices, createNotice, deleteNotice } from './api'

export default function App() {
  const [notices, setNotices] = useState([])
  const [error, setError] = useState(null)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [pinned, setPinned] = useState(false)

  const loadNotices = () => {
    getNotices()
      .then((data) => {
        const sorted = (data.notices || []).slice().sort((a, b) => {
          if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1
          return new Date(b.created_at) - new Date(a.created_at)
        })
        setNotices(sorted)
      })
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    loadNotices()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return

    try {
      await createNotice({ name, message, pinned })
      setName('')
      setMessage('')
      setPinned(false)
      loadNotices()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNotice(id)
      loadNotices()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>📋 Notice Board</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem', boxSizing: 'border-box' }}
        />
        <textarea
          placeholder="Your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ display: 'block', width: '100%', marginBottom: '0.5rem', padding: '0.5rem', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <button
            type="submit"
            style={{ padding: '0.5rem 1.2rem', cursor: 'pointer' }}
          >
            Post Notice
          </button>
          <button
            type="button"
            onClick={() => setPinned((p) => !p)}
            title={pinned ? 'Pinned — click to unpin' : 'Click to pin this notice to the top'}
            style={{
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              background: pinned ? '#f0d97d' : '#f5f5f5',
              border: `1px solid ${pinned ? '#c9a800' : '#ccc'}`,
              borderRadius: 6,
              fontWeight: pinned ? 'bold' : 'normal',
            }}
          >
            {pinned ? '📌 Pinned' : '📌 Pin'}
          </button>
        </div>
      </form>

      {notices.length === 0 && !error && <p>No notices yet.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notices.map((n) => (
          <li
            key={n.id}
            style={{
              border: `1px solid ${n.pinned ? '#c9a800' : '#ddd'}`,
              background: n.pinned ? '#fff8db' : '#fff',
              borderRadius: 8,
              padding: '1rem',
              marginBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{n.pinned ? '📌 ' : ''}{n.name}</strong>
              <button
                onClick={() => handleDelete(n.id)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#999', fontSize: '1.1rem' }}
                title="Delete notice"
              >
                🗑️
              </button>
            </div>
            <p style={{ margin: '0.5rem 0 0' }}>{n.message}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}