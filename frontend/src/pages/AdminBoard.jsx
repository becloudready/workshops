import { useEffect, useState } from "react";
import { getNotices, createNotice, deleteNotice } from "../api";

const EMPTY_FORM = { title: "", content: "", author: "Admin" };

export default function AdminBoard() {
  const [notices, setNotices] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotices = () =>
    getNotices()
      .then(setNotices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createNotice(form);
      setForm(EMPTY_FORM);
      await fetchNotices();
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await deleteNotice(id);
      setNotices((prev) => prev.filter((n) => n.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="board">
      <h2>Admin — Manage Notices</h2>

      <form className="notice-form" onSubmit={handleSubmit}>
        <h3>Post a New Notice</h3>
        <label>
          Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          Content
          <textarea
            required
            rows={4}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </label>
        <label>
          Author
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Posting…" : "Post Notice"}
        </button>
      </form>

      {error && <p className="status error">{error}</p>}

      {loading ? (
        <p className="status">Loading…</p>
      ) : notices.length === 0 ? (
        <p className="status">No notices yet.</p>
      ) : (
        <ul className="notice-list">
          {notices.map((n) => (
            <li key={n.id} className="notice-card">
              <h3>{n.title}</h3>
              <p>{n.content}</p>
              <footer>
                <span>{n.author}</span>
                <span>{new Date(n.created_at).toLocaleDateString()}</span>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(n.id)}
                >
                  Delete
                </button>
              </footer>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
