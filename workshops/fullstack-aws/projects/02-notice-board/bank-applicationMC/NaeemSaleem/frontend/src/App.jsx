import { useEffect, useState } from 'react'

const STORAGE_KEY = 'naeem-saleem-notices'

const starterNotices = [
  {
    id: 'welcome',
    name: 'Notice Board Team',
    message: 'Welcome! Add a message to share it with the board.',
    createdAt: '2026-08-02T16:00:00.000Z',
  },
]

function loadNotices() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : starterNotices
  } catch {
    return starterNotices
  }
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function App() {
  const [notices, setNotices] = useState(loadNotices)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices))
  }, [notices])

  function postNotice(event) {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanMessage = message.trim()
    if (!cleanName || !cleanMessage) return

    setNotices((current) => [
      {
        id: crypto.randomUUID(),
        name: cleanName,
        message: cleanMessage,
        createdAt: new Date().toISOString(),
      },
      ...current,
    ])
    setMessage('')
  }

  function deleteNotice(id) {
    setNotices((current) => current.filter((notice) => notice.id !== id))
  }

  return (
    <main>
      <header className="hero">
        <div className="brand-mark" aria-hidden="true">N</div>
        <div>
          <p className="eyebrow">Naeem Saleem's project</p>
          <h1>Notice Board</h1>
          <p className="intro">Post an update, announcement, or reminder for everyone to see.</p>
        </div>
      </header>

      <section className="layout" aria-label="Notice board">
        <form className="composer" onSubmit={postNotice}>
          <p className="eyebrow">Create a notice</p>
          <h2>What would you like to share?</h2>

          <label htmlFor="name">Your name</label>
          <input
            id="name"
            maxLength="50"
            onChange={(event) => setName(event.target.value)}
            placeholder="Naeem Saleem"
            required
            value={name}
          />

          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            maxLength="280"
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write your notice here..."
            required
            rows="6"
            value={message}
          />
          <div className="form-footer">
            <span>{message.length}/280</span>
            <button type="submit">Post notice</button>
          </div>
        </form>

        <section className="feed" aria-live="polite">
          <div className="feed-heading">
            <div>
              <p className="eyebrow">Community updates</p>
              <h2>Latest notices</h2>
            </div>
            <span className="count">{notices.length}</span>
          </div>

          {notices.length === 0 ? (
            <div className="empty-state">
              <h3>The board is clear</h3>
              <p>Use the form to post the first notice.</p>
            </div>
          ) : (
            <div className="notice-list">
              {notices.map((notice) => (
                <article className="notice" key={notice.id}>
                  <div className="notice-topline">
                    <div className="avatar" aria-hidden="true">
                      {notice.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{notice.name}</h3>
                      <time dateTime={notice.createdAt}>{formatDate(notice.createdAt)}</time>
                    </div>
                    <button
                      aria-label={`Delete notice from ${notice.name}`}
                      className="delete-button"
                      onClick={() => deleteNotice(notice.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                  <p>{notice.message}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default App
