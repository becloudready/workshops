import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

// Your API Gateway base URL (no trailing slash, no /notices)
const API = 'https://bnoe4svwb9.execute-api.us-east-1.amazonaws.com'

async function api(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data
}

const STATUS = {
  on_track: { label: 'On track', tone: 'good' },
  done: { label: 'Done', tone: 'good' },
  no_updates: { label: 'No updates', tone: 'warn' },
  overdue: { label: 'Overdue', tone: 'bad' },
  no_plans: { label: 'No plans', tone: 'muted' },
}

const AVATAR_COLORS = ['#1e8e3e', '#1967d2', '#c5221f', '#e37400', '#8430ce', '#007b83', '#b06000', '#3c4043']

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatDue(date) {
  if (!date) return ''
  return new Date(date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */
function Avatar({ name = '?', id = '' }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
  const color = AVATAR_COLORS[[...id].reduce((n, ch) => n + ch.charCodeAt(0), 0) % AVATAR_COLORS.length]
  return <span className="avatar" style={{ background: color }} aria-hidden="true">{initials}</span>
}

function Banner({ title, subtitle }) {
  return (
    <div className="banner">
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  )
}

function Section({ title, count, children, action }) {
  return (
    <section className="section">
      <div className="section-head">
        <h3>{title}</h3>
        <div className="section-side">
          {count !== undefined && <span className="count">{count}</span>}
          {action}
        </div>
      </div>
      {children}
    </section>
  )
}

function Panel({ title, children }) {
  return (
    <div className="panel">
      {title && <h3 className="panel-title">{title}</h3>}
      {children}
    </div>
  )
}

function Toast({ flash, onClose }) {
  if (!flash) return null
  return (
    <div className={`toast ${flash.type === 'error' ? 'toast-error' : ''}`} role="status">
      <span>{flash.text}</span>
      <button className="text-btn on-dark" onClick={onClose}>Dismiss</button>
    </div>
  )
}

function Empty({ children }) {
  return <p className="empty">{children}</p>
}

/* ------------------------------------------------------------------ */
/* HR: people and cohorts                                              */
/* ------------------------------------------------------------------ */
function HRView({ data, reload, say }) {
  const [cohortName, setCohortName] = useState('')
  const [form, setForm] = useState({ name: '', email: '', cohort_id: '' })

  const addCohort = async (e) => {
    e.preventDefault()
    try {
      await api('/cohorts', { method: 'POST', body: { name: cohortName } })
      say('success', `Created cohort ${cohortName}`)
      setCohortName('')
      reload()
    } catch (err) { say('error', err.message) }
  }

  const onboard = async (e) => {
    e.preventDefault()
    try {
      await api('/trainees', { method: 'POST', body: form })
      say('success', `Added ${form.name}`)
      setForm({ name: '', email: '', cohort_id: form.cohort_id })
      reload()
    } catch (err) { say('error', err.message) }
  }

  const moveCohort = async (id, cohort_id) => {
    try { await api(`/trainees/${id}`, { method: 'PUT', body: { cohort_id } }); reload() } catch (err) { say('error', err.message) }
  }

  const remove = async (t) => {
    if (!confirm(`Remove ${t.name}?`)) return
    try { await api(`/trainees/${t._id}`, { method: 'DELETE' }); say('success', `Removed ${t.name}`); reload() } catch (err) { say('error', err.message) }
  }

  const removeCohort = async (c) => {
    if (!confirm(`Delete ${c.name}? Its trainees will move to Solo track.`)) return
    try { await api(`/cohorts/${c._id}`, { method: 'DELETE' }); reload() } catch (err) { say('error', err.message) }
  }

  const groups = [
    ...data.cohorts.map((c) => ({ cohort: c, people: data.trainees.filter((t) => t.cohort_id === c._id) })),
    { cohort: null, people: data.trainees.filter((t) => !t.cohort_id) },
  ]

  return (
    <div className="page">
      <Banner title="People" subtitle="Add trainees and organize them into cohorts" />
      <div className="layout">
        <aside className="side">
          <Panel title="Add a trainee">
            <form className="form" onSubmit={onboard}>
              <input placeholder="Full name" aria-label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input type="email" placeholder="Email" aria-label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <select aria-label="Cohort" value={form.cohort_id} onChange={(e) => setForm({ ...form, cohort_id: e.target.value })}>
                <option value="">Solo track</option>
                {data.cohorts.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <button className="btn">Add trainee</button>
            </form>
          </Panel>
          <Panel title="New cohort">
            <form className="form" onSubmit={addCohort}>
              <input placeholder="Cohort name" aria-label="Cohort name" value={cohortName} onChange={(e) => setCohortName(e.target.value)} required />
              <button className="btn">Create</button>
            </form>
          </Panel>
        </aside>

        <div className="main">
          {data.trainees.length === 0 && data.cohorts.length === 0 && <Empty>Add a cohort and your first trainee to get started.</Empty>}
          {groups.filter((g) => g.cohort || g.people.length > 0).map((g) => (
            <Section
              key={g.cohort?._id || 'solo'}
              title={g.cohort ? g.cohort.name : 'Solo track'}
              count={`${g.people.length} trainee${g.people.length === 1 ? '' : 's'}`}
              action={g.cohort && <button className="text-btn danger" onClick={() => removeCohort(g.cohort)}>Delete cohort</button>}
            >
              {g.people.length === 0 ? <Empty>No trainees in this cohort yet.</Empty> : (
                <ul className="rows">
                  {g.people.map((t) => (
                    <li key={t._id} className="row">
                      <Avatar name={t.name} id={t._id} />
                      <div className="row-main">
                        <div>{t.name}</div>
                        <div className="sub">{t.email}</div>
                      </div>
                      <select className="compact" value={t.cohort_id || ''} onChange={(e) => moveCohort(t._id, e.target.value)} aria-label={`Move ${t.name}`}>
                        <option value="">Solo track</option>
                        {data.cohorts.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                      <button className="text-btn danger" onClick={() => remove(t)}>Remove</button>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Manager: progress, plans, announcements                             */
/* ------------------------------------------------------------------ */
function ManagerView({ data, reload, say }) {
  const [dash, setDash] = useState(null)
  const [filter, setFilter] = useState('all')
  const [plan, setPlan] = useState({ title: '', description: '', due_date: '', target: '' })
  const [notice, setNotice] = useState({ title: '', content: '' })
  const [openTrainee, setOpenTrainee] = useState(null)
  const [reports, setReports] = useState([])

  const loadDash = useCallback(() => {
    api('/dashboard').then(setDash).catch((err) => say('error', err.message))
  }, [say])

  useEffect(() => { loadDash() }, [loadDash, data])

  const assign = async (e) => {
    e.preventDefault()
    const [kind, id] = plan.target.split(':')
    try {
      const res = await api('/plans', {
        method: 'POST',
        body: { title: plan.title, description: plan.description, due_date: plan.due_date, [kind === 'c' ? 'cohort_id' : 'trainee_id']: id },
      })
      say('success', `Assigned ${plan.title} to ${res.notified} trainee${res.notified === 1 ? '' : 's'}`)
      setPlan({ title: '', description: '', due_date: '', target: plan.target })
      reload()
    } catch (err) { say('error', err.message) }
  }

  const post = async (e) => {
    e.preventDefault()
    try {
      await api('/notices', { method: 'POST', body: notice })
      say('success', 'Announcement posted')
      setNotice({ title: '', content: '' })
      reload()
    } catch (err) { say('error', err.message) }
  }

  const deletePlan = async (p) => {
    if (!confirm(`Delete ${p.title} and its reports?`)) return
    try { await api(`/plans/${p._id}`, { method: 'DELETE' }); reload() } catch (err) { say('error', err.message) }
  }

  const deleteNotice = async (n) => {
    if (!confirm(`Delete ${n.title}?`)) return
    try { await api(`/notices/${n._id}`, { method: 'DELETE' }); reload() } catch (err) { say('error', err.message) }
  }

  const toggleTrainee = async (row) => {
    if (openTrainee === row.trainee_id) { setOpenTrainee(null); return }
    setOpenTrainee(row.trainee_id)
    try { setReports(await api(`/reports?trainee_id=${row.trainee_id}`)) } catch (err) { say('error', err.message) }
  }

  const rows = (dash?.trainees || []).filter((r) => filter === 'all' || r.status === filter || (filter === 'on_track' && r.status === 'done'))
  const t = dash?.totals

  return (
    <div className="page">
      <Banner title="Training overview" subtitle={t ? `${t.trainees} trainees in ${t.cohorts} cohort${t.cohorts === 1 ? '' : 's'}, ${t.plans} active plan${t.plans === 1 ? '' : 's'}` : ' '} />
      <div className="layout">
        <aside className="side">
          <Panel title="Assign a plan">
            <form className="form" onSubmit={assign}>
              <input placeholder="Title" aria-label="Plan title" value={plan.title} onChange={(e) => setPlan({ ...plan, title: e.target.value })} required />
              <textarea placeholder="Instructions (optional)" aria-label="Instructions" rows={3} value={plan.description} onChange={(e) => setPlan({ ...plan, description: e.target.value })} />
              <label className="field">Due
                <input type="date" value={plan.due_date} onChange={(e) => setPlan({ ...plan, due_date: e.target.value })} required />
              </label>
              <label className="field">For
                <select value={plan.target} onChange={(e) => setPlan({ ...plan, target: e.target.value })} required>
                  <option value="" disabled>Choose a cohort or trainee</option>
                  {data.cohorts.length > 0 && (
                    <optgroup label="Cohorts">
                      {data.cohorts.map((c) => <option key={c._id} value={`c:${c._id}`}>{c.name}</option>)}
                    </optgroup>
                  )}
                  {data.trainees.length > 0 && (
                    <optgroup label="Solo track">
                      {data.trainees.map((tr) => <option key={tr._id} value={`t:${tr._id}`}>{tr.name}</option>)}
                    </optgroup>
                  )}
                </select>
              </label>
              <button className="btn">Assign</button>
            </form>
          </Panel>
          <Panel title="Post an announcement">
            <form className="form" onSubmit={post}>
              <input placeholder="Title" aria-label="Announcement title" value={notice.title} onChange={(e) => setNotice({ ...notice, title: e.target.value })} required />
              <textarea placeholder="Share something with all trainees" aria-label="Announcement" rows={3} value={notice.content} onChange={(e) => setNotice({ ...notice, content: e.target.value })} />
              <button className="btn">Post</button>
            </form>
          </Panel>
        </aside>

        <div className="main">
          <Section
            title="Progress"
            action={
              <select className="compact" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter trainees">
                <option value="all">All trainees{t ? ` (${t.trainees})` : ''}</option>
                <option value="on_track">On track{t ? ` (${t.on_track + t.done})` : ''}</option>
                <option value="no_updates">No updates{t ? ` (${t.no_updates})` : ''}</option>
                <option value="overdue">Overdue{t ? ` (${t.overdue})` : ''}</option>
                <option value="no_plans">No plans{t ? ` (${t.no_plans})` : ''}</option>
              </select>
            }
          >
            {!dash ? <Empty>Loading…</Empty> : rows.length === 0 ? <Empty>No trainees to show.</Empty> : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Trainee</th><th>Cohort</th><th>Progress</th><th>Last report</th><th>Status</th></tr></thead>
                  <tbody>
                    {rows.map((r) => (
                      <Fragment key={r.trainee_id}>
                        <tr className="clickable" onClick={() => toggleTrainee(r)} aria-expanded={openTrainee === r.trainee_id}>
                          <td>
                            <div className="who"><Avatar name={r.name} id={r.trainee_id} /><span>{r.name}</span></div>
                          </td>
                          <td className="sub">{r.cohort === 'Unassigned' ? 'Solo track' : r.cohort}</td>
                          <td>
                            <div className="progress"><div className="bar"><span style={{ width: `${r.average_progress}%` }} /></div><span>{r.average_progress}%</span></div>
                          </td>
                          <td className="sub">{formatDate(r.last_update) || 'None yet'}</td>
                          <td>
                            <span className={`status tone-${STATUS[r.status].tone}`}>{STATUS[r.status].label}</span>
                            {r.overdue_plans.length > 0 && <div className="sub small">{r.overdue_plans.join(', ')}</div>}
                          </td>
                        </tr>
                        {openTrainee === r.trainee_id && (
                          <tr className="detail">
                            <td colSpan={5}>
                              {reports.length === 0 ? <Empty>{r.name} hasn't submitted a report yet.</Empty> : (
                                <ul className="reports">
                                  {reports.map((rep) => (
                                    <li key={rep._id}>
                                      <div className="report-head"><strong>{rep.plan_title}</strong><span className="sub">{rep.progress}% on {formatDate(rep.created_at)}</span></div>
                                      {rep.note && <p>{rep.note}</p>}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          <Section title="Plans" count={data.plans.length ? `${data.plans.length}` : undefined}>
            {data.plans.length === 0 ? <Empty>Plans you assign will appear here.</Empty> : (
              <ul className="rows">
                {data.plans.map((p) => (
                  <li key={p._id} className="row">
                    <span className="item-icon" aria-hidden="true"><PlanIcon /></span>
                    <div className="row-main">
                      <div>{p.title}</div>
                      <div className="sub">{p.cohort_id ? p.assigned_to.replace(/^cohort /, '') : p.assigned_to}</div>
                    </div>
                    <span className="sub">Due {formatDue(p.due_date)}</span>
                    <button className="text-btn danger" onClick={() => deletePlan(p)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <Section title="Announcements">
            {data.notices.length === 0 ? <Empty>Nothing posted yet.</Empty> : (
              <div className="stream">
                {data.notices.map((n) => (
                  <article key={n._id} className="post">
                    <div className="post-head">
                      <span className="item-icon" aria-hidden="true"><MegaphoneIcon /></span>
                      <div className="row-main">
                        <div>{n.title}</div>
                        <div className="sub">{formatDate(n.created_at)}</div>
                      </div>
                      <button className="text-btn danger" onClick={() => deleteNotice(n)}>Delete</button>
                    </div>
                    {n.content && <p className="post-body">{n.content}</p>}
                  </article>
                ))}
              </div>
            )}
          </Section>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Trainee: classwork, reports, notifications                          */
/* ------------------------------------------------------------------ */
function TraineeView({ data, say, traineeId, setTraineeId }) {
  const [notes, setNotes] = useState([])
  const [plans, setPlans] = useState([])
  const [reports, setReports] = useState([])
  const [form, setForm] = useState({ plan_id: '', progress: 50, note: '' })

  const load = useCallback(async () => {
    if (!traineeId) return
    try {
      const [n, p, r] = await Promise.all([
        api(`/notifications?trainee_id=${traineeId}`),
        api(`/plans?trainee_id=${traineeId}`),
        api(`/reports?trainee_id=${traineeId}`),
      ])
      setNotes(n); setPlans(p); setReports(r)
    } catch (err) { say('error', err.message) }
  }, [traineeId, say])

  useEffect(() => { load() }, [load])

  const markRead = async (n) => {
    try { await api(`/notifications/${n._id}/read`, { method: 'PUT' }); load() } catch (err) { say('error', err.message) }
  }

  const submit = async (e) => {
    e.preventDefault()
    try {
      await api('/reports', { method: 'POST', body: { ...form, trainee_id: traineeId } })
      say('success', 'Report submitted')
      setForm({ plan_id: form.plan_id, progress: form.progress, note: '' })
      load()
    } catch (err) { say('error', err.message) }
  }

  const latest = useMemo(() => {
    const out = {}
    reports.forEach((r) => { if (!(r.plan_id in out)) out[r.plan_id] = r.progress })
    return out
  }, [reports])

  const me = data.trainees.find((t) => t._id === traineeId)
  const unread = notes.filter((n) => !n.read).length
  const today = new Date().toISOString().slice(0, 10)

  if (data.trainees.length === 0) {
    return <div className="page"><Banner title="My work" /><Empty>No trainees yet. Add one from the People tab.</Empty></div>
  }

  return (
    <div className="page">
      <div className="viewer">
        <label className="field inline-field">Signed in as
          <select className="compact" value={traineeId} onChange={(e) => setTraineeId(e.target.value)}>
            <option value="" disabled>Choose a trainee</option>
            {data.trainees.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
        </label>
      </div>

      {!me ? <Empty>Choose a trainee to see their work.</Empty> : (
        <>
          <Banner title={me.name} subtitle={data.cohorts.find((c) => c._id === me.cohort_id)?.name || 'Solo track'} />
          <div className="layout">
            <aside className="side">
              <Panel title="Submit a report">
                {plans.length === 0 ? <Empty>You can report once a plan is assigned.</Empty> : (
                  <form className="form" onSubmit={submit}>
                    <select aria-label="Plan" value={form.plan_id} onChange={(e) => setForm({ ...form, plan_id: e.target.value })} required>
                      <option value="" disabled>Choose a plan</option>
                      {plans.map((p) => <option key={p._id} value={p._id}>{p.title}</option>)}
                    </select>
                    <label className="field">Progress: {form.progress}%
                      <input type="range" min="0" max="100" step="5" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} />
                    </label>
                    <textarea placeholder="What did you work on?" aria-label="What did you work on?" rows={3} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
                    <button className="btn">Submit</button>
                  </form>
                )}
              </Panel>
              <Panel title={unread ? `Notifications (${unread})` : 'Notifications'}>
                {notes.length === 0 ? <Empty>You're all caught up.</Empty> : (
                  <ul className="notes">
                    {notes.map((n) => (
                      <li key={n._id} className={n.read ? 'read' : 'unread'}>
                        <div>{n.message}</div>
                        <div className="note-meta">
                          <span className="sub small">{formatDate(n.created_at)}</span>
                          {!n.read && <button className="text-btn" onClick={() => markRead(n)}>Mark as read</button>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </aside>

            <div className="main">
              <Section title="Classwork">
                {plans.length === 0 ? <Empty>No plans assigned yet.</Empty> : (
                  <ul className="rows">
                    {plans.map((p) => {
                      const pct = latest[p._id] || 0
                      const late = p.due_date < today && pct < 100
                      return (
                        <li key={p._id} className="row work">
                          <span className="item-icon" aria-hidden="true"><PlanIcon /></span>
                          <div className="row-main">
                            <div>{p.title}</div>
                            {p.description && <div className="sub">{p.description}</div>}
                            <div className="progress"><div className="bar"><span style={{ width: `${pct}%` }} /></div><span className="small">{pct}%</span></div>
                          </div>
                          <span className={late ? 'status tone-bad small' : 'sub'}>{late ? 'Overdue' : `Due ${formatDue(p.due_date)}`}</span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </Section>

              {data.notices.length > 0 && (
                <Section title="Announcements">
                  <div className="stream">
                    {data.notices.map((n) => (
                      <article key={n._id} className="post">
                        <div className="post-head">
                          <span className="item-icon" aria-hidden="true"><MegaphoneIcon /></span>
                          <div className="row-main"><div>{n.title}</div><div className="sub">{formatDate(n.created_at)}</div></div>
                        </div>
                        {n.content && <p className="post-body">{n.content}</p>}
                      </article>
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Icons and logo                                                      */
/* ------------------------------------------------------------------ */
function PlanIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M7 3h7l5 5v13H7V3zm7 1.5V9h4.5L14 4.5zM9 12v1.5h8V12H9zm0 3v1.5h8V15H9zm0 3v1.5h5V18H9z" /></svg>
  )
}

function MegaphoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M18 4v16l-5-3H8l1 4H7l-1.2-4H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h8l5-3zm1.5 5.5a3 3 0 0 1 0 5V9.5z" /></svg>
  )
}

/* A small notice board: frame, two pinned notes and a pin */
function Logo() {
  return (
    <svg className="logo" viewBox="0 0 36 32" width="36" height="32" aria-hidden="true">
      <rect x="1.5" y="1.5" width="33" height="25" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="27" x2="6" y2="31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="27" x2="30" y2="31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="6.5" width="10" height="11" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8.5" y1="11" x2="13.5" y2="11" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8.5" y1="14" x2="12.5" y2="14" stroke="currentColor" strokeWidth="1.2" />
      <rect x="19.5" y="8.5" width="10" height="8" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
      <line x1="22" y1="12.5" x2="27" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
      <rect x="11" y="19.5" width="13" height="3.5" fill="currentColor" opacity="0.3" />
      <circle cx="11" cy="6.5" r="1.9" fill="#fbbc04" />
      <circle cx="24.5" cy="8.5" r="1.9" fill="#fbbc04" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* App shell                                                           */
/* ------------------------------------------------------------------ */
const ROLES = [
  { id: 'manager', label: 'Overview' },
  { id: 'hr', label: 'People' },
  { id: 'trainee', label: 'Trainee view' },
]

export default function App() {
  const [role, setRole] = useState('manager')
  const [data, setData] = useState({ cohorts: [], trainees: [], plans: [], notices: [] })
  const [flash, setFlash] = useState(null)
  const [traineeId, setTraineeId] = useState('')

  const say = useCallback((type, text) => {
    setFlash({ type, text })
    setTimeout(() => setFlash((f) => (f?.text === text ? null : f)), type === 'error' ? 7000 : 3500)
  }, [])

  const reload = useCallback(async () => {
    try {
      const [cohorts, trainees, plans, notices] = await Promise.all([
        api('/cohorts'), api('/trainees'), api('/plans'), api('/notices'),
      ])
      setData({ cohorts, trainees, plans, notices })
    } catch (err) { say('error', err.message) }
  }, [say])

  useEffect(() => { reload() }, [reload])

  return (
    <div className="app">
      <header className="appbar">
        <div className="brand">
          <Logo />
          <span className="brand-name">Training Tracker</span>
        </div>
        <nav className="tabs" aria-label="Sections">
          {ROLES.map((r) => (
            <button key={r.id} className={role === r.id ? 'active' : ''} aria-current={role === r.id ? 'page' : undefined} onClick={() => setRole(r.id)}>{r.label}</button>
          ))}
        </nav>
        <div className="appbar-end" />
      </header>

      <main>
        {role === 'hr' && <HRView data={data} reload={reload} say={say} />}
        {role === 'manager' && <ManagerView data={data} reload={reload} say={say} />}
        {role === 'trainee' && <TraineeView data={data} say={say} traineeId={traineeId} setTraineeId={setTraineeId} />}
      </main>

      <Toast flash={flash} onClose={() => setFlash(null)} />
    </div>
  )
}
