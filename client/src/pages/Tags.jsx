import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './Tags.scss';

function Tags({ tags, tasks, notes, addTag, updateTag, deleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [editTagName, setEditTagName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name'); 

  const tagStats = useMemo(() => {
    return tags.map(tag => ({
      ...tag,
      taskCount: tasks.filter(task => task.tags?.some(t => t.id === tag.id)).length,
      noteCount: notes.filter(note => note.tags?.some(t => t.id === tag.id)).length,
      lastUsed: [...tasks, ...notes]
        .filter(item => item.tags?.some(t => t.id === tag.id))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]?.created_at
    }));
  }, [tags, tasks, notes]);

  const filteredTags = useMemo(() => {
    return tagStats
      .filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'count':
            return (b.taskCount + b.noteCount) - (a.taskCount + a.noteCount);
          case 'recent':
            return new Date(b.lastUsed || 0) - new Date(a.lastUsed || 0);
          default: 
            return a.name.localeCompare(b.name);
        }
      });
  }, [tagStats, searchTerm, sortBy]);

  const filteredItems = useMemo(() => {
    if (!selectedTag) return { tasks: [], notes: [] };

    return {
      tasks: tasks.filter(task => 
        task.tags?.some(tag => tag.id === selectedTag)
      ),
      notes: notes.filter(note => 
        note.tags?.some(tag => tag.id === selectedTag)
      )
    };
  }, [selectedTag, tasks, notes]);

  return (
    <div className="tags-page">
      <div className="tags-header">
        <h1>Tags</h1>
        <div className="tag-management">
          <div className="tag-creation">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="New Tag Name"
              className="tag-input"
            />
            <button 
              onClick={() => {
                if (newTagName.trim()) {
                  addTag({ name: newTagName.trim() });
                  setNewTagName('');
                }
              }}
              className="create-tag-btn"
              disabled={!newTagName.trim()}
            >
              Create Tag
            </button>
          </div>
        </div>
      </div>

      <div className="tags-filters">
        <div className="search-bar">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tags..."
            className="search-input"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="count">Sort by Usage Count</option>
          <option value="recent">Sort by Recent Activity</option>
        </select>
      </div>

      <div className="tags-content">
        <div className="tags-list">
          {filteredTags.map(tag => (
            <div key={tag.id} className="tag-item">
              {editingTag === tag.id ? (
                <div className="tag-edit">
                  <input
                    type="text"
                    value={editTagName}
                    onChange={(e) => setEditTagName(e.target.value)}
                    className="tag-edit-input"
                    autoFocus
                  />
                  <div className="tag-edit-actions">
                    <button 
                      onClick={() => {
                        if (editTagName.trim()) {
                          updateTag(tag.id, { name: editTagName.trim() });
                          setEditingTag(null);
                        }
                      }}
                      className="save-btn"
                      title="Save"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={() => setEditingTag(null)}
                      className="cancel-btn"
                      title="Cancel"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ) : (
                <div className="tag-display">
                  <button 
                    onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                    className={`tag-btn ${selectedTag === tag.id ? 'active' : ''}`}
                  >
                    <span className="tag-name">{tag.name}</span>
                    <span className="tag-stats">
                      {tag.taskCount + tag.noteCount} items
                    </span>
                  </button>
                  <div className="tag-actions">
                    <button 
                      onClick={() => {
                        setEditingTag(tag.id);
                        setEditTagName(tag.name);
                      }}
                      className="edit-btn"
                      title="Edit tag"
                    >
                      ✎
                    </button>
                    <button 
                      onClick={() => {
                        if (window.confirm(`Delete tag "${tag.name}"?`)) {
                          deleteTag(tag.id);
                        }
                      }}
                      className="delete-btn"
                      title="Delete tag"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedTag && (
          <div className="tag-details">
            <h2>Tagged Items</h2>
            <div className="tagged-items">
              <div className="tagged-section">
                <h3>Tasks ({filteredItems.tasks.length})</h3>
                {filteredItems.tasks.length > 0 ? (
                  <ul className="items-list">
                    {filteredItems.tasks.map(task => (
                      <li key={task.id}>
                        <Link to={`/tasks/${task.id}`} className="item-link">
                          <span className={`status-dot ${task.status}`} />
                          <span className="item-title">{task.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No tasks with this tag</p>
                )}
              </div>

              <div className="tagged-section">
                <h3>Notes ({filteredItems.notes.length})</h3>
                {filteredItems.notes.length > 0 ? (
                  <ul className="items-list">
                    {filteredItems.notes.map(note => (
                      <li key={note.id}>
                        <Link to={`/notes/${note.id}`} className="item-link">
                          <span className="item-title">{note.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No notes with this tag</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tags;