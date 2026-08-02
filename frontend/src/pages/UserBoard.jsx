import { useEffect, useState } from "react";
import { getNotices } from "../api";

export default function UserBoard() {
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotices()
      .then(setNotices)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="status">Loading notices…</p>;
  if (error) return <p className="status error">{error}</p>;

  return (
    <section className="board">
      <h2>Notices</h2>
      {notices.length === 0 ? (
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
              </footer>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
