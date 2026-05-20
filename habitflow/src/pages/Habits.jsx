import React, { useState } from 'react'
import { MoreHorizontal, CheckCircle, X, Clock, Timer, AlarmClock } from 'lucide-react'

const CATEGORIES = ['All Categories', 'Health', 'Mindfulness', 'Learning', 'Productivity']

export default function Habits({ habits, setHabits, search, showPanel, setShowPanel }) {
  const [filterStatus, setFilterStatus] = useState('All Habits')
  const [filterFreq, setFilterFreq] = useState('Daily')
  const [filterCat, setFilterCat] = useState('All Categories')
  const [editHabit, setEditHabit] = useState(null)
  const [form, setForm] = useState({
    name: '', type: 'Count', target: '', unit: 'glasses', repeat: 'Daily',
    reminder: '12:00 PM', duration: '2 hours', category: 'Health', notes: ''
  })
  const [panelTab, setPanelTab] = useState('Create Habit')

  const filtered = habits.filter(h => {
    const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'All Habits' || h.status === filterStatus
    const matchCat = filterCat === 'All Categories' || h.category === filterCat
    return matchSearch && matchStatus && matchCat
  })

  const openCreate = () => {
    setEditHabit(null)
    setPanelTab('Create Habit')
    setForm({ name: '', type: 'Count', target: '', unit: 'glasses', repeat: 'Daily', reminder: '12:00 PM', duration: '2 hours', category: 'Health', notes: '' })
    setShowPanel(true)
  }

  const openEdit = (h) => {
    setEditHabit(h)
    setPanelTab('Edit Habit')
    setForm({ ...h })
    setShowPanel(true)
  }

  const saveHabit = () => {
    if (!form.name) return
    if (editHabit) {
      setHabits(prev => prev.map(h => h.id === editHabit.id ? { ...h, ...form } : h))
    } else {
      const newH = { ...form, id: Date.now(), current: 0, percent: 0, status: 'Active', icon: '✨' }
      setHabits(prev => [...prev, newH])
    }
    setShowPanel(false)
  }

  const deleteHabit = () => {
    if (!editHabit) return
    setHabits(prev => prev.filter(h => h.id !== editHabit.id))
    setShowPanel(false)
  }

  const updateProgress = (id, delta) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const next = Math.max(0, Math.min(h.target, h.current + delta))
      const pct = Math.round((next / h.target) * 100)
      return { ...h, current: next, percent: pct, status: pct >= 100 ? 'Completed' : h.status }
    }))
  }

  return (
    <div className="page-area">
      <div className="page-scroll">
        {/* Stats */}
        <div className="stat-cards">
          {[
            { icon: '📋', label: 'Total Habits', value: habits.length, sub: 'All time' },
            { icon: '✅', label: 'Active Habits', value: habits.filter(h => h.status === 'Active').length, sub: 'Currently tracking' },
            { icon: '🎯', label: 'Completed Today', value: habits.filter(h => h.status === 'Completed').length, sub: 'Great progress!' },
            { icon: '🔥', label: 'Longest Streak', value: 18, sub: 'May 3, 2024' },
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
          {['All Habits', 'Active', 'Completed', 'Archived'].map(f => (
            <button key={f} className={`filter-btn ${filterStatus === f ? 'active-count' : ''}`} onClick={() => setFilterStatus(f)}>
              {f} {f === 'All Habits' ? habits.length : f === 'Active' ? habits.filter(h => h.status === 'Active').length : ''}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {['Daily', 'Weekly', 'Custom'].map(f => (
              <button key={f} className={`filter-btn ${filterFreq === f ? 'active' : ''}`} onClick={() => setFilterFreq(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="filter-bar">
          {CATEGORIES.map(cat => (
            <button key={cat} className={`filter-btn ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>
              {cat}
            </button>
          ))}
          <button className="filter-btn">+ Add Category</button>
        </div>

        {/* Habit Cards */}
        <div className="habits-grid">
          {filtered.map(habit => (
            <div key={habit.id} className="habit-card" onClick={() => openEdit(habit)}>
              <div className="habit-card-header">
                <div className="habit-icon" style={{ fontSize: 18 }}>{habit.icon}</div>
                <div className="habit-card-info">
                  <div className="habit-card-name">{habit.name}</div>
                  <div className="habit-card-meta">
                    <span>{habit.category}</span>
                    <span style={{ color: '#d1d5db' }}>•</span>
                    <span>{habit.type}</span>
                  </div>
                </div>
                <span className={`badge badge-${habit.status === 'Completed' ? 'completed' : habit.status === 'Upcoming' ? 'upcoming' : 'active'}`}>
                  <span className={`dot dot-${habit.status === 'Completed' ? 'blue' : habit.status === 'Upcoming' ? 'yellow' : 'green'}`} />
                  {habit.status}
                </span>
              </div>

              <div className="habit-progress-row">
                <span className="habit-progress-value">{habit.current} / {habit.target} {habit.unit}</span>
                <span className="habit-progress-pct">{habit.percent}%</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${habit.percent}%` }} />
              </div>

              <div className="habit-card-footer">
                <div className="habit-card-footer-item"><Clock size={11} /> {habit.reminder}</div>
                <div className="habit-card-footer-item"><Timer size={11} /> {habit.duration}</div>
                <div className="habit-card-footer-item"><AlarmClock size={11} /> {habit.activeWindow}</div>
                <button className="icon-btn" onClick={e => { e.stopPropagation(); openEdit(habit) }}><MoreHorizontal size={13} /></button>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 10 }} onClick={e => e.stopPropagation()}>
                <button className="filter-btn" style={{ fontSize: 12, padding: '3px 10px' }} onClick={() => updateProgress(habit.id, -1)}>−</button>
                <button className="filter-btn" style={{ fontSize: 12, padding: '3px 10px' }} onClick={() => updateProgress(habit.id, 1)}>+</button>
              </div>
            </div>
          ))}

          <div className="habit-card" style={{ borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }} onClick={openCreate}>
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>+</div>
              <div style={{ fontSize: 13 }}>Add New Habit</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      {showPanel && (
        <div className="right-panel">
          <div className="right-panel-header">
            <span className="right-panel-title">Habit Details</span>
            <button className="close-btn" onClick={() => setShowPanel(false)}><X size={14} /></button>
          </div>
          <div className="right-panel-body">
            <div className="panel-tabs">
              {['Create Habit', 'Edit Habit'].map(t => (
                <button key={t} className={`panel-tab ${panelTab === t ? 'active' : ''}`} onClick={() => setPanelTab(t)}>{t}</button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label">Habit Name</label>
              <input className="form-input" placeholder="e.g. Drink Water" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Goal Type</label>
              <div className="type-btns">
                {['Count', 'Timer', 'Yes/No', 'Custom'].map(t => (
                  <button key={t} className={`type-btn ${form.type === t ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, type: t }))}>{t}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Target</label>
                <input className="form-input" type="number" placeholder="e.g. 8" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <input className="form-input" placeholder="glasses" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Repeat</label>
              <select className="form-select" value={form.repeat} onChange={e => setForm(f => ({ ...f, repeat: e.target.value }))}>
                <option>Daily</option>
                <option>Weekly</option>
                <option>Custom</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Reminder</label>
                <input className="form-input" placeholder="12:00 PM" value={form.reminder} onChange={e => setForm(f => ({ ...f, reminder: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Duration</label>
                <select className="form-select" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                  {['30 min', '1 hour', '2 hours', '3 hours', '4 hours'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Active Window</label>
              <div className="form-input" style={{ background: '#f9fafb', color: '#888' }}>
                {form.reminder || '12:00 PM'} – auto calculated
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Time you have to complete this habit.</div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {['Health', 'Mindfulness', 'Learning', 'Productivity', 'Fitness'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea className="form-textarea" placeholder="Add notes about this habit..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <button className="save-btn" onClick={saveHabit}>Save Habit</button>
            {editHabit && (
              <button className="delete-btn" onClick={deleteHabit}>
                🗑 Delete Habit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
