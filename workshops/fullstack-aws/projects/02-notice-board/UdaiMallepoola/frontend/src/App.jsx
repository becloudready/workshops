import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function App() {
  const [notices, setNotices]   = useState([])
  const [name, setName]         = useState('')
  const [message, setMessage]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const fetchNotices = async () => {
    try {
      const res = await fetch(`${API_URL}/notices`)
      const data = await res.json()
      setNotices(data)
    } catch {
      setError('Failed to load notices.')
    }
  }

  useEffect(() => { fetchNotices() }, [])

  const postNotice = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !message.trim()) {
      setError('Both name and message are required.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/notices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      })
      if (!res.ok) throw new Error()
      setName('')
      setMessage('')
      fetchNotices()
    } catch {
      setError('Failed to post notice.')
    } finally {
      setLoading(false)
    }
  }

  const deleteNotice = async (id) => {
    try {
      await fetch(`${API_URL}/notices/${id}`, { method: 'DELETE' })
      fetchNotices()
    } catch {
      setError('Failed to delete notice.')
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>📋 Notice Board</h1>

        <form onSubmit={postNotice} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <textarea
            style={{ ...styles.input, height: 80, resize: 'vertical' }}
            placeholder="Your message"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Posting…' : 'Post Notice'}
          </button>
        </form>
      </div>

      <div style={styles.list}>
        {notices.length === 0 && (
          <p style={{ textAlign: 'center', color: '#888' }}>No notices yet. Be the first!</p>
        )}
        {notices.map(n => (
          <div key={n.id} style={styles.notice}>
            <div>
              <strong style={styles.noticeName}>{n.name}</strong>
              <p style={styles.noticeMsg}>{n.message}</p>
              {n.createdAt && (
                <small style={{ color: '#aaa' }}>
                  {new Date(n.createdAt).toLocaleString()}
                </small>
              )}
            </div>
            <button style={styles.del} onClick={() => deleteNotice(n.id)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page:       { maxWidth: 640, margin: '40px auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif' },
  card:       { background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: 24 },
  title:      { margin: '0 0 20px', fontSize: 26, color: '#1a1a1a' },
  form:       { display: 'flex', flexDirection: 'column', gap: 12 },
  input:      { padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: 15, outline: 'none', fontFamily: 'inherit' },
  btn:        { padding: '11px 20px', borderRadius: 8, border: 'none', background: '#6c47ff', color: '#fff', fontWeight: 600, fontSize: 15, cursor: 'pointer' },
  error:      { color: '#e53e3e', margin: 0, fontSize: 14 },
  list:       { display: 'flex', flexDirection: 'column', gap: 12 },
  notice:     { background: '#fff', borderRadius: 10, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  noticeName: { fontSize: 15, color: '#333' },
  noticeMsg:  { margin: '4px 0 6px', color: '#555', fontSize: 14 },
  del:        { background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 18, flexShrink: 0, padding: 0, lineHeight: 1 },
}
