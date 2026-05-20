import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, X, Clock, Timer, AlarmClock, Star } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function buildMonth(year, month) {
  const first = new Date(year, month, 1).getDay()
  const days = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < first; i++) cells.push({ day: null, month: month - 1 })
  for (let d = 1; d <= days; d++) cells.push({ day: d, month })
  while (cells.length % 7 !== 0) cells.push({ day: null, month: month + 1 })
  return cells
}

export default function CalendarPage({ habits, showPanel, setShowPanel }) {
  const [selectedDay, setSelectedDay] = useState(15)
  const [viewMode, setViewMode] = useState('Month')
  const [filter, setFilter] = useState('All')
  const [dailyNote, setDailyNote] = useState('')
  const year = 2024, month = 4 // May 2024
  const cells = buildMonth(year, month)

  const habitDots = (day) => {
    if (!day) return []
    return habits.slice(0, Math.min(habits.length, 4 + (day % 3)))
  }

  return (
    <div className="page-area">
      <div className="page-scroll">
        {/* Stats */}
        <div className="stat-cards">
          {[
            { icon: '📅', label: 'Total Planned', value: 38, sub: 'This week' },
            { icon: '✅', label: 'Completed This Week', value: 26, sub: '68% completion' },
            { icon: '❌', label: 'Missed This Week', value: 6, sub: '16% missed' },
            { icon: '⭐', label: 'Best Day This Week', value: 'May 14', sub: '8 of 8 completed' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-icon">{s.icon}</div>
              <div className="stat-card-value" style={{ fontSize: i === 3 ? 20 : 26 }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Calendar Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <div className="seg-control">
              {['Month', 'Week', 'Day'].map(m => (
                <button key={m} className={`seg-btn ${viewMode === m ? 'active' : ''}`} onClick={() => setViewMode(m)}>{m}</button>
              ))}
            </div>
            <div className="seg-control">
              {['All', 'Completed', 'Active', 'Missed'].map(f => (
                <button key={f} className={`seg-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="icon-btn"><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 14, fontWeight: 600 }}>May 2024</span>
            <button className="icon-btn"><ChevronRight size={16} /></button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
          <div className="calendar-grid">
            {DAYS.map(d => (
              <div key={d} className="calendar-day-header">{d}</div>
            ))}
            {cells.map((cell, i) => {
              const dots = habitDots(cell.day)
              const isToday = cell.day === 15 && cell.month === month
              const isSelected = cell.day === selectedDay && cell.month === month
              return (
                <div
                  key={i}
                  className={`calendar-day ${!cell.day ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => cell.day && setSelectedDay(cell.day)}
                >
                  <div className="day-num">
                    {isToday ? (
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 700 }}>{cell.day}</span>
                    ) : cell.day}
                  </div>
                  {cell.day === 14 && <Star size={10} color="#f59e0b" fill="#f59e0b" style={{ position: 'absolute', top: 6, right: 8 }} />}
                  <div className="day-dots">
                    {dots.slice(0, 4).map((_, j) => (
                      <div key={j} className={`day-dot ${j >= 2 ? 'empty' : ''}`} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
          {[
            {
              title: 'Completion Rate',
              content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width={70} height={70} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={35} cy={35} r={28} fill="none" stroke="#f0f0f0" strokeWidth={7} />
                      <circle cx={35} cy={35} r={28} fill="none" stroke="#111" strokeWidth={7} strokeDasharray={175.9} strokeDashoffset={175.9 * 0.32} strokeLinecap="round" />
                    </svg>
                    <span style={{ position: 'absolute', fontSize: 14, fontWeight: 800 }}>68%</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#888' }}>This Month</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>26 of 38 planned</div>
                  </div>
                </div>
              )
            },
            {
              title: 'Current Streak',
              content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 28, fontWeight: 800 }}>12</div>
                  <div style={{ fontSize: 13, color: '#888' }}>days<br/><span style={{ fontSize: 11 }}>Keep it going!</span></div>
                </div>
              )
            },
            {
              title: 'Best Week',
              content: (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>May 12 – May 18</div>
                  <div style={{ fontSize: 12, color: '#888' }}>80% completion</div>
                </div>
              )
            },
            {
              title: 'Habit Consistency',
              content: (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>Great</div>
                    <div style={{ fontSize: 11, color: '#888' }}>You're building strong habits!</div>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}>
                    <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
                      <circle cx={30} cy={30} r={24} fill="none" stroke="#f0f0f0" strokeWidth={6} />
                      <circle cx={30} cy={30} r={24} fill="none" stroke="#111" strokeWidth={6} strokeDasharray={150.8} strokeDashoffset={150.8 * 0.28} strokeLinecap="round" />
                    </svg>
                    <span style={{ position: 'absolute', fontSize: 12, fontWeight: 800 }}>72%</span>
                  </div>
                </div>
              )
            }
          ].map((card, i) => (
            <div key={i} className="card">
              <div style={{ fontSize: 12, fontWeight: 700, color: '#888', marginBottom: 10 }}>{card.title}</div>
              {card.content}
            </div>
          ))}
        </div>
      </div>

      {/* Day Details Panel */}
      <div className="right-panel">
        <div className="right-panel-header">
          <span className="right-panel-title">Day Details</span>
          <button className="close-btn"><X size={14} /></button>
        </div>
        <div className="right-panel-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, background: '#f3f4f6', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📅</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>May {selectedDay}, 2024</div>
              <div style={{ fontSize: 12, color: '#888' }}>Wednesday</div>
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 4 }}>
              <span>Progress</span>
              <span>3 of 6 completed &nbsp; 50%</span>
            </div>
            <div className="progress-bar-wrap" style={{ height: 6 }}>
              <div className="progress-bar-fill" style={{ width: '50%' }} />
            </div>
          </div>

          {habits.slice(0, 5).map((h, i) => {
            const statuses = ['Active', 'Completed', 'Completed', 'Upcoming', 'Scheduled']
            const status = statuses[i % statuses.length]
            return (
              <div key={h.id} style={{ padding: '10px 0', borderBottom: '1px solid #f5f6fa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{ width: 32, height: 32, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{h.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{h.name}</div>
                  </div>
                  <span className={`badge badge-${status === 'Completed' ? 'completed' : status === 'Active' ? 'active' : status === 'Upcoming' ? 'upcoming' : 'upcoming'}`}>
                    <span className={`dot dot-${status === 'Completed' ? 'blue' : status === 'Active' ? 'green' : 'yellow'}`} />
                    {status}
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#888', display: 'flex', gap: 12, paddingLeft: 42 }}>
                  <span><Clock size={10} style={{ display: 'inline', marginRight: 3 }} />{h.reminder}</span>
                  <span><Timer size={10} style={{ display: 'inline', marginRight: 3 }} />{h.duration}</span>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', paddingLeft: 42, marginTop: 2 }}>
                  Active Window {h.activeWindow}
                </div>
              </div>
            )
          })}

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#888', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              📝 Daily Notes
            </div>
            <textarea
              className="form-textarea"
              placeholder="Add notes about this day..."
              style={{ minHeight: 80 }}
              value={dailyNote}
              onChange={e => setDailyNote(e.target.value)}
            />
            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Notes are private and only visible to you.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
