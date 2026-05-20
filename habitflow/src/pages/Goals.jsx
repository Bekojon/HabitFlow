import React, { useState } from 'react'
import { MoreHorizontal, X, Calendar, Clock, CheckCircle } from 'lucide-react'

const CAT_FILTERS = ['All Categories', 'Health', 'Learning', 'Productivity', 'Fitness', 'Finance', 'Mindfulness']

export default function Goals({ goals, setGoals, search, showPanel, setShowPanel }) {
  const [filterStatus, setFilterStatus] = useState('All Goals')
  const [filterTime, setFilterTime] = useState('Weekly')
  const [filterCat, setFilterCat] = useState('All Categories')
  const [editGoal, setEditGoal] = useState(null)
  const [panelTab, setPanelTab] = useState('Create Goal')
  const [form, setForm] = useState({
    name: '', type: 'Count', target: '', unit: '', startDate: 'May 13, 2024',
    deadline: 'Jul 31, 2024', reminder: '8:00 PM', category: 'Health', notes: '',
    milestones: [25, 50, 75, 100]
  })

  const filtered = goals.filter(g => {
    const matchSearch = !search || g.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All Goals' || g.status === filterStatus || (filterStatus === 'Archived' && g.status === 'Archived')
    const matchCat = filterCat === 'All Categories' || g.category === filterCat
    return matchSearch && matchStatus && matchCat
  })

  const openCreate = () => {
    setEditGoal(null); setPanelTab('Create Goal')
    setForm({ name: '', type: 'Count', target: '', unit: '', startDate: 'May 13, 2024', deadline: 'Jul 31, 2024', reminder: '8:00 PM', category: 'Health', notes: '', milestones: [25, 50, 75, 100] })
    setShowPanel(true)
  }

  const openEdit = (g) => {
    setEditGoal(g); setPanelTab('Edit Goal')
    setForm({ ...g })
    setShowPanel(true)
  }

  const saveGoal = () => {
    if (!form.name) return
    if (editGoal) {
      setGoals(prev => prev.map(g => g.id === editGoal.id ? { ...g, ...form } : g))
    } else {
      setGoals(prev => [...prev, { ...form, id: Date.now(), current: 0, status: 'Active', icon: '🎯', reached: [] }])
    }
    setShowPanel(false)
  }

  const deleteGoal = () => {
    if (!editGoal) return
    setGoals(prev => prev.filter(g => g.id !== editGoal.id))
    setShowPanel(false)
  }

  const toggleMilestone = (goalId, ms) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g
      const reached = g.reached.includes(ms) ? g.reached.filter(r => r !== ms) : [...g.reached, ms]
      const pct = reached.length ? Math.max(...reached) : 0
      const current = Math.round((pct / 100) * g.target)
      return { ...g, reached, current }
    }))
  }

  const statusColor = (s) => s === 'Active' ? 'active' : s === 'Completed' ? 'completed' : s === 'At Risk' ? 'atrisk' : 'upcoming'

  return (
    <div className="page-area">
      <div className="page-scroll">
        {/* Stats */}
        <div className="stat-cards">
          {[
            { icon: '🎯', label: 'Total Goals', value: goals.length, sub: 'All time' },
            { icon: '✅', label: 'Active Goals', value: goals.filter(g => g.status === 'Active' || g.status === 'At Risk').length, sub: 'Currently tracking' },
            { icon: '🏆', label: 'Completed Goals', value: goals.filter(g => g.status === 'Completed').length, sub: 'Great progress!' },
            { icon: '🔥', label: 'Longest Goal Streak', value: 38, sub: 'May 3, 2024' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-icon">{s.icon}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="filter-bar">
          {['All Goals', 'Active', 'Completed', 'Archived'].map(f => (
            <button key={f} className={`filter-btn ${filterStatus === f ? 'active-count' : ''}`} onClick={() => setFilterStatus(f)}>
              {f} {f === 'All Goals' ? goals.length : f === 'Active' ? goals.filter(g => g.status === 'Active').length : f === 'Completed' ? goals.filter(g => g.status === 'Completed').length : 5}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['Weekly', 'Monthly', 'Quarterly', 'Yearly'].map(f => (
              <button key={f} className={`filter-btn ${filterTime === f ? 'active' : ''}`} onClick={() => setFilterTime(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="filter-bar">
          {CAT_FILTERS.map(cat => (
            <button key={cat} className={`filter-btn ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>{cat}</button>
          ))}
        </div>

        {/* Goal Cards */}
        <div className="goals-grid">
          {filtered.map(goal => {
            const pct = Math.round((goal.current / goal.target) * 100) || 0
            return (
              <div key={goal.id} className="goal-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div className="habit-icon" style={{ fontSize: 18 }}>{goal.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{goal.name}</div>
                    <div style={{ fontSize: 12, color: '#888' }}>{goal.category}</div>
                  </div>
                  <span className={`badge badge-${statusColor(goal.status)}`}>
                    <span className={`dot dot-${goal.status === 'Completed' ? 'blue' : goal.status === 'At Risk' ? 'red' : goal.status === 'Upcoming' ? 'yellow' : 'green'}`} />
                    {goal.status}
                  </span>
                </div>

                <div className="progress-bar-wrap" style={{ height: 6 }}>
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                  {goal.current === goal.target && goal.unit === 'sessions'
                    ? `${goal.current} / ${goal.target} ${goal.unit}`
                    : goal.unit === 'USD'
                    ? `$${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}`
                    : `${goal.current} / ${goal.target} ${goal.unit}`}
                </div>

                <div style={{ display: 'flex', gap: 14, fontSize: 11.5, color: '#888', marginBottom: 10 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {goal.deadline ? `Due: ${goal.deadline}` : `Starts: ${goal.startDate}`}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> Reminder: {goal.reminder}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {goal.milestones.map(ms => (
                    <button key={ms} className={`milestone-btn ${goal.reached.includes(ms) ? 'reached' : ''}`} onClick={() => toggleMilestone(goal.id, ms)}>
                      {goal.reached.includes(ms) && <CheckCircle size={10} />} {ms}%
                    </button>
                  ))}
                  <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={() => openEdit(goal)}><MoreHorizontal size={14} /></button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Panel */}
      {showPanel && (
        <div className="right-panel">
          <div className="right-panel-header">
            <span className="right-panel-title">Goal Details</span>
            <button className="close-btn" onClick={() => setShowPanel(false)}><X size={14} /></button>
          </div>
          <div className="right-panel-body">
            <div className="panel-tabs">
              {['Create Goal', 'Edit Goal'].map(t => (
                <button key={t} className={`panel-tab ${panelTab === t ? 'active' : ''}`} onClick={() => setPanelTab(t)}>{t}</button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Goal Name</label>
              <input className="form-input" placeholder="e.g. Run a Half Marathon" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Goal Type</label>
              <div className="type-btns">
                {['Count', 'Amount', 'Yes/No', 'Custom'].map(t => (
                  <button key={t} className={`type-btn ${form.type === t ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, type: t }))}>{t}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Target</label>
                <input className="form-input" type="number" placeholder="e.g. 10" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Time Frame</label>
                <select className="form-select" value={form.timeFrame} onChange={e => setForm(f => ({ ...f, timeFrame: e.target.value }))}>
                  <option>Custom</option><option>Weekly</option><option>Monthly</option><option>Yearly</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input className="form-input" placeholder="May 13, 2024" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input className="form-input" placeholder="Jul 31, 2024" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reminder</label>
              <input className="form-input" placeholder="8:00 PM" value={form.reminder} onChange={e => setForm(f => ({ ...f, reminder: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Health', 'Learning', 'Productivity', 'Fitness', 'Finance', 'Mindfulness'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Milestones</label>
              <div className="milestone-row">
                {(form.milestones || [25, 50, 75, 100]).map(ms => (
                  <div key={ms} className="milestone-tag">
                    {ms}%
                    <button onClick={() => setForm(f => ({ ...f, milestones: f.milestones.filter(m => m !== ms) }))}>×</button>
                  </div>
                ))}
                <button className="filter-btn" style={{ fontSize: 11 }} onClick={() => setForm(f => ({ ...f, milestones: [...(f.milestones || []), 90] }))}>+ Add</button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea className="form-textarea" placeholder="Add notes about this goal..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <button className="save-btn" onClick={saveGoal}>Save Goal</button>
            {editGoal && (
              <button className="delete-btn" onClick={deleteGoal}>🗑 Delete Goal</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
