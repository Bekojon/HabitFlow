import React, { useState, useRef } from 'react'
import { User, Monitor, Bell, Target, Timer, Calendar, Shield, HelpCircle, ExternalLink, Download, Trash2, Camera, X, Check, Upload } from 'lucide-react'
import { t } from '../i18n'

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle" onClick={e => e.stopPropagation()}>
      <input type="checkbox" checked={!!checked} onChange={e => { e.stopPropagation(); onChange(e.target.checked) }} />
      <span className="toggle-slider" />
    </label>
  )
}

function Row({ label, sub, right }) {
  return (
    <div className="settings-row">
      <div style={{ flex: 1 }}>
        <div className="settings-row-label">{label}</div>
        {sub && <div className="settings-row-sub">{sub}</div>}
      </div>
      <div className="settings-row-right" onClick={e => e.stopPropagation()}>{right}</div>
    </div>
  )
}

const ACCENT_COLORS = [
  { color: '#6366f1', key: 'indigo' },
  { color: '#22c55e', key: 'green'  },
  { color: '#f59e0b', key: 'amber'  },
  { color: '#ec4899', key: 'pink'   },
  { color: '#8b5cf6', key: 'purple' },
]

export default function Settings({ settings, setSettings, profile, setProfile, onNavigate, lang = 'English' }) {
  const upd = (key, val) => setSettings(s => ({ ...s, [key]: val }))
  const [editingProfile, setEditingProfile] = useState(false)
  const [pForm, setPForm] = useState({ name: profile?.name || 'Bekojon', email: profile?.email || 'bekojon@example.com' })
  const fileRef = useRef(null)

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ settings, profile, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'habitflow-backup.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const resetData = () => {
    if (window.confirm(lang === 'Uzbek' ? "Barcha ma'lumotlarni o'chirish?" : lang === 'Russian' ? 'Удалить все данные?' : 'Reset all app data? This cannot be undone.')) {
      localStorage.clear(); window.location.reload()
    }
  }

  const handlePhoto = (e) => {
    const file = e.target.files[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => setProfile(p => ({ ...p, photo: ev.target.result }))
    reader.readAsDataURL(file)
  }

  const saveProfile = () => {
    setProfile(p => ({ ...p, name: pForm.name, email: pForm.email }))
    setEditingProfile(false)
  }

  const SmallSelect = ({ value, onChange, children, width = 'auto' }) => (
    <select className="form-select" value={value} onChange={e => onChange(e.target.value)}
      style={{ width, fontSize: 12, padding: '5px 24px 5px 8px' }}>
      {children}
    </select>
  )

  return (
    <div className="page-area">
      <div className="page-scroll">
        <div className="settings-grid">

          {/* 1. Account */}
          <div className="settings-card">
            <div className="settings-card-title"><User size={16} /> 1. {t('account', lang)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: '#fff', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
                  {profile?.photo ? <img src={profile.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profile?.name?.[0] || 'B')}
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', border: '2px solid var(--card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                  <Camera size={11} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhoto} />
              </div>
              {editingProfile ? (
                <div style={{ flex: 1 }}>
                  <input className="form-input" style={{ marginBottom: 6 }} placeholder={t('name', lang)} value={pForm.name} onChange={e => setPForm(f => ({ ...f, name: e.target.value }))} />
                  <input className="form-input" placeholder={t('email', lang)} value={pForm.email} onChange={e => setPForm(f => ({ ...f, email: e.target.value }))} />
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button className="save-btn" style={{ flex: 1, marginTop: 0, padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }} onClick={saveProfile}><Check size={12} />{t('saveProfile', lang)}</button>
                    <button className="filter-btn" onClick={() => setEditingProfile(false)}>{t('cancel', lang)}</button>
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{profile?.name || 'Bekojon'}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{profile?.email || 'bekojon@example.com'}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t('localAccount', lang)}</div>
                </div>
              )}
            </div>
            {!editingProfile && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="filter-btn" style={{ flex: 1 }} onClick={() => setEditingProfile(true)}>✏️ {t('editProfile', lang)}</button>
                {profile?.photo && <button className="filter-btn" onClick={() => setProfile(p => ({ ...p, photo: null }))}><X size={11} /></button>}
              </div>
            )}
          </div>

          {/* 2. Preferences */}
          <div className="settings-card">
            <div className="settings-card-title"><Monitor size={16} /> 2. {t('preferences', lang)}</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>{t('appearance', lang)}</div>
              <div className="appearance-btns">
                {['Light', 'Dark', 'Colorful'].map(a => (
                  <button key={a} className={`appearance-btn ${settings.appearance === a ? 'active' : ''}`} onClick={() => upd('appearance', a)}>
                    {lang === 'Uzbek' ? { Light:"Yorug'", Dark:"Qorong'u", Colorful:'Rang-barang' }[a]
                     : lang === 'Russian' ? { Light:'Светлая', Dark:'Тёмная', Colorful:'Цветная' }[a] : a}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent colors — only for Light/Dark */}
            {settings.appearance !== 'Colorful' && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Accent Color</div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* default black */}
                  <div onClick={() => upd('themeColor', 'default')}
                    style={{ width: 28, height: 28, borderRadius: '50%', background: settings.appearance === 'Dark' ? '#e0e0e8' : '#111', cursor: 'pointer', border: (!settings.themeColor || settings.themeColor === 'default') ? '3px solid var(--text-secondary)' : '2px solid transparent', transition: 'border 0.15s' }} />
                  {ACCENT_COLORS.map(({ color, key }) => (
                    <div key={key} onClick={() => upd('themeColor', key)}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: color, cursor: 'pointer', border: settings.themeColor === key ? '3px solid var(--text-secondary)' : '2px solid transparent', transition: 'border 0.15s' }} />
                  ))}
                </div>
              </div>
            )}

            <Row label={t('language', lang)} right={
              <SmallSelect value={settings.language || 'English'} onChange={v => upd('language', v)}>
                <option value="English">English</option>
                <option value="Uzbek">O'zbek</option>
                <option value="Russian">Русский</option>
              </SmallSelect>
            } />
            <Row label={t('timeFormat', lang)} right={
              <SmallSelect value={settings.timeFormat} onChange={v => upd('timeFormat', v)}>
                <option>12-hour (AM/PM)</option><option>24-hour</option>
              </SmallSelect>
            } />
            <Row label={t('firstDay', lang)} right={
              <SmallSelect value={settings.firstDay} onChange={v => upd('firstDay', v)}>
                <option>Monday</option><option>Sunday</option>
              </SmallSelect>
            } />
            <Row label={t('compactMode', lang)} right={<Toggle checked={settings.compactMode} onChange={v => upd('compactMode', v)} />} />
          </div>

          {/* 3. Notifications */}
          <div className="settings-card">
            <div className="settings-card-title"><Bell size={16} /> 3. {t('notif', lang)}</div>
            <Row label={t('habitReminders', lang)} right={<Toggle checked={!!settings.habitReminders} onChange={v => upd('habitReminders', v)} />} />
            <Row label={t('goalReminders', lang)} right={<Toggle checked={!!settings.goalReminders} onChange={v => upd('goalReminders', v)} />} />
            <Row label={t('dailySummary', lang)} right={<Toggle checked={!!settings.dailySummary} onChange={v => upd('dailySummary', v)} />} />
            <Row label={t('focusAlerts', lang)} right={<Toggle checked={!!settings.focusTimerAlerts} onChange={v => upd('focusTimerAlerts', v)} />} />
            <Row label={t('soundEffects', lang)} right={<Toggle checked={!!settings.soundEffects} onChange={v => upd('soundEffects', v)} />} />
            <Row label={t('doNotDisturb', lang)} sub="10:00 PM – 7:00 AM" right={<Toggle checked={!!settings.doNotDisturb} onChange={v => upd('doNotDisturb', v)} />} />
          </div>

          {/* 4. Habit Settings */}
          <div className="settings-card">
            <div className="settings-card-title"><Target size={16} /> 4. {t('habitSettings', lang)}</div>
            <Row label={t('reminder', lang)} right={
              <SmallSelect value={settings.defaultReminderTime} onChange={v => upd('defaultReminderTime', v)}>
                <option>12:00 PM</option><option>8:00 AM</option><option>6:00 PM</option>
              </SmallSelect>
            } />
            <Row label={t('duration', lang)} right={
              <SmallSelect value={settings.defaultDuration} onChange={v => upd('defaultDuration', v)}>
                <option>30 minutes</option><option>1 hour</option><option>2 hours</option>
              </SmallSelect>
            } />
            <Row label="Auto-complete" right={
              <SmallSelect value={settings.autoComplete} onChange={v => upd('autoComplete', v)}>
                <option>Ask to confirm</option><option>Auto complete</option>
              </SmallSelect>
            } />
            <Row label="Missed Habit" right={
              <SmallSelect value={settings.missedHabit} onChange={v => upd('missedHabit', v)}>
                <option>Mark as missed</option><option>Skip</option>
              </SmallSelect>
            } />
            <Row label="Weekend Tracking" right={<Toggle checked={!!settings.weekendTracking} onChange={v => upd('weekendTracking', v)} />} />
          </div>

          {/* 5. Focus Timer Settings */}
          <div className="settings-card">
            <div className="settings-card-title"><Timer size={16} /> 5. {t('focusTimerSettings', lang)}</div>
            <Row label={t('focusLength', lang)} right={
              <SmallSelect value={String(settings.focusLength)} onChange={v => upd('focusLength', parseInt(v))}>
                <option value="25">25 min</option><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option>
              </SmallSelect>
            } />
            <Row label={t('shortBreak', lang)} right={
              <SmallSelect value={String(settings.shortBreak)} onChange={v => upd('shortBreak', parseInt(v))}>
                <option value="5">5 min</option><option value="10">10 min</option>
              </SmallSelect>
            } />
            <Row label={t('longBreak', lang)} right={
              <SmallSelect value={String(settings.longBreak)} onChange={v => upd('longBreak', parseInt(v))}>
                <option value="15">15 min</option><option value="20">20 min</option><option value="30">30 min</option>
              </SmallSelect>
            } />
            <Row label={t('longBreakInterval', lang)} right={
              <SmallSelect value={String(settings.longBreakInterval)} onChange={v => upd('longBreakInterval', parseInt(v))}>
                <option value="3">3</option><option value="4">4</option><option value="5">5</option>
              </SmallSelect>
            } />
            <Row label={t('autoStart', lang)} right={<Toggle checked={!!settings.autoStart} onChange={v => upd('autoStart', v)} />} />
            <Row label={t('ambientSound', lang)} right={
              <SmallSelect value={settings.ambientSound} onChange={v => upd('ambientSound', v)}>
                <option>Lo-fi Beats</option><option>White Noise</option><option>Nature Sounds</option><option>None</option>
              </SmallSelect>
            } />
          </div>

          {/* 6. Calendar & Notes */}
          <div className="settings-card">
            <div className="settings-card-title"><Calendar size={16} /> 6. {t('calendarNotes', lang)}</div>
            <Row label={t('showCompletedDays', lang)} right={<Toggle checked={!!settings.showCompletedDays} onChange={v => upd('showCompletedDays', v)} />} />
            <Row label={t('defaultView', lang)} right={
              <SmallSelect value={settings.defaultView} onChange={v => upd('defaultView', v)}>
                <option>Week View</option><option>Month View</option>
              </SmallSelect>
            } />
            <Row label={t('autoSaveNotes', lang)} right={<Toggle checked={!!settings.autoSaveNotes} onChange={v => upd('autoSaveNotes', v)} />} />
            <Row label={t('richText', lang)} right={<Toggle checked={!!settings.richText} onChange={v => upd('richText', v)} />} />
          </div>

          {/* 7. Privacy & Data */}
          <div className="settings-card">
            <div className="settings-card-title"><Shield size={16} /> 7. {t('privacyData', lang)}</div>
            <Row label={t('syncData', lang)} right={<Toggle checked={!!settings.syncData} onChange={v => upd('syncData', v)} />} />
            <Row label={t('exportData', lang)} right={
              <button className="filter-btn" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={exportData}>
                <Download size={12} /> {t('exportNow', lang)}
              </button>
            } />
            <Row label={t('importData', lang)} right={
              <button className="filter-btn" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => alert(lang === 'Uzbek' ? "Tez orada!" : lang === 'Russian' ? 'Скоро!' : 'Coming soon!')}>
                <Upload size={12} /> {t('import', lang)}
              </button>
            } />
            <Row label={t('backupFreq', lang)} right={
              <SmallSelect value={settings.backupFrequency} onChange={v => upd('backupFrequency', v)}>
                <option>Weekly</option><option>Daily</option><option>Monthly</option>
              </SmallSelect>
            } />
            <Row label={t('twoFA', lang)} right={<Toggle checked={false} onChange={() => alert(lang === 'Uzbek' ? "Tez orada!" : lang === 'Russian' ? 'Скоро!' : 'Coming soon!')} />} />
            <div style={{ marginTop: 14 }}>
              <button onClick={resetData} style={{ width: '100%', padding: 10, background: 'none', border: '1.5px solid #fecaca', borderRadius: 10, color: '#ef4444', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Trash2 size={14} /> {t('deleteAccount', lang)}
              </button>
            </div>
          </div>

          {/* 8. App Info */}
          <div className="settings-card">
            <div className="settings-card-title"><HelpCircle size={16} /> 8. {t('appInfo', lang)}</div>
            <Row label={t('version', lang)} right={<span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>v1.2.0</span>} />
            <Row label={t('lastUpdated', lang)} right={<span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>May 3, 2024</span>} />
            <Row label={t('releaseNotes', lang)} right={
              <button className="filter-btn" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }} onClick={() => alert('v1.2.0 – Dark mode, multilingual support, music player.')}>
                {t('viewDetails', lang)} <ExternalLink size={10} />
              </button>
            } />
            <div className="divider" />
            {[
              { icon: '📚', key: 'helpCenter',      action: () => alert('Help Center — coming soon!') },
              { icon: '✉️', key: 'contactSupport',  action: () => { window.location.href = 'mailto:support@habitflow.app' } },
              { icon: '💬', key: 'sendFeedback',    action: () => alert('Thank you for your feedback!') },
            ].map(item => (
              <div key={item.key} className="settings-row" style={{ cursor: 'pointer' }} onClick={item.action}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.icon}</span>
                  <span className="settings-row-label">{t(item.key, lang)}</span>
                </div>
                <ExternalLink size={13} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Auto-save bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '12px 16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
          <span>ℹ️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{t('autoSaved', lang)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {lang === 'Uzbek' ? "O'zgarishlar barcha qurilmalarga qo'llaniladi." : lang === 'Russian' ? 'Изменения применяются на всех устройствах.' : 'Changes apply across all your devices.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
