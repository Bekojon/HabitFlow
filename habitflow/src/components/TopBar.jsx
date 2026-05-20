import React, { useState, useRef, useEffect } from 'react'
import { Search, Bell, Flame, Plus } from 'lucide-react'
import { NOTIFICATIONS } from '../data'
import { t } from '../i18n'

const SUBTITLES = {
  English: { dashboard:'Stay consistent, progress takes time.', habits:'Customize, track, and organize your routines.', goals:'Set clear targets and track long-term progress.', calendar:'Plan your routines and track daily consistency.', analytics:'Track your consistency and performance over time.', focus:'Stay focused. Build deep work habits.', notes:'Capture ideas, reflections, and daily thoughts.', settings:'Customize your experience and app behavior.' },
  Uzbek:   { dashboard:"Izchil bo'ling, rivojlanish vaqt talab qiladi.", habits:"Odatlaringizni sozlang va kuzating.", goals:"Aniq maqsadlar qo'ying va uzoq muddatli rivojlanishni kuzating.", calendar:"Rejalaringizni tuzing va kunlik izchillikni kuzating.", analytics:"Izchillik va samaradorligingizni kuzating.", focus:"Diqqatingizni jamlang. Chuqur ish odatlarini shakllantiring.", notes:"G'oyalar, fikrlar va kunlik mulohazalarni yozing.", settings:"Tajribangizni va ilova sozlamalarini o'zgartiring." },
  Russian: { dashboard:'Будьте последовательны, прогресс требует времени.', habits:'Настраивайте, отслеживайте и организуйте свои привычки.', goals:'Ставьте чёткие цели и отслеживайте долгосрочный прогресс.', calendar:'Планируйте и отслеживайте ежедневную последовательность.', analytics:'Отслеживайте последовательность и производительность.', focus:'Сосредоточьтесь. Формируйте привычку глубокой работы.', notes:'Фиксируйте идеи, размышления и ежедневные мысли.', settings:'Настройте свой опыт и поведение приложения.' },
}

const ACTION_KEYS = { dashboard:'addHabit', habits:'newHabit', goals:'newGoal', calendar:'newEvent', analytics:'exportReport', notes:'newNote', settings:'saveChanges', focus: null }

export default function TopBar({ activePage, onActionClick, onSearch, onNavigate, lang = 'English' }) {
  const [showNotif, setShowNotif] = useState(false)
  const [unread, setUnread] = useState(3)
  const [searchVal, setSearchVal] = useState('')
  const notifRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openNotif = () => {
    setShowNotif(v => !v)
    setUnread(0) // clear badge when opened
  }

  const title = activePage === 'dashboard'
    ? `${lang === 'Uzbek' ? 'Xayrli tong, Bekojon! 👋' : lang === 'Russian' ? 'Доброе утро, Bekojon! 👋' : 'Good morning, Bekojon! 👋'}`
    : t(activePage === 'focus' ? 'focusTimer' : activePage, lang)

  const subtitle = (SUBTITLES[lang] || SUBTITLES.English)[activePage] || ''
  const actionKey = ACTION_KEYS[activePage]
  const actionLabel = actionKey ? t(actionKey, lang) : null

  return (
    <div className="topbar">
      <div className="topbar-title-area">
        <div className="topbar-title">{title}</div>
        <div className="topbar-subtitle">{subtitle}</div>
      </div>

      <div className="topbar-search">
        <Search size={14} color="#9ca3af" />
        <input
          placeholder={`${t('search', lang)}...`}
          value={searchVal}
          onChange={e => { setSearchVal(e.target.value); onSearch?.(e.target.value) }}
        />
        <span className="search-kbd">⌘ K</span>
      </div>

      <div className="topbar-actions">
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button className="notif-btn" onClick={openNotif}>
            <Bell size={16} />
            {unread > 0 && <span className="notif-badge">{unread}</span>}
          </button>
          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-dropdown-header">{t('notifications', lang)}</div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className="notif-item">
                  <div className="notif-icon">{n.icon}</div>
                  <div>
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
          12 {t('streak', lang)}
        </button>

        {actionLabel && (
          <button className="action-btn" onClick={() => onActionClick(actionKey)}>
            <Plus size={14} />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}
