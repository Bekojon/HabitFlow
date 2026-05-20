import React, { useState, useRef, useEffect } from 'react'
import { Flame, Star, Brain, MoreHorizontal, CheckCircle, ChevronRight, ChevronLeft, Settings, Play, Edit2, Archive, Trash2, BarChart2, Timer } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'

const weeklyData = [
  { day: 'Mon', val: 60 }, { day: 'Tue', val: 80 }, { day: 'Wed', val: 100 },
  { day: 'Thu', val: 70 }, { day: 'Fri', val: 90 }, { day: 'Sat', val: 50 }, { day: 'Sun', val: 80 },
]
const trendData = [
  { date: 'May 1', val: 50 }, { date: 'May 8', val: 60 }, { date: 'May 15', val: 70 },
  { date: 'May 22', val: 75 }, { date: 'May 29', val: 82 },
]

const MAY_DAYS = [
  [null,null,1,2,3,4,5],[6,7,8,9,10,11,12],[13,14,15,16,17,18,19],
  [20,21,22,23,24,25,26],[27,28,29,30,31,null,null],
]

function CircularProgress({ percent, size = 130, stroke = 10 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (percent / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s' }}/>
    </svg>
  )
}

// Context menu component
function ContextMenu({ x, y, habit, onClose, onEdit, onNavigate }) {
  const ref = useRef(null)
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose() }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} className="context-menu" style={{ position:'fixed', top: Math.min(y, window.innerHeight - 200), left: Math.min(x, window.innerWidth - 180), zIndex:1000 }}>
      <button className="context-menu-item" onClick={() => { onEdit(habit); onClose() }}>
        <Edit2 size={13}/> Edit Habit
      </button>
      <button className="context-menu-item" onClick={() => { onNavigate('habits'); onClose() }}>
        <CheckCircle size={13}/> View All Habits
      </button>
      <button className="context-menu-item" onClick={() => { onNavigate('analytics'); onClose() }}>
        <BarChart2 size={13}/> View Analytics
      </button>
      <button className="context-menu-item" onClick={() => { onNavigate('focus'); onClose() }}>
        <Timer size={13}/> Focus Timer
      </button>
      <div style={{ height:1, background:'var(--border)', margin:'4px 0' }}/>
      <button className="context-menu-item" onClick={() => { onNavigate('calendar'); onClose() }}>
        <Archive size={13}/> View Calendar
      </button>
    </div>
  )
}

