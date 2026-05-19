import React, { useState } from 'react'
import { Flame, Star, Brain, MoreHorizontal, CheckCircle, ChevronRight, Settings, Play } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'

const weeklyData = [
  { day: 'Mon', val: 60 }, { day: 'Tue', val: 80 }, { day: 'Wed', val: 100 },
  { day: 'Thu', val: 70 }, { day: 'Fri', val: 90 }, { day: 'Sat', val: 50 }, { day: 'Sun', val: 80 },
]

const trendData = [
  { date: 'May 1', val: 50 }, { date: 'May 8', val: 60 }, { date: 'May 15', val: 70 },
  { date: 'May 22', val: 75 }, { date: 'May 29', val: 82 },
]

const MAY = [
  [null, null, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, null, null],
]

function CircularProgress({ percent, size = 130, stroke = 10 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f0f0f0" strokeWidth={stroke} />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none" stroke="#111" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}
      />
    </svg>
  )
}

export default function Dashboard({ habits, onNavigate }) {
  const [completedHabits, setCompletedHabits] = useState(
    habits.filter(h => h.status === 'Completed').map(h => h.id)
  )

  const toggleHabit = (id) => {
    setCompletedHabits(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const completed = completedHabits.length
  const total = habits.length

  return (
    <div className="page-area">
      <div className="page-scroll">
        {/* Today's Progress */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Today's Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress percent={78} size={130} stroke={10} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800 }}>78%</div>
                <div style={{ fontSize: 11, color: '#888' }}>Great job! 👋</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 28, flex: 1 }}>
              {[
                { icon: <CheckCircle size={20} color="#111" />, value: `${completed} / ${total}`, label: 'Habits Completed', sub: '↑ 1 from yesterday' },
                { icon: <Flame size={20} color="#f59e0b" fill="#f59e0b" />, value: '12', label: 'Current Streak', sub: 'Keep it up!' },
                { icon: <Star size={20} color="#111" />, value: '18', label: 'Best Streak', sub: 'May 3, 2024' },
                { icon: <Brain size={20} color="#111" />, value: '86', label: 'Focus Score', sub: 'High focus day!' },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ width: 42, height: 42, border: '1.5px solid #e5e7eb', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                    {stat.icon}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</div>
                  <div style={{ fontSize: 11.5, color: '#555', marginTop: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Today's Habits */}
        <div style={{ marginBottom: 18 }}>
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="section-title">Today's Habits</span>
              <div style={{ display: 'flex', gap: 6 }}>
                {['All Habits', 'Morning', 'Afternoon', 'Evening'].map((f, i) => (
                  <button key={f} className={`filter-btn ${i === 0 ? 'active' : ''}`} style={{ padding: '4px 12px', fontSize: 12 }}>{f}</button>
                ))}
              </div>
            </div>
            <button className="icon-btn"><Settings size={14} /></button>
          </div>
          <div className="habits-grid">
            {habits.map(habit => {
              const done = completedHabits.includes(habit.id)
              return (
                <div key={habit.id} className="habit-card">
                  <div className="habit-card-header">
                    <div className="habit-icon" style={{ fontSize: 18 }}>{habit.icon}</div>
                    <div className="habit-card-info">
                      <div className="habit-card-name">{habit.name}</div>
                      <div style={{ fontSize: 12, color: '#888' }}>{habit.target} {habit.unit}</div>
                    </div>
                    <button
                      className={`complete-circle ${done ? 'done' : ''}`}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      {done && <CheckCircle size={14} />}
                    </button>
                  </div>

                  <div className="habit-progress-row">
                    <span className="habit-progress-value">{habit.current} / {habit.target}</span>
                    <span className="habit-progress-pct">{habit.percent}%</span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${habit.percent}%` }} />
                  </div>

                  <div className="habit-card-footer">
                    <span style={{ flex: 1, fontSize: 11, color: '#999' }}>Today {habit.reminder}</span>
                    <button className="icon-btn"><MoreHorizontal size={13} /></button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          {/* Weekly Overview */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: 10 }}>
              <span className="section-title">Weekly Overview</span>
              <select className="form-select" style={{ width: 'auto', fontSize: 11, padding: '3px 22px 3px 8px' }}>
                <option>This Week</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklyData} barSize={20}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="val" fill="#111" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Completion Rate */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Completion Rate</div>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress percent={82} size={110} stroke={12} />
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>82%</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Average completion</div>
            <div style={{ fontSize: 11.5, color: '#22c55e', marginTop: 2 }}>+12% vs last week</div>
          </div>

          {/* Productivity Trend */}
          <div className="card">
            <div className="section-header" style={{ marginBottom: 10 }}>
              <span className="section-title">Productivity Trend</span>
              <select className="form-select" style={{ width: 'auto', fontSize: 11, padding: '3px 22px 3px 8px' }}>
                <option>This Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }} />
                <Line type="monotone" dataKey="val" stroke="#111" strokeWidth={2} dot={{ fill: '#111', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ width: 270, minWidth: 270, borderLeft: '1px solid #e3e6ee', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {/* Monthly Goals */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-title">Monthly Goals</span>
              <button className="view-all-btn">View all</button>
            </div>
            {[
              { icon: '🏃', name: 'Exercise 20 times', current: 16, target: 20 },
              { icon: '📚', name: 'Read 10 books', current: 6, target: 10 },
              { icon: '🧘', name: 'Meditate 15 times', current: 12, target: 15 },
            ].map((g, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14 }}>{g.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>{g.name}</span>
                  <span style={{ fontSize: 11, color: '#888' }}>{g.current} / {g.target}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${(g.current/g.target)*100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Mini Calendar */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-title">Calendar</span>
              <span style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
                May 2024
                <ChevronRight size={12} />
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
              {['M','T','W','T','F','S','S'].map((d, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 10, color: '#9ca3af', fontWeight: 600, paddingBottom: 4 }}>{d}</div>
              ))}
              {MAY.flat().map((day, i) => (
                <div key={i} style={{
                  textAlign: 'center',
                  padding: '3px 0',
                  fontSize: 11.5,
                  fontWeight: day === 15 ? 700 : 400,
                  color: day ? '#111' : 'transparent',
                  borderRadius: '50%',
                  background: day === 15 ? '#111' : 'transparent',
                  color: day === 15 ? '#fff' : day ? '#111' : 'transparent',
                  cursor: day ? 'pointer' : 'default',
                  width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                }}>
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Streak Summary */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-header">
              <span className="section-title">Streak Summary</span>
              <button className="view-all-btn">View stats</button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 50, height: 50, background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={22} color="#f59e0b" fill="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>12</div>
                <div style={{ fontSize: 11, color: '#888' }}>Current Streak</div>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>18</div>
                <div style={{ fontSize: 11, color: '#888' }}>Best Streak</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>32</div>
                <div style={{ fontSize: 11, color: '#888' }}>Total Days Active</div>
              </div>
            </div>
          </div>

          {/* Focus Timer */}
          <div>
            <div className="section-header">
              <span className="section-title">Focus Timer</span>
              <span style={{ fontSize: 11, color: '#888' }}>Pomodoro</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 28, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>25:00</div>
                <div style={{ fontSize: 11.5, color: '#888' }}>Focus time</div>
              </div>
              <button
                style={{ width: 44, height: 44, borderRadius: '50%', background: '#111', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                onClick={() => {}}
              >
                <Play size={16} fill="#fff" />
              </button>
              <button className="icon-btn"><Settings size={14} /></button>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: 11.5, color: '#888' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="radio" name="timer" defaultChecked style={{ accentColor: '#111' }} /> Focus
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="radio" name="timer" style={{ accentColor: '#111' }} /> Short Break
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                <input type="radio" name="timer" style={{ accentColor: '#111' }} /> Long Break
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
