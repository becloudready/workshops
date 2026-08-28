import { useState, useEffect } from 'react';
import { getNotices } from '../services/noticeService';
import '../App.css'
import Header from '../components/Header';
import Footer from '../components/Footer';

function TraineeView() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotices()
      .then(res => setNotices(res.data))
      .catch(err => setError('Could not load notices.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      <div className="board">
        <div className="board__heading">
          <h1>Notices</h1>
          <p className="board__sub">What's currently pinned to the board</p>
        </div>

        {loading && <p className="board__status">Loading...</p>}
        {error && <p className="board__status board__status--error">{error}</p>}

        {!loading && !error && (
          notices.length === 0 ? (
            <div className="board__empty">
              No notices yet.
              <div className="board__empty-sub">Check back once something's been posted.</div>
            </div>
          ) : (
            <div className="board__grid">
              {notices.map(n => (
                <div key={n.id} className="notice-card" style={{ '--tilt': `${(n.id % 5) - 2}deg` }}>
                  <span className="notice-card__pin" />
                  <h3 className="notice-card__title">{n.title}</h3>
                  <p className="notice-card__body">{n.message}</p>
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <Footer />
    </>
  );
}

export default TraineeView;