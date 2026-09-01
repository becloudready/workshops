import NoticeCard from './NoticeCard.jsx'

const gridClass = 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-line bg-surface p-5 shadow-sm">
      <div className="h-5 w-16 animate-pulse rounded-full bg-surface-muted" />
      <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-surface-muted" />
      <div className="mt-2 h-3 w-full animate-pulse rounded bg-surface-muted" />
      <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-surface-muted" />
      <div className="mt-6 h-3 w-1/3 animate-pulse rounded bg-surface-muted" />
    </div>
  )
}

function NoticeBoard({ notices = [], loading = false, error = null }) {
  // Order matters: a stale list shouldn't render while we're reloading, and an
  // error shouldn't be masked by an empty state.
  if (loading) {
    return (
      <div className={gridClass} aria-busy="true" aria-label="Loading notices">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  if (error) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-high bg-high-bg px-6 py-8 text-center"
      >
        <p className="font-semibold text-high">Couldn&rsquo;t load notices</p>
        <p className="mt-1 text-sm text-ink-muted">{error}</p>
      </div>
    )
  }

  if (notices.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
        <p className="font-medium text-ink-muted">No notices yet</p>
        <p className="mt-1 text-sm text-ink-subtle">
          Posted notices will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className={gridClass}>
      {notices.map((notice) => (
        <NoticeCard key={notice.id} notice={notice} />
      ))}
    </div>
  )
}

export default NoticeBoard
