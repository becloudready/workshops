import { useState } from 'react';
import { createNotice } from '../services/noticeService';
import '../App.css'
import Header from '../components/Header';
import Footer from '../components/Footer';

function Onboarding() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await createNotice({ title, message: content });
      setTitle('');
      setContent('');
      setStatus('success');
    } catch (err) {
      console.error('Failed to create notice:', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="post">
        <div className="post__heading">
          <h1>Create Notice</h1>
          <p className="post__sub">Pin something new to the board</p>
        </div>

        <form className="post__card" onSubmit={handleSubmit}>
          <span className="post__pin" />
          <div className="post__field">
            <label className="post__label" htmlFor="notice-title">Title</label>
            <input
              id="notice-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>
          <div className="post__field">
            <label className="post__label" htmlFor="notice-content">Content</label>
            <textarea
              id="notice-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Content"
              required
            />
          </div>
          <button className="post__submit" type="submit" disabled={submitting}>
            {submitting ? 'Posting...' : 'Post Notice'}
          </button>

          {status === 'success' && <p className="post__status post__status--success">Notice posted successfully.</p>}
          {status === 'error' && <p className="post__status post__status--error">Something went wrong. Please try again.</p>}
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Onboarding;