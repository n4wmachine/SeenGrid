import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import DocRenderer from './components/DocRenderer';
import { getAllDocs, saveDoc, deleteDoc, importFiles } from './lib/storage';
import { categorize, autoName, getCategory, getAllCategories } from './lib/categorizer';

export default function App() {
  const [docs, setDocs] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [editingName, setEditingName] = useState(null);
  const [collapsedCats, setCollapsedCats] = useState({});
  const dragCounter = useRef(0);
  const fileInput = useRef(null);

  const reload = useCallback(async () => {
    const all = await getAllDocs();
    setDocs(all);
    return all;
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const activeDoc = docs.find(d => d.id === activeId);

  const filtered = docs.filter(d => {
    if (tagFilter && !d.tags.includes(tagFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.content.toLowerCase().includes(q);
    }
    return true;
  });

  const grouped = useMemo(() => {
    const groups = {};
    for (const doc of filtered) {
      const cat = doc.category || 'notizen';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(doc);
    }
    const order = getAllCategories().map(c => c.id);
    return order
      .filter(id => groups[id]?.length > 0)
      .map(id => ({ category: getCategory(id), docs: groups[id] }));
  }, [filtered]);

  const allTags = [...new Set(docs.flatMap(d => d.tags))].sort();

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setDragging(false);
    dragCounter.current = 0;
    const files = [...e.dataTransfer.files].filter(f =>
      f.type === 'text/plain' || f.name.endsWith('.txt') || f.name.endsWith('.md') || f.type === ''
    );
    if (!files.length) return;
    const newDocs = await importFiles(files, { categorizeFn: categorize, autoNameFn: autoName });
    await reload();
    if (newDocs.length > 0) setActiveId(newDocs[0].id);
  }, [reload]);

  const handleFileSelect = useCallback(async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    const newDocs = await importFiles(files, { categorizeFn: categorize, autoNameFn: autoName });
    await reload();
    if (newDocs.length > 0) setActiveId(newDocs[0].id);
    e.target.value = '';
  }, [reload]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current <= 0) { setDragging(false); dragCounter.current = 0; }
  };
  const handleDragOver = (e) => e.preventDefault();

  const handleDelete = async (id) => {
    await deleteDoc(id);
    if (activeId === id) setActiveId(null);
    reload();
  };

  const handleAddTag = async () => {
    if (!activeDoc || !tagInput.trim()) return;
    const tag = tagInput.trim().toLowerCase();
    if (activeDoc.tags.includes(tag)) { setTagInput(''); return; }
    const updated = { ...activeDoc, tags: [...activeDoc.tags, tag], updatedAt: Date.now() };
    await saveDoc(updated);
    setTagInput('');
    reload();
  };

  const handleRemoveTag = async (tag) => {
    if (!activeDoc) return;
    const updated = { ...activeDoc, tags: activeDoc.tags.filter(t => t !== tag), updatedAt: Date.now() };
    await saveDoc(updated);
    reload();
  };

  const handleRename = async (id, newName) => {
    const doc = docs.find(d => d.id === id);
    if (!doc || !newName.trim()) return;
    await saveDoc({ ...doc, name: newName.trim(), updatedAt: Date.now() });
    setEditingName(null);
    reload();
  };

  const handleChangeCategory = async (id, newCat) => {
    const doc = docs.find(d => d.id === id);
    if (!doc) return;
    await saveDoc({ ...doc, category: newCat, updatedAt: Date.now() });
    reload();
  };

  const toggleCat = (catId) => {
    setCollapsedCats(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  return (
    <div
      className="app"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {dragging && (
        <div className="drop-overlay">
          <div className="drop-overlay-content">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2bb5b2" strokeWidth="2">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span>Dateien hier ablegen</span>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2bb5b2" strokeWidth="2">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <line x1="8" y1="8" x2="16" y2="8"/>
              <line x1="8" y1="12" x2="14" y2="12"/>
              <line x1="8" y1="16" x2="12" y2="16"/>
            </svg>
            DocLab
          </h1>
          {docs.length > 0 && <span className="doc-count">{docs.length} Dokumente</span>}
        </div>

        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Suchen..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button className="search-clear" onClick={() => setSearch('')}>&times;</button>}
        </div>

        {allTags.length > 0 && (
          <div className="sidebar-tags">
            <button
              className={`tag-chip ${!tagFilter ? 'active' : ''}`}
              onClick={() => setTagFilter(null)}
            >Alle</button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-chip ${tagFilter === tag ? 'active' : ''}`}
                onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              >{tag}</button>
            ))}
          </div>
        )}

        <div className="doc-list">
          {grouped.map(({ category, docs: catDocs }) => (
            <div key={category.id} className="cat-group">
              <button
                className="cat-header"
                onClick={() => toggleCat(category.id)}
              >
                <span className="cat-dot" style={{ background: category.color }} />
                <span className="cat-label">{category.label}</span>
                <span className="cat-count">{catDocs.length}</span>
                <span className={`cat-arrow ${collapsedCats[category.id] ? 'collapsed' : ''}`}>&#9662;</span>
              </button>
              {!collapsedCats[category.id] && catDocs.map(doc => (
                <div
                  key={doc.id}
                  className={`doc-item ${doc.id === activeId ? 'active' : ''}`}
                  onClick={() => setActiveId(doc.id)}
                >
                  <div className="doc-item-header">
                    {editingName === doc.id ? (
                      <input
                        className="rename-input"
                        defaultValue={doc.name}
                        autoFocus
                        onBlur={e => handleRename(doc.id, e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleRename(doc.id, e.target.value);
                          if (e.key === 'Escape') setEditingName(null);
                        }}
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="doc-name"
                        onDoubleClick={(e) => { e.stopPropagation(); setEditingName(doc.id); }}
                      >{doc.name}</span>
                    )}
                    <button
                      className="doc-delete"
                      onClick={e => { e.stopPropagation(); handleDelete(doc.id); }}
                      title="Löschen"
                    >&times;</button>
                  </div>
                  {doc.tags.length > 0 && (
                    <div className="doc-item-tags">
                      {doc.tags.map(t => <span key={t} className="mini-tag">{t}</span>)}
                    </div>
                  )}
                  <span className="doc-date">{new Date(doc.updatedAt).toLocaleDateString('de-DE')}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <button className="import-btn" onClick={() => fileInput.current?.click()}>
          + Dateien importieren
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept=".txt,.md,.text"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </aside>

      <main className="content">
        {activeDoc ? (
          <>
            <header className="doc-header">
              <div className="doc-header-top">
                <h2>{activeDoc.name}</h2>
                <select
                  className="cat-select"
                  value={activeDoc.category || 'notizen'}
                  onChange={e => handleChangeCategory(activeDoc.id, e.target.value)}
                >
                  {getAllCategories().map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <span className="doc-filename">{activeDoc.filename}</span>
              <div className="doc-tags-bar">
                {activeDoc.tags.map(tag => (
                  <span key={tag} className="tag-badge" onClick={() => handleRemoveTag(tag)}>
                    {tag} &times;
                  </span>
                ))}
                <form className="tag-add" onSubmit={e => { e.preventDefault(); handleAddTag(); }}>
                  <input
                    type="text"
                    placeholder="+ Tag"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                  />
                </form>
              </div>
            </header>
            <div className="doc-body">
              <DocRenderer content={activeDoc.content} searchQuery={search} />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2bb5b2" strokeWidth="1.5" opacity="0.4">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <p>Textdateien hierher ziehen<br/>oder links importieren</p>
          </div>
        )}
      </main>
    </div>
  );
}