export default function Dashboard({ habits, setHabits, search, onNavigate }) {
  const [completed, setCompleted] = useState(
    habits.filter(h => h.status === 'Completed').map(h => h.id)
  )
  const [menu, setMenu] = useState(null) // { x, y, habit }
  const [calMonth, setCalMonth] = useState(4) // May = 4

  // Search filter
  const filtered = search
    ? habits.filter(h => h.name.toLowerCase().includes(search.toLowerCase()))
    : habits

  const toggleHabit = (id) => {
    setCompleted(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const done = !completed.includes(id)
      return { ...h, status: done ? 'Completed' : 'Active', percent: done ? 100 : h.percent }
    }))
  }

  const openMenu = (e, habit) => {
    e.stopPropagation()
    e.preventDefault()
    setMenu({ x: e.clientX, y: e.clientY, habit })
  }

  const completedCount = completed.length
  const total = habits.length

  return (
    <div className="page-area">
      {menu && (
        <ContextMenu
          x={menu.x} y={menu.y} habit={menu.habit}
          onClose={() => setMenu(null)}
          onEdit={() => onNavigate('habits')}
          onNavigate={onNavigate}
        />
      )}

      <div className="page-scroll">
        {/* Today's Progress */}
        <div className="card" style={{ marginBottom: 18 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Today's Progress</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress percent={Math.round((completedCount/total)*100) || 78} size={130} stroke={10}/>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 800, color:'var(--text-primary)' }}>{Math.round((completedCount/total)*100) || 78}%</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Great job! 👋</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 28, flex: 1 }}>
              {[
                { icon: <CheckCircle size={20} color="var(--accent)"/>, value: `${completedCount}/${total}`, label: 'Habits Completed', sub: '↑ 1 from yesterday', action: () => onNavigate('habits') },
                { icon: <Flame size={20} color="#f59e0b" fill="#f59e0b"/>, value: '12', label: 'Current Streak', sub: 'Keep it up!', action: () => onNavigate('analytics') },
                { icon: <Star size={20} color="var(--accent)"/>, value: '18', label: 'Best Streak', sub: 'May 3, 2024', action: () => onNavigate('analytics') },
                { icon: <Brain size={20} color="var(--accent)"/>, value: '86', label: 'Focus Score', sub: 'High focus day!', action: () => onNavigate('focus') },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center', flex: 1, cursor:'pointer' }} onClick={stat.action}>
                  <div style={{ width:42, height:42, border:'1.5px solid var(--border)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px' }}>{stat.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color:'var(--text-primary)' }}>{stat.value}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-secondary)', marginTop: 2 }}>{stat.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{stat.sub}</div>
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
              {search && <span style={{ fontSize:12, color:'var(--text-secondary)' }}>— {filtered.length} results for "{search}"</span>}
              <div style={{ display: 'flex', gap: 6 }}>
                {['All Habits', 'Morning', 'Afternoon', 'Evening'].map((f, i) => (
                  <button key={f} className={`filter-btn ${i === 0 ? 'active' : ''}`} style={{ padding: '4px 12px', fontSize: 12 }}
                    onClick={() => i === 0 ? onNavigate('habits') : onNavigate('habits')}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <button className="icon-btn" onClick={() => onNavigate('settings')}><Settings size={14}/></button>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text-secondary)', background:'var(--card-bg)', borderRadius:18, border:'1px solid var(--border)' }}>
              No habits match "{search}"
            </div>
          ) : (
            <div className="habits-grid">
              {filtered.map(habit => {
                const done = completed.includes(habit.id)
                return (
                  <div key={habit.id} className="habit-card" onClick={() => onNavigate('habits')}>
                    <div className="habit-card-header">
                      <div className="habit-icon" style={{ fontSize: 18 }}>{habit.icon}</div>
                      <div className="habit-card-info">
                        <div className="habit-card-name">{habit.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{habit.target} {habit.unit}</div>
                      </div>
                      <button className={`complete-circle ${done ? 'done' : ''}`}
                        onClick={e => { e.stopPropagation(); toggleHabit(habit.id) }}>
                        {done && <CheckCircle size={14}/>}
                      </button>
                    </div>
                    <div className="habit-progress-row">
                      <span className="habit-progress-value">{habit.current} / {habit.target}</span>
                      <span className="habit-progress-pct">{habit.percent}%</span>
                    </div>
                    <div className="progress-bar-wrap">
                      <div className="progress-bar-fill" style={{ width: `${habit.percent}%` }}/>
                    </div>
                    <div className="habit-card-footer">
                      <span style={{ flex: 1, fontSize: 11, color: 'var(--text-muted)' }}>{habit.reminder}</span>
                      <button className="icon-btn" onClick={e => openMenu(e, habit)}>
                        <MoreHorizontal size={13}/>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Bottom Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
          <div className="card" style={{ cursor:'pointer' }} onClick={() => onNavigate('analytics')}>
            <div className="section-header" style={{ marginBottom: 10 }}>
              <span className="section-title">Weekly Overview</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={weeklyData} barSize={20}>
                <XAxis dataKey="day" tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Bar dataKey="val" fill="var(--accent)" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer' }} onClick={() => onNavigate('analytics')}>
            <div className="section-title" style={{ marginBottom:12 }}>Completion Rate</div>
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CircularProgress percent={82} size={110} stroke={12}/>
              <div style={{ position:'absolute', textAlign:'center' }}>
                <div style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)' }}>82%</div>
              </div>
            </div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', marginTop:8 }}>Average completion</div>
            <div style={{ fontSize:11.5, color:'#22c55e', marginTop:2 }}>+12% vs last week</div>
          </div>

          <div className="card" style={{ cursor:'pointer' }} onClick={() => onNavigate('analytics')}>
            <div className="section-header" style={{ marginBottom: 10 }}>
              <span className="section-title">Productivity Trend</span>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0,100]}/>
                <Tooltip formatter={v => `${v}%`} contentStyle={{ fontSize:11, borderRadius:8, border:'1px solid var(--border)', background:'var(--card-bg)', color:'var(--text-primary)' }}/>
                <Line type="monotone" dataKey="val" stroke="var(--accent)" strokeWidth={2} dot={{ fill:'var(--accent)', r:3 }}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div style={{ width:270, minWidth:270, borderLeft:'1px solid var(--border)', background:'var(--card-bg)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1, overflowY:'auto', padding:16 }}>

          {/* Monthly Goals */}
          <div style={{ marginBottom:20 }}>
            <div className="section-header">
              <span className="section-title">Monthly Goals</span>
              <button className="view-all-btn" onClick={() => onNavigate('goals')}>View all →</button>
            </div>
            {[
              { icon:'🏃', name:'Exercise 20 times', current:16, target:20 },
              { icon:'📚', name:'Read 10 books', current:6, target:10 },
              { icon:'🧘', name:'Meditate 15 times', current:12, target:15 },
            ].map((g,i) => (
              <div key={i} style={{ marginBottom:12, cursor:'pointer' }} onClick={() => onNavigate('goals')}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:14 }}>{g.icon}</span>
                  <span style={{ fontSize:13, fontWeight:600, flex:1, color:'var(--text-primary)' }}>{g.name}</span>
                  <span style={{ fontSize:11, color:'var(--text-secondary)' }}>{g.current}/{g.target}</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width:`${Math.round(g.current/g.target*100)}%` }}/>
                </div>
              </div>
            ))}
          </div>

          {/* Mini Calendar */}
          <div style={{ marginBottom:20 }}>
            <div className="section-header">
              <span className="section-title">Calendar</span>
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                <button className="icon-btn" style={{ width:22, height:22 }} onClick={() => setCalMonth(m => m-1)}><ChevronLeft size={12}/></button>
                <span style={{ fontSize:12, color:'var(--text-secondary)', whiteSpace:'nowrap' }}>May 2024</span>
                <button className="icon-btn" style={{ width:22, height:22 }} onClick={() => setCalMonth(m => m+1)}><ChevronRight size={12}/></button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:1 }}>
              {['M','T','W','T','F','S','S'].map((d,i) => (
                <div key={i} style={{ textAlign:'center', fontSize:10, color:'var(--text-muted)', fontWeight:600, paddingBottom:4 }}>{d}</div>
              ))}
              {MAY_DAYS.flat().map((day, i) => (
                <div key={i}
                  style={{ textAlign:'center', fontSize:11.5, fontWeight: day===15?700:400, borderRadius:'50%', background: day===15?'var(--accent)':'transparent', color: day===15?'#fff': day?'var(--text-primary)':'transparent', cursor: day?'pointer':'default', width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto', transition:'all 0.1s' }}
                  onClick={() => day && onNavigate('calendar')}
                  onMouseEnter={e => { if(day && day!==15) e.currentTarget.style.background='var(--border)' }}
                  onMouseLeave={e => { if(day && day!==15) e.currentTarget.style.background='transparent' }}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>

          {/* Streak Summary */}
          <div style={{ marginBottom:20 }}>
            <div className="section-header">
              <span className="section-title">Streak Summary</span>
              <button className="view-all-btn" onClick={() => onNavigate('analytics')}>View stats</button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:14, cursor:'pointer' }} onClick={() => onNavigate('analytics')}>
              <div style={{ width:50, height:50, background:'var(--main-bg)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Flame size={22} color="#f59e0b" fill="#f59e0b"/>
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>12</div>
                <div style={{ fontSize:11, color:'var(--text-secondary)' }}>Current Streak</div>
              </div>
              <div style={{ marginLeft:'auto', textAlign:'right' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>18</div>
                <div style={{ fontSize:11, color:'var(--text-secondary)' }}>Best Streak</div>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)', marginTop:4 }}>32</div>
                <div style={{ fontSize:11, color:'var(--text-secondary)' }}>Total Days</div>
              </div>
            </div>
          </div>

          {/* Focus Timer widget */}
          <div>
            <div className="section-header">
              <span className="section-title">Focus Timer</span>
              <span style={{ fontSize:11, color:'var(--text-secondary)' }}>Pomodoro</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ cursor:'pointer' }} onClick={() => onNavigate('focus')}>
                <div style={{ fontSize:28, fontWeight:800, color:'var(--text-primary)', fontVariantNumeric:'tabular-nums' }}>25:00</div>
                <div style={{ fontSize:11.5, color:'var(--text-secondary)' }}>Focus time</div>
              </div>
              <button onClick={() => onNavigate('focus')}
                style={{ width:44, height:44, borderRadius:'50%', background:'var(--accent)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                <Play size={16} fill="#fff"/>
              </button>
              <button className="icon-btn" onClick={() => onNavigate('settings')}><Settings size={14}/></button>
            </div>
            <div style={{ display:'flex', gap:12, marginTop:10, fontSize:11.5, color:'var(--text-secondary)' }}>
              {[['Focus',true],['Short Break',false],['Long Break',false]].map(([l,a]) => (
                <label key={l} style={{ display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}
                  onClick={() => onNavigate('focus')}>
                  <input type="radio" name="dtimer" defaultChecked={a} style={{ accentColor:'var(--accent)' }} readOnly/> {l}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
