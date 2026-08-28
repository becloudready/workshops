import { useState, useEffect } from 'react';
import { getTrainingPlans, createTrainingPlan, deleteTrainingPlan } from '../services/curriculumService';
import '../App.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// modules/milestones are edited as newline-separated text and stored as arrays
const linesToList = (text) => text.split('\n').map(line => line.trim()).filter(Boolean);

function PlanBuilder() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [title, setTitle] = useState('');
  const [modules, setModules] = useState('');
  const [milestones, setMilestones] = useState('');
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadPlans = () => {
    setLoading(true);
    getTrainingPlans()
      .then(res => setPlans(res.data))
      .catch(() => setError('Could not load training plans.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      await createTrainingPlan({
        title,
        modules: linesToList(modules),
        milestones: linesToList(milestones),
      });
      setTitle('');
      setModules('');
      setMilestones('');
      setStatus('success');
      loadPlans();
    } catch (err) {
      console.error('Failed to create training plan:', err);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTrainingPlan(id);
      loadPlans();
    } catch (err) {
      console.error('Failed to delete training plan:', err);
    }
  };

  return (
    <>
      <Header />
      <div className="post">
        <div className="post__heading">
          <h1>Plan Builder</h1>
          <p className="post__sub">Set up a training plan</p>
        </div>

        <form className="post__card" onSubmit={handleSubmit}>
          <span className="post__pin" />
          <div className="post__field">
            <label className="post__label" htmlFor="plan-title">Title</label>
            <input
              id="plan-title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              required
            />
          </div>
          <div className="post__field">
            <label className="post__label" htmlFor="plan-modules">Modules (one per line)</label>
            <textarea
              id="plan-modules"
              value={modules}
              onChange={e => setModules(e.target.value)}
              placeholder="Module 1&#10;Module 2"
            />
          </div>
          <div className="post__field">
            <label className="post__label" htmlFor="plan-milestones">Milestones (one per line)</label>
            <textarea
              id="plan-milestones"
              value={milestones}
              onChange={e => setMilestones(e.target.value)}
              placeholder="Milestone 1&#10;Milestone 2"
            />
          </div>
          <button className="post__submit" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Create Plan'}
          </button>

          {status === 'success' && <p className="post__status post__status--success">Training plan created.</p>}
          {status === 'error' && <p className="post__status post__status--error">Something went wrong. Please try again.</p>}
        </form>
      </div>

      <div className="board">
        <div className="board__heading">
          <h1>Existing Plans</h1>
          <p className="board__sub">All training plans currently defined</p>
        </div>

        {loading && <p className="board__status">Loading...</p>}
        {error && <p className="board__status board__status--error">{error}</p>}

        {!loading && !error && (
          plans.length === 0 ? (
            <div className="board__empty">No training plans yet.</div>
          ) : (
            <div className="board__grid">
              {plans.map(p => (
                <div key={p.id} className="notice-card" style={{ '--tilt': '0deg' }}>
                  <span className="notice-card__pin" />
                  <h3 className="notice-card__title">{p.title}</h3>
                  <p className="notice-card__body">
                    Modules: {(p.modules || []).join(', ') || 'None'}<br />
                    Milestones: {(p.milestones || []).join(', ') || 'None'}
                  </p>
                  <button className="post__submit" onClick={() => handleDelete(p.id)}>Delete</button>
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

export default PlanBuilder;