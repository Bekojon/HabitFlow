import React, { useState } from 'react'
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

export default function App() {
  const [activePage, setActivePage] = useState('dashboard')
  const [showPanel, setShowPanel] = useState(false)
  const [search, setSearch] = useState('')

  const [habits, setHabits] = useLocalStorage('hf_habits', INITIAL_HABITS)
  const [goals, setGoals] = useLocalStorage('hf_goals', INITIAL_GOALS)
  const [notes, setNotes] = useLocalStorage('hf_notes', INITIAL_NOTES)
  const [settings, setSettings] = useLocalStorage('hf_settings', INITIAL_SETTINGS)

  const handleNavigate = (page) => {
    setActivePage(page)
    setShowPanel(false)
    setSearch('')
  }

  const handleAction = (action) => {
    if (['Add Habit', 'New Habit', 'New Goal', 'New Note', 'New Event'].includes(action)) {
      setShowPanel(true)
    } else if (action === 'Export Report') {
      const data = JSON.stringify({ habits, goals, notes }, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = 'habitflow-report.json'; a.click()
      URL.revokeObjectURL(url)
    } else if (action === 'Save Changes') {
      // settings auto-save
    }
  }

  const renderPage = () => {
    const props = { habits, setHabits, goals, setGoals, notes, setNotes, settings, setSettings, search, showPanel, setShowPanel, onNavigate: handleNavigate }
    switch (activePage) {
      case 'dashboard': return <Dashboard {...props} />
      case 'habits': return <Habits {...props} />
      case 'goals': return <Goals {...props} />
      case 'calendar': return <CalendarPage {...props} />
      case 'analytics': return <Analytics {...props} />
      case 'focus': return <FocusTimer {...props} />
      case 'notes': return <Notes {...props} />
      case 'settings': return <Settings {...props} />
      default: return <Dashboard {...props} />
    }
  }

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      <div className="main-content">
        <TopBar
          activePage={activePage}
          onActionClick={handleAction}
          onSearch={setSearch}
          onNavigate={handleNavigate}
        />
        {renderPage()}
      </div>
    </div>
  )
}
