import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Edit2, Settings, Volume2, Music } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

const MODES = { Focus: 25 * 60, 'Short Break': 5 * 60, 'Long Break': 15 * 60 }

const hourData = [
  { h: '12AM', v: 0 }, { h: '4AM', v: 0 }, { h: '8AM', v: 20 }, { h: '12PM', v: 80 },
  { h: '4PM', v: 60 }, { h: '8PM', v: 20 }, { h: '12AM', v: 0 },
]

const sessionHistory = [
  { type: 'Focus Session', sub: 'Deep Work', time: '25:00', at: 'Today, 10:00 AM', icon: '🎯' },
  { type: 'Short Break', sub: 'Relax & recharge', time: '05:00', at: 'Today, 10:25 AM', icon: '☕' },
  { type: 'Focus Session', sub: 'Deep Work', time: '25:00', at: 'Today, 10:30 AM', icon: '🎯' },
  { type: 'Short Break', sub: 'Stretch & breathe', time: '05:00', at: 'Today, 10:55 AM', icon: '☕' },
  { type: 'Focus Session', sub: 'Deep Work', time: '25:00', at: 'Today, 11:00 AM', icon: '🎯' },
]

export default function FocusTimer() {
  const [mode, setMode] = useState('Focus')
  const [seconds, setSeconds] = useState(MODES['Focus'])
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(5)
  const [history, setHistory] = useState(sessionHistory)
  const intervalRef = useRef(null)

  useEffect(() => {
    setSeconds(MODES[mode])
    setRunning(false)
  }, [mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setSessions(n => n + 1)
            const newEntry = {
              type: mode === 'Focus' ? 'Focus Session' : mode,
              sub: mode === 'Focus' ? 'Deep Work' : 'Recharge',
              time: formatTime(MODES[mode]),
              at: 'Just now',
              icon: mode === 'Focus' ? '🎯' : '☕',
            }
            setHistory(h => [newEntry, ...h])
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const progress = 1 - (seconds / MODES[mode])
  const r = 120, circ = 2 * Math.PI * r

  const skip = () => {
    clearInterval(intervalRef.current)
    setRunning(false)
    const newEntry = {
      type: mode === 'Focus' ? 'Focus Session' : mode,
      sub: 'Skipped',
      time: formatTime(MODES[mode] - seconds),
      at: 'Just now',
      icon: mode === 'Focus' ? '🎯' : '☕',
    }
    setHistory(h => [newEntry, ...h])
    setSeconds(MODES[mode])
  }

  return (
    <div className="page-area" style={{ background: '#f5f6fa' }}>
      <div className="page-scroll">
        {/* Music bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, background: '#fff', border: '1px solid #e3e6ee', borderRadius: 14, padding: '10px 16px' }}>
          <Music size={15} color="#888" />
          <select className="form-select" style={{ width: 'auto', border: 'none', outline: 'none', fontWeight: 600, fontSize: 13 }}>
            <option>Lo-fi Beats</option>
            <option>White Noise</option>
            <option>Nature Sounds</option>
          </select>
          <Volume2 size={15} color="#888" />
          <div style={{ flex: 1, height: 4, background: '#f0f0f0', borderRadius: 2, position: 'relative', cursor: 'pointer' }}>
            <div style={{ width: '70%', height: '100%', background: '#111', borderRadius: 2 }} />
            <div style={{ position: 'absolute', top: '50%', left: '70%', transform: 'translate(-50%,-50%)', width: 12, height: 12, background: '#111', borderRadius: '50%' }} />
          </div>
          <Settings size={15} color="#888" style={{ cursor: 'pointer' }} />
        </div>

        {/* Mode tabs + Timer */}
        <div className="card" style={{ marginBottom: 18 }}>
          {/* Mode Tabs */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
            {Object.keys(MODES).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '8px 24px', borderRadius: 20, border: '1px solid #e3e6ee',
                  background: mode === m ? '#111' : '#fff', color: mode === m ? '#fff' : '#888',
                  fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.15s'
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Timer Ring */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}>
              <svg width={280} height={280} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={140} cy={140} r={r} fill="none" stroke="#f0f0f0" strokeWidth={14} />
                <circle cx={140} cy={140} r={r} fill="none" stroke="#111" strokeWidth={14}
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - progress)}
                  strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s' }} />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <div style={{ fontSize: 52, fontWeight: 800, fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px' }}>{formatTime(seconds)}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#555' }}>{mode} Session</div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                  {running ? 'Running...' : seconds === MODES[mode] ? 'Time to focus!' : 'Paused'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
              <div style={{ textAlign: 'center' }}>
                <button className="icon-btn" style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid #e3e6ee' }} onClick={() => { setSeconds(MODES[mode]); setRunning(false) }}>
                  <RotateCcw size={18} />
                </button>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Reset</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button onClick={() => setRunning(r => !r)} style={{
                  width: 64, height: 64, borderRadius: '50%', background: '#111', border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}>
                  {running ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" />}
                </button>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{running ? 'Pause' : 'Start'}</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button className="icon-btn" style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid #e3e6ee' }} onClick={skip}>
                  <SkipForward size={18} />
                </button>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>Skip</div>
              </div>
            </div>
          </div>

          {/* Current Session */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, background: '#f9fafb', borderRadius: 12, padding: '12px 16px' }}>
            <div style={{ width: 36, height: 36, background: '#f0f0f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎯</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Current Session</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Deep Work</div>
              <div style={{ fontSize: 12, color: '#888' }}>Working on habit: Study</div>
            </div>
            <button className="icon-btn" style={{ gap: 4, display: 'flex', alignItems: 'center', fontSize: 12, color: '#888' }}>
              <Edit2 size={12} /> Edit
            </button>
          </div>

          {/* Today's Sessions dots */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#888', marginBottom: 8 }}>
              <span style={{ fontWeight: 600 }}>Today's Sessions</span>
              <button style={{ background: 'none', border: 'none', fontSize: 12, color: '#888', cursor: 'pointer' }}>View full day</button>
            </div>
            <div style={{ display: 'flex', gap: 4, fontSize: 10, color: '#9ca3af', marginBottom: 6 }}>
              {['12 AM','4 AM','8 AM','12 PM','4 PM','8 PM','12 AM'].map(t => (
                <span key={t} style={{ flex: 1, textAlign: 'center' }}>{t}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 30 }, (_, i) => {
                const filled = i < 12 && i % 4 < 3
                const type = i % 4 === 2 ? 'break' : 'focus'
                return (
                  <div key={i} style={{
                    flex: 1, height: 12, borderRadius: 2,
                    background: filled ? (type === 'break' ? '#aaa' : '#111') : '#f0f0f0'
                  }} />
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: '#9ca3af' }}>
              {[['#111','Focus'],['#aaa','Short Break'],['#ccc','Long Break'],['#f0f0f0','No Session']].map(([c,l]) => (
                <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: 'inline-block', border: '1px solid #e5e7eb' }} />{l}
                </span>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginTop: 14, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 14px' }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>Tip for better focus</div>
              <div style={{ fontSize: 12, color: '#888' }}>Try the Pomodoro technique: 25 minutes of focused work, followed by a 5 minute break.</div>
            </div>
            <button className="icon-btn"><span style={{ fontSize: 14 }}>×</span></button>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: 290, minWidth: 290, borderLeft: '1px solid #e3e6ee', background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          {/* Today's Progress */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Today's Progress</div>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 6 }}>Total Focus Time</div>
            <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>2h 15m</div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={hourData} barSize={12}>
                <XAxis dataKey="h" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 90]} />
                <Bar dataKey="v" fill="#111" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 10 }}>
              {[['🕐','5','Focus Sessions'],['☕','2','Short Breaks'],['☀️','1','Long Break'],['✅','83%','Completion']].map(([ic,v,l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14 }}>{ic}</div>
                  <div style={{ fontSize: 15, fontWeight: 800 }}>{v}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Focus Goals */}
          <div style={{ marginBottom: 20 }}>
            <div className="section-title" style={{ marginBottom: 12 }}>Focus Goals</div>
            {[
              { label: 'Daily Goal', current: '2h 30m', target: '3h 00m', pct: 83 },
              { label: 'Weekly Goal', current: '10h 30m', target: '15h 00m', pct: 70 },
            ].map(g => (
              <div key={g.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{g.label}</span>
                  <span style={{ color: '#888' }}>{g.current} / {g.target}</span>
                  <span style={{ fontWeight: 700 }}>{g.pct}%</span>
                </div>
                <div className="progress-bar-wrap" style={{ height: 5 }}>
                  <div className="progress-bar-fill" style={{ width: `${g.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="divider" />

          {/* Session History */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span className="section-title">Session History</span>
              <button className="view-all-btn">View all</button>
            </div>
            {history.slice(0, 5).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 30, height: 30, background: '#f3f4f6', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>{s.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{s.type}</div>
                  <div style={{ fontSize: 11.5, color: '#888' }}>{s.sub}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{s.time}</div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>{s.at}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
