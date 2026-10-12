import { useEffect, useState } from "react";
import { apiConfigured, createNotice, deleteNotice, getNotices } from "./api.js";

const PAPER = ["paper-yellow", "paper-blue", "paper-green", "paper-white"];
const TILT = [-1.6, 1.1, -0.7, 1.8, -1.2, 0.6];

function formatTime(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function App() {
  const [notices, setNotices] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function loadNotices() {
    setError("");
    try {
      setNotices(await getNotices());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (apiConfigured) {
      loadNotices();
    } else {
      setLoading(false);
      setError("VITE_API_URL isn't set. Rebuild the frontend with your API Gateway URL.");
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setPosting(true);
    setError("");
    try {
      const created = await createNotice(name.trim(), message.trim());
      setNotices((current) => [created, ...current]);
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  }

  async function handleDelete(id) {
    setError("");
    try {
      await deleteNotice(id);
      setNotices((current) => current.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="masthead">
        <h1>Notice Board</h1>
        <p>Updates for the Full-Stack AWS cohort, auto-deployed with GitHub Actions</p>
      </header>

      <main className="layout">
        <section className="compose" aria-labelledby="compose-title">
          <h2 id="compose-title">Pin a notice</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
              autoComplete="name"
            />

            <label htmlFor="message">Notice</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              rows={5}
              required
            />
            <span className="count">{message.length}/1000</span>

            <button type="submit" disabled={posting || !apiConfigured}>
              {posting ? "Pinning..." : "Pin notice"}
            </button>
          </form>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
        </section>

        <section className="board" aria-labelledby="board-title" aria-busy={loading}>
          <h2 id="board-title" className="visually-hidden">
            Notices
          </h2>

          {loading && <p className="board-empty">Loading notices...</p>}

          {!loading && notices.length === 0 && !error && (
            <p className="board-empty">The board is empty. Pin the first notice.</p>
          )}

          <ul className="notes">
            {notices.map((notice, i) => (
              <li
                key={notice.id}
                className={`note ${PAPER[i % PAPER.length]}`}
                style={{ "--tilt": `${TILT[i % TILT.length]}deg` }}
              >
                <span className="pin" aria-hidden="true" />
                <p className="note-message">{notice.message}</p>
                <footer className="note-meta">
                  <span className="note-author">{notice.name}</span>
                  <time dateTime={notice.created_at}>{formatTime(notice.created_at)}</time>
                </footer>
                <button
                  className="note-delete"
                  onClick={() => handleDelete(notice.id)}
                  aria-label={`Delete notice from ${notice.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
