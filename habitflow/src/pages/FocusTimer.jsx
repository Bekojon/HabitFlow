import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, SkipForward, Edit2, Volume2, VolumeX, Music, ChevronDown, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { t } from '../i18n'

const MODES = { Focus: 25 * 60, 'Short Break': 5 * 60, 'Long Break': 15 * 60 }

// Real working Spotify embed tracks (relaxing/lofi)
const MUSIC_TRACKS = [
  { name: 'Lo-fi Hip Hop',      emoji: '🎵', spotifyId: '37i9dQZF1DWWQRwui0ExPn' }, // lofi beats playlist
  { name: 'Deep Focus',         emoji: '🧘', spotifyId: '37i9dQZF1DX3PFzdbtx1Us' }, // deep focus playlist
  { name: 'Nature & Rain',      emoji: '🌿', spotifyId: '37i9dQZF1DX4PP3DA4J0N8' }, // nature sounds
  { name: 'Peaceful Piano',     emoji: '🎹', spotifyId: '37i9dQZF1DX4sWSpwq3LiO' }, // peaceful piano
  { name: 'Chill Vibes',        emoji: '☕', spotifyId: '37i9dQZF1DX889U0CL85jj' }, // chill vibes
  { name: 'Ambient Relaxation', emoji: '🌊', spotifyId: '37i9dQZF1DWZd79rJ6a7lp' }, // ambient relaxation
]

const hourData = [
  { h: '12AM', v: 0 }, { h: '4AM', v: 0 }, { h: '8AM', v: 20 },
  { h: '12PM', v: 80 }, { h: '4PM', v: 60 }, { h: '8PM', v: 20 }, { h: '12AM', v: 0 },
]

