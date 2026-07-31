import { formatNoticeDate } from '../../../utils/formatDate'
import './NoticeCard.css'

function NoticeCard({ name, message, createdAt }) {
  return (
    <article className="notice-card">
      <div className="notice-card-header">
        <h3>{name}</h3>
        <time className="notice-card-date">{formatNoticeDate(createdAt)}</time>
      </div>
      <p className="notice-card-message">{message}</p>
    </article>
  )
}

export default NoticeCard
