import { useEffect, useState } from 'react'
import NoticeCard from './NoticeCard/NoticeCard'
import './Notices.css'

const NOTICES_API_URL = 'http://localhost:8000/api/v1/notices/'

function Notices() {
  const [notices, setNotices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchNotices() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(NOTICES_API_URL, { signal: controller.signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const data = await response.json()
        setNotices(data)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError('Unable to load notices right now. Please try again later.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotices()

    return () => controller.abort()
  }, [])

  return (
    <section className="notices-page" aria-labelledby="notices-title">
      <div className="notices-header">
        <p className="eyebrow">Community board</p>
        <h1 id="notices-title">All notices</h1>
      </div>

      {isLoading && <p className="notices-status">Loading notices…</p>}

      {!isLoading && error && <p className="notices-status notices-error">{error}</p>}

      {!isLoading && !error && notices.length === 0 && (
        <p className="notices-status">There are no notices yet. Check back soon.</p>
      )}

      {!isLoading && !error && notices.length > 0 && (
        <div className="notices-list">
          {notices.map((notice) => (
            <NoticeCard
              key={notice._id}
              name={notice.name}
              message={notice.message}
              createdAt={notice.createdAt}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Notices
