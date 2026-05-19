import React from 'react'
import { User, Monitor, Bell, Target, Timer, Calendar, Shield, HelpCircle, ExternalLink, Upload, Download, Trash2 } from 'lucide-react'

function Toggle({ checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  )
}

function SettingsRow({ label, sub, right }) {
  return (
    <div className="settings-row">
      <div>
        <div className="settings-row-label">{label}</div>
        {sub && <div className="settings-row-sub">{sub}</div>}
      </div>
      <div className="settings-row-right">{right}</div>
    </div>
  )
}

export default function Settings({ settings, setSettings }) {
  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }))

  const exportData = () => {
    const data = { settings, exported: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'habitflow-backup.json'; a.click()
    URL.revokeObjectURL(url)
  }

  const resetData = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="page-area">
      <div className="page-scroll">
        <div className="settings-grid">

          {/* 1. Account */}
          <div className="settings-card">
            <div className="settings-card-title"><User size={16} /> 1. Account</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#fff', flexShrink: 0 }}>B</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>Bekojon</div>
                <div style={{ fontSize: 13, color: '#888' }}>bekojon@example.com</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>Local Account</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="filter-btn" style={{ flex: 1 }}>✏️ Edit Profile</button>
            </div>
          </div>

          {/* 2. Preferences */}
          <div className="settings-card">
            <div className="settings-card-title"><Monitor size={16} /> 2. Preferences</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 600 }}>Appearance</div>
              <div className="appearance-btns">
                {['Light', 'Dark', 'System', 'Colorful'].map(a => (
                  <button key={a} className={`appearance-btn ${settings.appearance === a ? 'active' : ''}`} onClick={() => update('appearance', a)}>{a}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 6, fontWeight: 600 }}>Theme Preview</div>
              <div className="theme-preview">
                {[['#6366f1','default'],['#22c55e','green'],['#f59e0b','amber'],['#ec4899','pink'],['#8b5cf6','purple']].map(([c, k]) => (
                  <div key={k} onClick={() => update('theme', k)} className={`theme-dot ${settings.theme === k ? 'selected' : ''}`} style={{ background: c }} />
                ))}
              </div>
            </div>
            <SettingsRow label="Language" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.language} onChange={e => update('language', e.target.value)}>
                <option>English</option><option>Russian</option><option>Uzbek</option>
              </select>
            } />
            <SettingsRow label="Time Format" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.timeFormat} onChange={e => update('timeFormat', e.target.value)}>
                <option>12-hour (AM/PM)</option><option>24-hour</option>
              </select>
            } />
            <SettingsRow label="First Day of Week" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.firstDay} onChange={e => update('firstDay', e.target.value)}>
                <option>Monday</option><option>Sunday</option>
              </select>
            } />
            <SettingsRow label="Compact Mode" right={<Toggle checked={settings.compactMode} onChange={v => update('compactMode', v)} />} />
          </div>

          {/* 3. Notifications */}
          <div className="settings-card">
            <div className="settings-card-title"><Bell size={16} /> 3. Notifications</div>
            <SettingsRow label="Habit Reminders" right={<Toggle checked={settings.habitReminders} onChange={v => update('habitReminders', v)} />} />
            <SettingsRow label="Goal Reminders" right={<Toggle checked={settings.goalReminders} onChange={v => update('goalReminders', v)} />} />
            <SettingsRow label="Daily Summary" right={<Toggle checked={settings.dailySummary} onChange={v => update('dailySummary', v)} />} />
            <SettingsRow label="Focus Timer Alerts" right={<Toggle checked={settings.focusTimerAlerts} onChange={v => update('focusTimerAlerts', v)} />} />
            <SettingsRow label="Sound Effects" right={<Toggle checked={settings.soundEffects} onChange={v => update('soundEffects', v)} />} />
            <SettingsRow label="Do Not Disturb" sub="10:00 PM – 7:00 AM" right={<Toggle checked={settings.doNotDisturb} onChange={v => update('doNotDisturb', v)} />} />
          </div>

          {/* 4. Habit Settings */}
          <div className="settings-card">
            <div className="settings-card-title"><Target size={16} /> 4. Habit Settings</div>
            <SettingsRow label="Default Reminder Time" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.defaultReminderTime} onChange={e => update('defaultReminderTime', e.target.value)}>
                <option>12:00 PM</option><option>8:00 AM</option><option>6:00 PM</option>
              </select>
            } />
            <SettingsRow label="Default Habit Duration" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.defaultDuration} onChange={e => update('defaultDuration', e.target.value)}>
                <option>30 minutes</option><option>1 hour</option><option>2 hours</option>
              </select>
            } />
            <SettingsRow label="Auto-complete Behavior" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.autoComplete} onChange={e => update('autoComplete', e.target.value)}>
                <option>Ask to confirm</option><option>Auto complete</option>
              </select>
            } />
            <SettingsRow label="Missed Habit Handling" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.missedHabit} onChange={e => update('missedHabit', e.target.value)}>
                <option>Mark as missed</option><option>Skip</option>
              </select>
            } />
            <SettingsRow label="Weekend Tracking" right={<Toggle checked={settings.weekendTracking} onChange={v => update('weekendTracking', v)} />} />
          </div>

          {/* 5. Focus Timer */}
          <div className="settings-card">
            <div className="settings-card-title"><Timer size={16} /> 5. Focus Timer Settings</div>
            <SettingsRow label="Focus Length" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={`${settings.focusLength} minutes`} onChange={e => update('focusLength', parseInt(e.target.value))}>
                <option value={25}>25 minutes</option><option value={30}>30 minutes</option><option value={45}>45 minutes</option><option value={60}>60 minutes</option>
              </select>
            } />
            <SettingsRow label="Short Break" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={`${settings.shortBreak} minutes`} onChange={e => update('shortBreak', parseInt(e.target.value))}>
                <option value={5}>5 minutes</option><option value={10}>10 minutes</option>
              </select>
            } />
            <SettingsRow label="Long Break" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={`${settings.longBreak} minutes`} onChange={e => update('longBreak', parseInt(e.target.value))}>
                <option value={15}>15 minutes</option><option value={20}>20 minutes</option><option value={30}>30 minutes</option>
              </select>
            } />
            <SettingsRow label="Long Break Interval" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={`${settings.longBreakInterval} sessions`} onChange={e => update('longBreakInterval', parseInt(e.target.value))}>
                <option value={4}>4 sessions</option><option value={3}>3 sessions</option>
              </select>
            } />
            <SettingsRow label="Auto Start Next Session" right={<Toggle checked={settings.autoStart} onChange={v => update('autoStart', v)} />} />
            <SettingsRow label="Ambient Sound" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.ambientSound} onChange={e => update('ambientSound', e.target.value)}>
                <option>Lo-fi Beats</option><option>White Noise</option><option>Nature</option><option>None</option>
              </select>
            } />
          </div>

          {/* 6. Calendar & Notes */}
          <div className="settings-card">
            <div className="settings-card-title"><Calendar size={16} /> 6. Calendar & Notes</div>
            <SettingsRow label="Show Completed Days" right={<Toggle checked={settings.showCompletedDays} onChange={v => update('showCompletedDays', v)} />} />
            <SettingsRow label="Week/Month Default View" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.defaultView} onChange={e => update('defaultView', e.target.value)}>
                <option>Week View</option><option>Month View</option>
              </select>
            } />
            <SettingsRow label="Auto-save Notes" right={<Toggle checked={settings.autoSaveNotes} onChange={v => update('autoSaveNotes', v)} />} />
            <SettingsRow label="Rich Text Editor Default" right={<Toggle checked={settings.richText} onChange={v => update('richText', v)} />} />
          </div>

          {/* 7. Privacy & Data */}
          <div className="settings-card">
            <div className="settings-card-title"><Shield size={16} /> 7. Privacy & Data</div>
            <SettingsRow label="Sync Data Across Devices" right={<Toggle checked={settings.syncData} onChange={v => update('syncData', v)} />} />
            <SettingsRow label="Export Data" right={
              <button className="filter-btn" style={{ display: 'flex', alignItems: 'center', gap: 4 }} onClick={exportData}>
                <Download size={12} /> Export Now
              </button>
            } />
            <SettingsRow label="Backup Frequency" right={
              <select className="form-select" style={{ width: 'auto', fontSize: 12, padding: '4px 22px 4px 8px' }} value={settings.backupFrequency} onChange={e => update('backupFrequency', e.target.value)}>
                <option>Weekly</option><option>Daily</option><option>Monthly</option>
              </select>
            } />
            <SettingsRow label="Import Data" right={
              <button className="filter-btn" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Upload size={12} /> Import
              </button>
            } />
            <SettingsRow label="Two-Factor Authentication" right={<Toggle checked={false} onChange={() => {}} />} />
            <div style={{ marginTop: 16 }}>
              <button onClick={resetData} style={{ width: '100%', padding: '10px', background: 'none', border: '1.5px solid #fecaca', borderRadius: 10, color: '#ef4444', fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Trash2 size={14} /> Delete Account
              </button>
            </div>
          </div>

          {/* 8. App Info */}
          <div className="settings-card">
            <div className="settings-card-title"><HelpCircle size={16} /> 8. App Info / Support</div>
            <SettingsRow label="Version" right={<span style={{ fontSize: 13, color: '#888' }}>v1.2.0</span>} />
            <SettingsRow label="Last Updated" right={<span style={{ fontSize: 13, color: '#888' }}>May 3, 2024</span>} />
            <SettingsRow label="Release Notes" right={
              <button className="filter-btn" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                View Details <ExternalLink size={10} />
              </button>
            } />
            <div className="divider" />
            {[
              { icon: '📚', label: 'Help Center' },
              { icon: '✉️', label: 'Contact Support' },
              { icon: '💬', label: 'Send Feedback' },
            ].map(item => (
              <div key={item.label} className="settings-row" style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{item.icon}</span>
                  <span className="settings-row-label">{item.label}</span>
                </div>
                <ExternalLink size={13} color="#9ca3af" />
              </div>
            ))}
          </div>
        </div>

        {/* Auto-save notice */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, padding: '12px 16px', background: '#fff', border: '1px solid #e3e6ee', borderRadius: 12 }}>
          <span style={{ fontSize: 16 }}>ℹ️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Your settings are automatically saved.</div>
            <div style={{ fontSize: 12, color: '#888' }}>Changes apply across all your devices.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
