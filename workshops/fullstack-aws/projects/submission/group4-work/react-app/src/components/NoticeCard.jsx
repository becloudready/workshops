// Full class strings, not built by interpolation — Tailwind only ships classes
// it can find as literal text in the source.
const priorityStyles = {
  high: 'bg-high-bg text-high',
  normal: 'bg-normal-bg text-normal',
  low: 'bg-low-bg text-low',
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function NoticeCard({ notice }) {
  const { title, body, author, priority, created_at } = notice
  const badgeClass = priorityStyles[priority] ?? priorityStyles.normal

  return (
    <article className="flex flex-col rounded-xl border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badgeClass}`}
        >
          {priority ?? 'normal'}
        </span>
        <time className="shrink-0 text-xs text-ink-subtle">{formatDate(created_at)}</time>
      </div>

      <h3 className="mt-3 leading-snug font-semibold break-words">{title}</h3>
      <p className="mt-2 mb-4 text-sm leading-relaxed text-ink-muted break-words">{body}</p>

      <p className="mt-auto border-t border-line pt-3 text-xs text-ink-subtle">
        Posted by <span className="font-medium text-ink-muted">{author}</span>
      </p>
    </article>
  )
}

export default NoticeCard
