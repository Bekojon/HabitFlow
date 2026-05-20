import React, { useState } from 'react'
import { Pin, MoreHorizontal, X, Bold, Italic, Underline, List, Link } from 'lucide-react'

const CAT_FILTERS = ['All Categories', 'Daily', 'Ideas', 'Goals', 'Journal', 'Study']

export default function Notes({ notes, setNotes, search, showPanel, setShowPanel }) {
  const [filter, setFilter] = useState('All Notes')
  const [filterCat, setFilterCat] = useState('All Categories')
  const [selectedNote, setSelectedNote] = useState(notes[1] || null)
  const [editForm, setEditForm] = useState(selectedNote || {})

  const filtered = notes.filter(n => {
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All Notes' || (filter === 'Pinned' && n.pinned) || (filter === 'Recent' && !n.pinned) || (filter === 'Archived' && n.archived)
    const matchCat = filterCat === 'All Categories' || n.category === filterCat
    return matchSearch && matchFilter && matchCat
  })

  const selectNote = (n) => {
    setSelectedNote(n)
    setEditForm({ ...n })
    setShowPanel(true)
  }

  const saveNote = () => {
    if (!editForm.title) return
    if (selectedNote) {
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, ...editForm, updatedAt: 'Just now' } : n))
    } else {
      setNotes(prev => [...prev, { ...editForm, id: Date.now(), pinned: false, createdAt: 'Today', updatedAt: 'Just now' }])
    }
  }

  const deleteNote = () => {
    if (!selectedNote) return
    setNotes(prev => prev.filter(n => n.id !== selectedNote.id))
    setSelectedNote(null)
    setShowPanel(false)
  }

  const togglePin = (id, e) => {
    e.stopPropagation()
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n))
  }

  const createNew = () => {
    setSelectedNote(null)
    setEditForm({ title: '', category: 'Daily', tags: [], content: '' })
    setShowPanel(true)
  }

  return (
    <div className="page-area">
      <div className="page-scroll">
        {/* Stats */}
        <div className="stat-cards">
          {[
            { icon: '📄', label: 'Total Notes', value: notes.length, sub: 'All time' },
            { icon: '📌', label: 'Pinned Notes', value: notes.filter(n => n.pinned).length, sub: 'Important notes' },
            { icon: '✏️', label: "Today's Notes", value: notes.filter(n => n.createdAt?.includes('Today')).length, sub: 'Created today' },
            { icon: '🕐', label: 'Last Edited', value: '2 min ago', sub: 'Workout Plan' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-card-icon">{s.icon}</div>
              <div className="stat-card-value" style={{ fontSize: i === 3 ? 18 : 26 }}>{s.value}</div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="filter-bar">
          {[
            { label: 'All Notes', count: notes.length },
            { label: 'Pinned', count: notes.filter(n => n.pinned).length },
            { label: 'Recent', count: 12 },
            { label: 'Archived', count: 4 },
          ].map(f => (
            <button key={f.label} className={`filter-btn ${filter === f.label ? 'active-count' : ''}`} onClick={() => setFilter(f.label)}>
              {f.label} {f.count}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            <button className="icon-btn" style={{ border: '1px solid #e3e6ee' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button className="icon-btn" style={{ border: '1px solid #e3e6ee' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="filter-bar">
          {CAT_FILTERS.map(cat => (
            <button key={cat} className={`filter-btn ${filterCat === cat ? 'active' : ''}`} onClick={() => setFilterCat(cat)}>
              {cat}
            </button>
          ))}
          <button className="filter-btn">+ Add Category</button>
        </div>

        {/* Notes Grid */}
        <div className="notes-grid">
          {filtered.map(note => (
            <div key={note.id} className={`note-card ${selectedNote?.id === note.id ? 'selected' : ''}`} onClick={() => selectNote(note)}>
              <div className="note-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, background: '#f3f4f6', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>
                    {note.category === 'Daily' ? '☀️' : note.category === 'Study' ? '📚' : note.category === 'Goals' ? '🎯' : note.category === 'Ideas' ? '💡' : '📄'}
                  </div>
                  <span className="note-card-title">{note.title}</span>
                </div>
                <button onClick={e => togglePin(note.id, e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: note.pinned ? '#111' : '#ccc', padding: 0 }}>
                  <Pin size={13} fill={note.pinned ? '#111' : 'none'} />
                </button>
              </div>
              <p className="note-card-snippet">{note.content}</p>
              <div className="note-tags">
                {note.tags?.slice(0, 3).map(tag => <span key={tag} className="note-tag">{tag}</span>)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="note-footer">{note.createdAt}</span>
                <button className="icon-btn" onClick={e => { e.stopPropagation() }}><MoreHorizontal size={13} /></button>
              </div>
            </div>
          ))}

          <div className="note-card" style={{ borderStyle: 'dashed', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }} onClick={createNew}>
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>+</div>
              <div style={{ fontSize: 13 }}>New Note</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Note Editor */}
      {showPanel && (
        <div className="right-panel" style={{ width: 320, minWidth: 320 }}>
          <div className="right-panel-header">
            <span className="right-panel-title">Note Details</span>
            <button className="close-btn" onClick={() => setShowPanel(false)}><X size={14} /></button>
          </div>
          <div className="right-panel-body">
            <div className="form-group">
              <label className="form-label">Note Title</label>
              <input className="form-input" placeholder="Note title..." value={editForm.title || ''} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={editForm.category || 'Daily'} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}>
                  {['Daily', 'Ideas', 'Goals', 'Journal', 'Study', 'Health'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input className="form-input" placeholder="Add tags..." value={(editForm.tags || []).join(', ')} onChange={e => setEditForm(f => ({ ...f, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) }))} />
              </div>
            </div>

            {/* Tags display */}
            {editForm.tags?.length > 0 && (
              <div className="note-tags" style={{ marginBottom: 12 }}>
                {editForm.tags.map(tag => (
                  <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', background: '#f3f4f6', borderRadius: 20, fontSize: 11 }}>
                    {tag}
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, lineHeight: 1 }} onClick={() => setEditForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}>×</button>
                  </div>
                ))}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Note Content</label>
              {/* Simple toolbar */}
              <div style={{ display: 'flex', gap: 4, padding: '6px 8px', border: '1px solid #e3e6ee', borderBottom: 'none', borderRadius: '9px 9px 0 0', background: '#f9fafb' }}>
                {[<Bold size={12}/>, <Italic size={12}/>, <Underline size={12}/>, <List size={12}/>, <Link size={12}/>].map((icon, i) => (
                  <button key={i} className="icon-btn" style={{ width: 24, height: 24 }}>{icon}</button>
                ))}
              </div>
              <textarea
                className="form-textarea"
                placeholder="Write your note here..."
                style={{ minHeight: 200, borderRadius: '0 0 9px 9px', borderTop: 'none' }}
                value={editForm.content || ''}
                onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <button className="delete-btn" style={{ flex: 1, margin: 0 }} onClick={deleteNote}>
                🗑 Delete Note
              </button>
              <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                ✓ Saved 2 min ago
              </div>
              <button className="save-btn" style={{ flex: 1, margin: 0, padding: '9px' }} onClick={saveNote}>Save Note</button>
            </div>

            {/* Notes Insights */}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Notes Insights</span>
              <button className="view-all-btn">View all insights →</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { icon: '📝', label: 'Words', value: editForm.content?.split(' ').filter(Boolean).length || 0, sub: 'Total words' },
                { icon: '🔤', label: 'Characters', value: editForm.content?.length || 0, sub: 'No. of characters' },
                { icon: '🕐', label: 'Updated', value: '2 min ago', sub: 'Last edited' },
                { icon: '📅', label: 'Created', value: editForm.createdAt || 'Today', sub: '10:20 AM' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#f9fafb', borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 14 }}>{s.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{s.label}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af' }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
