import NoticeCard from './components/NoticeCard.jsx'
import mockNotices from './mockNotices.js'

function App() {
  return (
    <div className="min-h-screen bg-page text-ink">
      <header className="sticky top-0 z-10 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand font-bold text-white">
            N
          </div>
          <div>
            <h1 className="text-lg leading-tight font-semibold">NoticeBoardTracker</h1>
            <p className="text-sm leading-tight text-ink-muted">Internal notices</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {/* NoticeForm lands here in Stage 5 */}

        {/* Stage 3 moves this grid into NoticeBoard, which will also own the
            loading / error / empty states. */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockNotices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
