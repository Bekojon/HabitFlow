import React, { useState } from 'react'
import { X, ChevronRight } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const perfData = [
  { date: 'May 1', val: 45 }, { date: 'May 6', val: 55 }, { date: 'May 11', val: 60 },
  { date: 'May 16', val: 70 }, { date: 'May 21', val: 82 }, { date: 'May 26', val: 78 }, { date: 'May 31', val: 85 },
]

const weeklyData = [
  { day: 'Mon', val: 60 }, { day: 'Tue', val: 78 }, { day: 'Wed', val: 92 },
  { day: 'Thu', val: 85 }, { day: 'Fri', val: 70 }, { day: 'Sat', val: 45 }, { day: 'Sun', val: 66 },
]

function CircProgress({ pct, size = 80, sw = 9 }) {
  const r = (size - sw * 2) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={sw} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#111" strokeWidth={sw}
        strokeDasharray={c} strokeDashoffset={c - (pct/100) * c} strokeLinecap="round" />
    </svg>
  )
}

export default function Analytics({ habits, showPanel, setShowPanel }) {
  const [timeRange, setTimeRange] = useState('Monthly')
  const [category, setCategory] = useState('All Categories')

  // Heatmap data: 7 rows x 30 cols
  const heatmap = Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 30 }, (_, col) => {
      const v = Math.random()
      return v > 0.8 ? 'high' : v > 0.5 ? 'med' : v > 0.2 ? 'low' : 'miss'
    })
  )

  return (
    <div className="page-area">
      <div className="page-scroll">
        {/* Stats */}
        <div className="stat-cards">
          {[
            { icon: '📊', label: 'Overall Completion Rate', value: '82%', sub: '↑ +12% vs last month' },
            { icon: '✅', label: 'Active Habits', value: 12, sub: 'Currently tracking' },
            { icon: '🔥', label: 'Best Streak', value: '34 days', sub: 'Achieved on Apr 12, 2024' },
            { icon: '🎯', label: 'Goal Completion', value: '64%', sub: '7 of 11 goals completed' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-icon">{s.icon}</div>
              <div className="stat-card-value" style={{ fontSize: 24 }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 }}>
          <div className="card">
            <div className="section-header" style={{ marginBottom: 10 }}>
              <span className="section-title">Performance Overview</span>
              <select className="form-select" style={{ width: 'auto', fontSize: 11, padding: '3px 22px 3px 8px' }}><option>This Month</option></select>
            </div>
            <div style={{ fontSize: 11.5, color: '#888', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 24, height: 2, background: '#111', display: 'inline-block' }} /> Completion Rate (%)
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={perfData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} width={35} />
                <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Line type="monotone" dataKey="val" stroke="#111" strokeWidth={2} dot={{ fill: '#111', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="section-header" style={{ marginBottom: 10 }}>
              <span className="section-title">Weekly Completion</span>
              <select className="form-select" style={{ width: 'auto', fontSize: 11, padding: '3px 22px 3px 8px' }}><option>This Week</option></select>
            </div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={weeklyData} barSize={22}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickFormatter={v => `${v}%`} axisLine={false} tickLine={false} width={32} />
                <Bar dataKey="val" fill="#111" radius={[4, 4, 0, 0]}>
                  {weeklyData.map((d, i) => <Cell key={i} fill={d.val >= 85 ? '#111' : '#d1d5db'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
          {/* Habit Consistency */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircProgress pct={72} size={90} sw={10} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>72%</div>
                <div style={{ fontSize: 9, color: '#888' }}>Consistent</div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Habit Consistency</div>
              <div style={{ fontSize: 12, color: '#888' }}>You're building strong habits!</div>
              <div style={{ fontSize: 11.5, color: '#22c55e', marginTop: 4 }}>↑ +8% vs last month</div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Category Breakdown</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <svg width={80} height={80} viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="30" fill="none" stroke="#e5e7eb" strokeWidth="20" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="#111" strokeWidth="20" strokeDasharray="188.5" strokeDashoffset="109" transform="rotate(-90 40 40)" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="#555" strokeWidth="20" strokeDasharray="188.5" strokeDashoffset="135" transform="rotate(-21 40 40)" />
                <circle cx="40" cy="40" r="30" fill="none" stroke="#999" strokeWidth="20" strokeDasharray="188.5" strokeDashoffset="151" transform="rotate(53 40 40)" />
                <circle cx="40" cy="40" r="20" fill="white" />
              </svg>
              <div style={{ fontSize: 12 }}>
                {[
                  { color: '#111', label: 'Health', pct: 42 },
                  { color: '#555', label: 'Learning', pct: 28 },
                  { color: '#999', label: 'Mindfulness', pct: 18 },
                  { color: '#ccc', label: 'Productivity', pct: 12 },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block' }} />
                    {c.label} <span style={{ color: '#9ca3af', marginLeft: 4 }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>Based on completion rate</div>
          </div>

          {/* Best Performing */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Best Performing Habits</span>
              <ChevronRight size={14} color="#9ca3af" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af', marginBottom: 6 }}>
              <span style={{ flex: 1 }}></span><span style={{ width: 60, textAlign: 'right' }}>Completion</span><span style={{ width: 60, textAlign: 'right' }}>Streak</span>
            </div>
            {[
              { icon: '💧', name: 'Drink Water', comp: '88%', streak: '18 days' },
              { icon: '📚', name: 'Reading', comp: '100%', streak: '32 days' },
              { icon: '🧘', name: 'Meditation', comp: '90%', streak: '15 days' },
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 0', borderBottom: '1px solid #f5f6fa' }}>
                <span style={{ fontSize: 14 }}>{h.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{h.name}</span>
                <span style={{ width: 60, textAlign: 'right', fontSize: 12, fontWeight: 600 }}>{h.comp}</span>
                <span style={{ width: 60, textAlign: 'right', fontSize: 12, color: '#888' }}>{h.streak}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 14 }}>
          {/* Needs Attention */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Needs Attention</span>
              <ChevronRight size={14} color="#9ca3af" />
            </div>
            {[
              { icon: '🌙', name: 'Sleep', comp: '38%', streak: '2 days' },
              { icon: '🎓', name: 'Study', comp: '42%', streak: '1 day' },
              { icon: '🚶', name: 'Walk', comp: '48%', streak: '3 days' },
            ].map((h, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{h.icon}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{h.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{h.comp}</span>
                  <span style={{ fontSize: 11, color: '#888' }}>{h.streak}</span>
                </div>
                <div className="progress-bar-wrap" style={{ height: 4 }}>
                  <div className="progress-bar-fill" style={{ width: h.comp, background: '#ef4444' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Time of Day */}
          <div className="card">
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Time of Day Performance</div>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
              {[
                { icon: '☀️', label: 'Morning', val: '81%', sub: 'Best time' },
                { icon: '🌤', label: 'Afternoon', val: '68%', sub: 'Good' },
                { icon: '🌙', label: 'Evening', val: '59%', sub: 'Needs work' },
              ].map((t, i) => (
                <div key={i}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{t.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 800 }}>{t.val}</div>
                  <div style={{ fontSize: 11.5, color: '#888' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{t.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Consistency Heatmap</span>
              <select className="form-select" style={{ width: 'auto', fontSize: 11, padding: '3px 22px 3px 8px' }}><option>Last 30 Days</option></select>
            </div>
            <div style={{ display: 'flex', gap: 4, marginBottom: 6, fontSize: 10, color: '#9ca3af' }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                <div key={d} style={{ flex: 1, textAlign: 'center' }}>{d}</div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gap: 2 }}>
              {Array.from({ length: 210 }, (_, i) => {
                const v = Math.random()
                const col = v > 0.7 ? '#111' : v > 0.4 ? '#555' : v > 0.15 ? '#bbb' : '#f0f0f0'
                return <div key={i} style={{ width: '100%', paddingBottom: '100%', background: col, borderRadius: 2 }} />
              })}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8, fontSize: 10, color: '#9ca3af', alignItems: 'center' }}>
              {[['#111','High (80-100%)'],['#555','Medium (50-79%)'],['#bbb','Low (20-49%)'],['#f0f0f0','Missed (0-19%)']].map(([c,l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 1, display: 'inline-block', border: '1px solid #e5e7eb' }} />{l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights Panel */}
      {showPanel && (
        <div className="right-panel">
          <div className="right-panel-header">
            <span className="right-panel-title">Insights</span>
            <button className="close-btn" onClick={() => setShowPanel(false)}><X size={14} /></button>
          </div>
          <div className="right-panel-body">
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Filters</div>

            <div className="form-group">
              <label className="form-label">Time Range</label>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                {['Weekly', 'Monthly', 'Yearly', 'All Time'].map(t => (
                  <button key={t} className={`filter-btn ${timeRange === t ? 'active' : ''}`} style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => setTimeRange(t)}>{t}</button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option>All Categories</option>
                <option>Health</option>
                <option>Learning</option>
                <option>Mindfulness</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Compare With</label>
              <select className="form-select">
                <option>Previous Month</option>
                <option>Previous Week</option>
              </select>
            </div>

            <div className="divider" />

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Key Insights</div>

            {[
              { icon: '📚', label: 'Most consistent habit', title: 'Reading', sub: '100% completion rate' },
              { icon: '⭐', label: 'Best day', title: 'Wednesday', sub: '92% average completion' },
              { icon: '🌙', label: 'Missed most often', title: 'Sleep', sub: '38% completion rate' },
            ].map((ins, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{ins.icon}</div>
                <div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{ins.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{ins.title}</div>
                  <div style={{ fontSize: 11.5, color: '#888' }}>{ins.sub}</div>
                </div>
              </div>
            ))}

            <div className="divider" />

            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Progress Summary</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircProgress pct={82} size={70} sw={8} />
                <div style={{ position: 'absolute', textAlign: 'center', fontSize: 12, fontWeight: 800 }}>82%</div>
              </div>
              <div style={{ fontSize: 12 }}>
                {[['Total Habits','12'],['Completed','246'],['Missed','54'],['Avg. per Day','8.2']].map(([l,v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 20, marginBottom: 3 }}>
                    <span style={{ color: '#888' }}>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#f9fafb', borderRadius: 10, padding: 12, fontSize: 12, color: '#555' }}>
              Great job! Your consistency improved by 12% compared to last month.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
