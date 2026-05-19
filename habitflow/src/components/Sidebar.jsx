import React from 'react'
import { LayoutDashboard, CheckCircle, Target, Calendar, BarChart2, Timer, FileText, Settings, Flame } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'habits', label: 'Habits', icon: CheckCircle },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'focus', label: 'Focus Timer', icon: Timer },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const STREAK_DATA = [
  { day: 'M', h: 40, active: true },
  { day: 'T', h: 55, active: true },
  { day: 'W', h: 70, active: true },
  { day: 'T', h: 50, active: true },
  { day: 'F', h: 80, active: true },
  { day: 'S', h: 90, active: true },
  { day: 'S', h: 60, active: false },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
        </div>
        HabitFlow
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Streak card */}
      <div className="sidebar-streak">
        <div className="sidebar-streak-label">
          <Flame size={12} color="#f59e0b" fill="#f59e0b" />
          Current Streak
        </div>
        <div className="sidebar-streak-value">
          <span className="sidebar-streak-num">12</span>
          <span className="sidebar-streak-unit">days</span>
        </div>
        <div className="sidebar-streak-best">Best: 34 days</div>
        <div className="sidebar-streak-bars">
          {STREAK_DATA.map((d, i) => (
            <div
              key={i}
              className={`streak-bar ${d.active ? 'active' : ''}`}
              style={{ height: `${d.h}%` }}
            />
          ))}
        </div>
        <div className="sidebar-streak-labels">
          {STREAK_DATA.map((d, i) => (
            <span key={i}>{d.day}</span>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="sidebar-avatar">B</div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-name">Bekojon</div>
          <div className="sidebar-user-role">Local account</div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  )
}
