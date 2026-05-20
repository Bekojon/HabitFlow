import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Goals from './pages/Goals'
import CalendarPage from './pages/CalendarPage'
import Analytics from './pages/Analytics'
import FocusTimer from './pages/FocusTimer'
import Notes from './pages/Notes'
import Settings from './pages/Settings'
import { useLocalStorage } from './hooks/useLocalStorage'
import { INITIAL_HABITS, INITIAL_GOALS, INITIAL_NOTES, INITIAL_SETTINGS } from './data'

const THEMES = {
  Light: {
    '--main-bg': '#f5f6fa', '--card-bg': '#ffffff', '--border': '#e3e6ee',
    '--text-primary': '#111111', '--text-secondary': '#6b7280', '--text-muted': '#9ca3af',
    '--accent': '#111111', '--accent-hover': '#333333',
  },
  Dark: {
    '--main-bg': '#0f0f10', '--card-bg': '#1c1c1f', '--border': '#2e2e33',
    '--text-primary': '#f0f0f2', '--text-secondary': '#9191a0', '--text-muted': '#6b6b7a',
    '--accent': '#e0e0e8', '--accent-hover': '#c0c0cc',
  },
  Colorful: {
    '--main-bg': '#f0f4ff', '--card-bg': '#ffffff', '--border': '#c7d2fe',
    '--text-primary': '#1e1b4b', '--text-secondary': '#6366f1', '--text-muted': '#a5b4fc',
    '--accent': '#4f46e5', '--accent-hover': '#4338ca',
  },
}

const ACCENT_COLORS = {
  default: null,
  indigo: { '--accent': '#6366f1', '--accent-hover': '#4f46e5' },
  green:  { '--accent': '#16a34a', '--accent-hover': '#15803d' },
  amber:  { '--accent': '#d97706', '--accent-hover': '#b45309' },
  pink:   { '--accent': '#db2777', '--accent-hover': '#be185d' },
  purple: { '--accent': '#9333ea', '--accent-hover': '#7e22ce' },
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [showPanel, setShowPanel] = useState(false)
  const [search, setSearch] = useState('')

  const [habits, setHabits] = useLocalStorage('hf_habits', INITIAL_HABITS)
  const [goals, setGoals] = useLocalStorage('hf_goals', INITIAL_GOALS)
  const [notes, setNotes] = useLocalStorage('hf_notes', INITIAL_NOTES)
  const [settings, setSettings] = useLocalStorage('hf_settings', INITIAL_SETTINGS)
  const [profile, setProfile] = useLocalStorage('hf_profile', { name: 'Bekojon', email: 'bekojon@example.com', photo: null })

  useEffect(() => {
    const theme = THEMES[settings.appearance] || THEMES.Light
    const root = document.documentElement
    Object.entries(theme).forEach(([k, v]) => root.style.setProperty(k, v))

    // Apply accent color override (only for Light/Dark, not Colorful)
    if (settings.themeColor && settings.themeColor !== 'default' && settings.appearance !== 'Colorful') {
      const accent = ACCENT_COLORS[settings.themeColor]
      if (accent) Object.entries(accent).forEach(([k, v]) => root.style.setProperty(k, v))
    }

    // Sidebar stays dark even in light mode
    document.body.setAttribute('data-theme', settings.appearance || 'Light')
  }, [settings.appearance, settings.themeColor])

  const handleNavigate = (page) => {
    setActivePage(page)
    setShowPanel(false)
    setSearch('')
  }

  const handleAction = (action) => {
    const map = {
      addHabit: () => { setActivePage('habits'); setTimeout(() => setShowPanel(true), 50) },
      newHabit: () => setShowPanel(true),
      newGoal:  () => { setActivePage('goals'); setTimeout(() => setShowPanel(true), 50) },
      newEvent: () => { setActivePage('calendar'); setShowPanel(true) },
      exportReport: () => {
        const data = JSON.stringify({ habits, goals, notes }, null, 2)
        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'habitflow-report.json'; a.click()
        URL.revokeObjectURL(url)
      },
      newNote: () => setShowPanel(true),
      saveChanges: () => {
        const msg = (settings.language === 'Uzbek') ? 'Sozlamalar saqlandi!' :
                    (settings.language === 'Russian') ? 'Настройки сохранены!' : 'Settings saved!'
        alert(msg)
      },
    }
    // match by key
    if (map[action]) { map[action](); return }
    // fallback: just open panel
    setShowPanel(true)
  }

  const lang = settings.language || 'English'

  const pageProps = {
    habits, setHabits, goals, setGoals, notes, setNotes,
    settings, setSettings, profile, setProfile,
    search, showPanel, setShowPanel, onNavigate: handleNavigate, lang,
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard {...pageProps} />
      case 'habits':    return <Habits    {...pageProps} />
      case 'goals':     return <Goals     {...pageProps} />
      case 'calendar':  return <CalendarPage {...pageProps} />
      case 'analytics': return <Analytics {...pageProps} />
      case 'focus':     return <FocusTimer {...pageProps} />
      case 'notes':     return <Notes     {...pageProps} />
      case 'settings':  return <Settings  {...pageProps} />
      default:          return <Dashboard {...pageProps} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} settings={settings} profile={profile} lang={lang} />
      <div className="main-content">
        <TopBar activePage={activePage} onActionClick={handleAction} onSearch={setSearch} onNavigate={handleNavigate} lang={lang} />
        {renderPage()}
      </div>
    </div>
  )
}