export default function FocusTimer({ settings, lang = 'English' }) {
  const focusMins = settings?.focusLength || 25
  const shortMins = settings?.shortBreak  || 5
  const longMins  = settings?.longBreak   || 15

  const DURATIONS = { Focus: focusMins * 60, 'Short Break': shortMins * 60, 'Long Break': longMins * 60 }

  const [mode, setMode]         = useState('Focus')
  const [seconds, setSeconds]   = useState(DURATIONS['Focus'])
  const [running, setRunning]   = useState(false)
  const [showTip, setShowTip]   = useState(true)
  const [history, setHistory]   = useState([
    { type: 'Focus Session', sub: 'Deep Work',        time: '25:00', at: 'Today, 10:00 AM', icon: '🎯' },
    { type: 'Short Break',   sub: 'Relax & recharge', time: '05:00', at: 'Today, 10:25 AM', icon: '☕' },
    { type: 'Focus Session', sub: 'Deep Work',        time: '25:00', at: 'Today, 10:30 AM', icon: '🎯' },
    { type: 'Short Break',   sub: 'Stretch & breathe',time: '05:00', at: 'Today, 10:55 AM', icon: '☕' },
    { type: 'Focus Session', sub: 'Deep Work',        time: '25:00', at: 'Today, 11:00 AM', icon: '🎯' },
  ])

  // Music state
  const [selectedTrack, setSelectedTrack] = useState(0)
  const [showMusicMenu, setShowMusicMenu] = useState(false)
  const [showSpotify, setShowSpotify]     = useState(false)
  const [volume, setVolume]               = useState(70)
  const [showVolume, setShowVolume]       = useState(false)
  const musicMenuRef  = useRef(null)
  const volumeRef     = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const h = (e) => {
      if (musicMenuRef.current && !musicMenuRef.current.contains(e.target)) setShowMusicMenu(false)
      if (volumeRef.current && !volumeRef.current.contains(e.target)) setShowVolume(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  // Timer logic
  const intervalRef = useRef(null)
  useEffect(() => { setSeconds(DURATIONS[mode]); setRunning(false) }, [mode, focusMins, shortMins, longMins])
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            setHistory(h => [{ type: mode === 'Focus' ? 'Focus Session' : mode, sub: mode === 'Focus' ? 'Deep Work' : 'Recharge', time: fmt(DURATIONS[mode]), at: 'Just now', icon: mode === 'Focus' ? '🎯' : '☕' }, ...h])
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [running, mode])

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
  const reset = () => { clearInterval(intervalRef.current); setRunning(false); setSeconds(DURATIONS[mode]) }
  const skip  = () => {
    clearInterval(intervalRef.current); setRunning(false)
    setHistory(h => [{ type: mode==='Focus'?'Focus Session':mode, sub:'Skipped', time: fmt(DURATIONS[mode]-seconds), at:'Just now', icon: mode==='Focus'?'🎯':'☕' }, ...h])
    setSeconds(DURATIONS[mode])
  }

  const progress = 1 - seconds / DURATIONS[mode]
  const R = 120, CIRC = 2 * Math.PI * R

  const modeLabel = (m) =>
    lang === 'Uzbek'   ? { Focus:'Fokus', 'Short Break':'Qisqa tanaffus', 'Long Break':'Uzun tanaffus' }[m]
    : lang === 'Russian' ? { Focus:'Фокус', 'Short Break':'Короткий перерыв', 'Long Break':'Длинный перерыв' }[m]
    : m

  return (
    <div className="page-area">
      <div className="page-scroll">

        {/* ── Music Bar ── */}
        <div className="card" style={{ display:'flex', alignItems:'center', gap:16, padding:'10px 18px', marginBottom:18 }}>
          <Music size={15} color="var(--text-secondary)" />

          {/* Track selector dropdown */}
          <div ref={musicMenuRef} style={{ position:'relative' }}>
            <button onClick={() => setShowMusicMenu(v => !v)}
              style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid var(--border)', borderRadius:8, padding:'6px 12px', background:'var(--main-bg)', cursor:'pointer', fontFamily:'inherit', fontSize:13, fontWeight:600, color:'var(--text-primary)', minWidth:180 }}>
              <span>{MUSIC_TRACKS[selectedTrack].emoji}</span>
              <span style={{ flex:1, textAlign:'left' }}>{MUSIC_TRACKS[selectedTrack].name}</span>
              <ChevronDown size={12} color="var(--text-secondary)" />
            </button>
            {showMusicMenu && (
              <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:10, boxShadow:'0 8px 24px rgba(0,0,0,0.14)', zIndex:300, overflow:'hidden', minWidth:210 }}>
                {MUSIC_TRACKS.map((tr, i) => (
                  <button key={i} onClick={() => { setSelectedTrack(i); setShowMusicMenu(false); setShowSpotify(true) }}
                    style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', width:'100%', border:'none', borderBottom:'1px solid var(--border)', background: i===selectedTrack ? 'var(--main-bg)':'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:13, color:'var(--text-primary)', fontWeight: i===selectedTrack?600:400 }}>
                    <span style={{ fontSize:16 }}>{tr.emoji}</span>
                    <span style={{ flex:1, textAlign:'left' }}>{tr.name}</span>
                    {i===selectedTrack && <span style={{ fontSize:18, color:'var(--accent)' }}>♪</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Open Spotify button */}
          <button onClick={() => setShowSpotify(v => !v)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background: showSpotify ? 'var(--accent)' : '#1DB954', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
            {showSpotify ? <><Pause size={13} fill="currentColor" /> Hide Player</> : <><Play size={13} fill="currentColor" /> Open Player</>}
          </button>

          <div style={{ flex:1 }} />

          {/* Volume control */}
          <div ref={volumeRef} style={{ position:'relative' }}>
            <button onClick={() => setShowVolume(v => !v)}
              style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 10px', border:'1px solid var(--border)', borderRadius:8, background:'var(--main-bg)', cursor:'pointer', color:'var(--text-secondary)', fontFamily:'inherit', fontSize:12, fontWeight:500 }}>
              {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
              <span>{volume}%</span>
            </button>

            {/* Volume popup */}
            {showVolume && (
              <div style={{ position:'absolute', bottom:'calc(100% + 10px)', right:0, background:'var(--card-bg)', border:'1px solid var(--border)', borderRadius:12, padding:'16px 14px', boxShadow:'0 8px 24px rgba(0,0,0,0.15)', zIndex:400, width:54, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:11, fontWeight:600, color:'var(--text-secondary)' }}>{volume}%</span>
                {/* Vertical slider */}
                <div style={{ position:'relative', height:120, width:24, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:6, height:'100%', background:'var(--border)', borderRadius:3 }}>
                    <div style={{ position:'absolute', bottom:0, left:0, width:'100%', height:`${volume}%`, background:'var(--accent)', borderRadius:3, transition:'height 0.1s' }} />
                  </div>
                  <input
                    type="range" min={0} max={100} step={1} value={volume}
                    onChange={e => setVolume(parseInt(e.target.value))}
                    style={{ position:'absolute', height:120, width:24, cursor:'pointer', opacity:0, writingMode:'vertical-lr', direction:'rtl', appearance:'slider-vertical', WebkitAppearance:'slider-vertical' }}
                  />
                </div>
                <button onClick={() => setVolume(v => v===0?70:0)}
                  style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)', padding:0 }}>
                  {volume===0 ? <VolumeX size={14}/> : <Volume2 size={14}/>}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Spotify Embed Player */}
        {showSpotify && (
          <div className="card" style={{ marginBottom:18, padding:0, overflow:'hidden', borderRadius:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:18 }}>{MUSIC_TRACKS[selectedTrack].emoji}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{MUSIC_TRACKS[selectedTrack].name}</div>
                  <div style={{ fontSize:11, color:'var(--text-secondary)' }}>Spotify Playlist</div>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowSpotify(false)}><X size={14}/></button>
            </div>
            <iframe
              key={selectedTrack}
              src={`https://open.spotify.com/embed/playlist/${MUSIC_TRACKS[selectedTrack].spotifyId}?utm_source=generator&theme=0`}
              width="100%" height="352" frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              style={{ display:'block' }}
            />
          </div>
        )}

        {/* ── Timer Card ── */}
        <div className="card" style={{ marginBottom:18 }}>
          {/* Mode tabs */}
          <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:28 }}>
            {Object.keys(MODES).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ padding:'8px 22px', borderRadius:20, border:'1px solid var(--border)', background: mode===m ? 'var(--accent)' : 'var(--card-bg)', color: mode===m ? '#fff' : 'var(--text-secondary)', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
                {modeLabel(m)}
              </button>
            ))}
          </div>

          {/* Ring */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
            <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:28 }}>
              <svg width={280} height={280} style={{ transform:'rotate(-90deg)' }}>
                <circle cx={140} cy={140} r={R} fill="none" stroke="var(--border)" strokeWidth={14}/>
                <circle cx={140} cy={140} r={R} fill="none" stroke="var(--accent)" strokeWidth={14}
                  strokeDasharray={CIRC} strokeDashoffset={CIRC*(1-progress)} strokeLinecap="round"
                  style={{ transition:'stroke-dashoffset 0.5s' }}/>
              </svg>
              <div style={{ position:'absolute', textAlign:'center' }}>
                <div style={{ fontSize:52, fontWeight:800, letterSpacing:'-2px', color:'var(--text-primary)', fontVariantNumeric:'tabular-nums' }}>{fmt(seconds)}</div>
                <div style={{ fontSize:15, fontWeight:600, color:'var(--text-secondary)' }}>{modeLabel(mode)} Session</div>
                <div style={{ fontSize:12, color:'var(--text-muted)' }}>
                  {running ? 'Running...' : seconds===DURATIONS[mode] ? t('timeToFocus',lang) : 'Paused'}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div style={{ display:'flex', alignItems:'center', gap:36 }}>
              <div style={{ textAlign:'center' }}>
                <button className="icon-btn" style={{ width:48, height:48, borderRadius:'50%', border:'1.5px solid var(--border)' }} onClick={reset}><RotateCcw size={18}/></button>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{t('reset',lang)}</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <button onClick={() => setRunning(r=>!r)} style={{ width:68, height:68, borderRadius:'50%', background:'var(--accent)', border:'none', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', boxShadow:'0 4px 16px rgba(0,0,0,0.2)' }}>
                  {running ? <Pause size={26} fill="currentColor"/> : <Play size={26} fill="currentColor"/>}
                </button>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{running ? t('pause',lang) : t('start',lang)}</div>
              </div>
              <div style={{ textAlign:'center' }}>
                <button className="icon-btn" style={{ width:48, height:48, borderRadius:'50%', border:'1.5px solid var(--border)' }} onClick={skip}><SkipForward size={18}/></button>
                <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{t('skip',lang)}</div>
              </div>
            </div>
          </div>

          {/* Current Session */}
          <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:24, background:'var(--main-bg)', borderRadius:12, padding:'12px 16px' }}>
            <div style={{ width:36, height:36, background:'var(--border)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>🎯</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{t('currentSession',lang)}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text-primary)' }}>Deep Work</div>
              <div style={{ fontSize:12, color:'var(--text-secondary)' }}>Working on habit: Study</div>
            </div>
            <button className="icon-btn" style={{ display:'flex', alignItems:'center', gap:4, fontSize:12 }}>
              <Edit2 size={12}/> Edit
            </button>
          </div>

          {/* Session timeline dots */}
          <div style={{ marginTop:18 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-secondary)', marginBottom:8 }}>
              <span style={{ fontWeight:600 }}>{t('todaySessions',lang)}</span>
              <button style={{ background:'none', border:'none', fontSize:12, color:'var(--text-secondary)', cursor:'pointer' }}>View full day</button>
            </div>
            <div style={{ display:'flex', gap:4, fontSize:10, color:'var(--text-muted)', marginBottom:6 }}>
              {['12AM','4AM','8AM','12PM','4PM','8PM','12AM'].map(lbl => <span key={lbl} style={{ flex:1, textAlign:'center' }}>{lbl}</span>)}
            </div>
            <div style={{ display:'flex', gap:3 }}>
              {Array.from({length:30},(_,i) => {
                const filled = i < 12 && i%4 < 3
                const type   = i%4===2 ? 'break' : 'focus'
                return <div key={i} style={{ flex:1, height:12, borderRadius:2, background: filled?(type==='break'?'#888':'var(--accent)'):'var(--border)' }}/>
              })}
            </div>
          </div>

          {/* Tip */}
          {showTip && (
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginTop:14, background:'#fffbeb', border:'1px solid #fde68a', borderRadius:12, padding:'12px 14px' }}>
              <span style={{ fontSize:18 }}>💡</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#78350f', marginBottom:3 }}>{t('tipTitle',lang)}</div>
                <div style={{ fontSize:12, color:'#92400e' }}>{t('tipText',lang)}</div>
              </div>
              <button onClick={() => setShowTip(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#92400e', padding:0, display:'flex' }}>
                <X size={16}/>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width:290, minWidth:290, borderLeft:'1px solid var(--border)', background:'var(--card-bg)', overflow:'hidden', display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1, overflowY:'auto', padding:16 }}>
          <div style={{ marginBottom:20 }}>
            <div className="section-title" style={{ marginBottom:12 }}>Today's Progress</div>
            <div style={{ fontSize:12, color:'var(--text-secondary)', marginBottom:4 }}>Total Focus Time</div>
            <div style={{ fontSize:24, fontWeight:800, color:'var(--text-primary)', marginBottom:10 }}>2h 15m</div>
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={hourData} barSize={12}>
                <XAxis dataKey="h" tick={{ fontSize:10, fill:'var(--text-muted)' }} axisLine={false} tickLine={false}/>
                <YAxis hide domain={[0,90]}/>
                <Bar dataKey="v" fill="var(--accent)" radius={[3,3,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginTop:10 }}>
              {[['🕐','5','Focus'],['☕','2','Breaks'],['☀️','1','Long'],['✅','83%','Done']].map(([ic,v,l])=>(
                <div key={l} style={{ textAlign:'center' }}>
                  <div style={{ fontSize:14 }}>{ic}</div>
                  <div style={{ fontSize:15, fontWeight:800, color:'var(--text-primary)' }}>{v}</div>
                  <div style={{ fontSize:10, color:'var(--text-muted)' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider"/>
          <div style={{ marginBottom:20 }}>
            <div className="section-title" style={{ marginBottom:12 }}>{t('focusGoals',lang)}</div>
            {[{label:t('dailyGoal',lang), c:'2h 30m', tgt:'3h 00m', p:83},{label:t('weeklyGoal',lang), c:'10h 30m', tgt:'15h 00m', p:70}].map(g=>(
              <div key={g.label} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ fontWeight:600, color:'var(--text-primary)' }}>{g.label}</span>
                  <span style={{ color:'var(--text-secondary)' }}>{g.c} / {g.tgt}</span>
                  <span style={{ fontWeight:700, color:'var(--text-primary)' }}>{g.p}%</span>
                </div>
                <div className="progress-bar-wrap" style={{ height:5 }}>
                  <div className="progress-bar-fill" style={{ width:`${g.p}%` }}/>
                </div>
              </div>
            ))}
          </div>
          <div className="divider"/>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <span className="section-title">{t('sessionHistory',lang)}</span>
              <button className="view-all-btn">{t('viewAll',lang)}</button>
            </div>
            {history.slice(0,5).map((s,i)=>(
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <div style={{ width:30, height:30, background:'var(--main-bg)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13 }}>{s.icon}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:'var(--text-primary)' }}>{s.type}</div>
                  <div style={{ fontSize:11.5, color:'var(--text-secondary)' }}>{s.sub}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'var(--text-primary)' }}>{s.time}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)' }}>{s.at}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
