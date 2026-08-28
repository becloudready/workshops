import NoticeBoard from './components/NoticeBoard.jsx'
import mockNotices from './mockNotices.js'

function App() {
  // Stage 4 replaces these three constants with useState + a fetch in useEffect.
  // For now, edit them by hand to exercise each state NoticeBoard can render:
  //   notices={[]}        → empty state
  //   loading={true}      → skeleton cards
  //   error="Some text"   → error panel
  const notices = mockNotices
  const loading = false
  const error = null

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
        <NoticeBoard notices={notices} loading={loading} error={error} />
      </main>
    </div>
  )
}

export default App
