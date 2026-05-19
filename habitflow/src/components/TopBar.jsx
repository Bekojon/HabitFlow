import React, { useState, useRef, useEffect } from 'react'
import { Search, Bell, Flame, Plus } from 'lucide-react'
import { NOTIFICATIONS } from '../data'

const PAGE_CONFIG = {
  dashboard: { title: 'Good morning, Bekojon! 👋', subtitle: 'Stay consistent, progress takes time.', action: 'Add Habit' },
  habits: { title: 'My Habits', subtitle: 'Customize, track, and organize your routines.', action: 'New Habit' },
  goals: { title: 'My Goals', subtitle: 'Set clear targets and track long-term progress.', action: 'New Goal' },
  calendar: { title: 'Calendar', subtitle: 'Plan your routines and track daily consistency.', action: 'New Event' },
  analytics: { title: 'Analytics', subtitle: 'Track your consistency and performance over time.', action: 'Export Report' },
  focus: { title: 'Focus Timer', subtitle: 'Stay focused. Build deep work habits.', action: null },
  notes: { title: 'Notes', subtitle: 'Capture ideas, reflections, and daily thoughts.', action: 'New Note' },
  settings: { title: 'Settings', subtitle: 'Customize your experience and app behavior.', action: 'Save Changes' },
}

export default function TopBar({ activePage, onActionClick, onSearch, onNavigate }) {
  const [showNotif, setShowNotif] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const notifRef = useRef(null)
  const cfg = PAGE_CONFIG[activePage] || PAGE_CONFIG.dashboard

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (v) => {
    setSearchVal(v)
    onSearch && onSearch(v)
  }

  return (
    <div className="topbar">
      <div className="topbar-title-area">
        <div className="topbar-title">{cfg.title}</div>
        <div className="topbar-subtitle">{cfg.subtitle}</div>
      </div>

      <div className="topbar-search">
        <Search size={14} color="#9ca3af" />
        <input
          placeholder={`Search ${activePage}...`}
          value={searchVal}
          onChange={e => handleSearch(e.target.value)}
        />
        <span className="search-kbd">⌘ K</span>
      </div>

      <div className="topbar-actions">
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="notif-btn" onClick={() => setShowNotif(v => !v)}>
            <Bell size={16} />
            <span className="notif-badge">3</span>
          </button>
          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">Notifications</div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="notif-item">
                  <div className="notif-icon">{n.icon}</div>
                  <div className="notif-text">
                    <div className="notif-text-title">{n.title}</div>
                    <div className="notif-text-sub">{n.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="streak-pill" onClick={() => onNavigate('analytics')}>
          <Flame size={14} color="#f59e0b" fill="#f59e0b" />
          12 day streak
        </button>

        {cfg.action && (
          <button className="action-btn" onClick={() => onActionClick(cfg.action)}>
            <Plus size={14} />
            {cfg.action}
          </button>
        )}
      </div>
    </div>
  )
}
