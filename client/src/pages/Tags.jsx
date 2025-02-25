import React, { useState, useMemo } from 'react';
import './Tags.scss';

function Tags({ tags, tasks, notes }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredTags = useMemo(() => {
    return tags
      .filter(tag => 
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
  }, [tags, searchTerm, sortBy]);
  
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
    <div className="tags-bar">
      <div className="tags-header">
        <h1>Tags</h1>
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
        </select>
      </div>

      <div className="tags-content">
        <div className="tags-list">
          {filteredTags.map(tag => (
            <div key={tag.id} className="tag-item">
              <div className="tag-display">
                <button 
                  onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                  className={`tag-btn ${selectedTag === tag.id ? 'active' : ''}`}
                >
                  <span className="tag-name">{tag.name}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedTag && (
          <div className="tag-details">
            <div className="tagged-items">
              <div className="tagged-section">
                <h3>Tasks with this tag</h3>
                {filteredItems.tasks.length > 0 ? (
                  <ul className="items-list">
                    {filteredItems.tasks.map(task => (
                      <li key={task.id}>
                        <span className={`status-dot ${task.status}`} />
                        <span className="item-title">{task.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-items">No tasks with this tag</p>
                )}
              </div>

              <div className="tagged-section">
                <h3>Notes with this tag</h3>
                {filteredItems.notes.length > 0 ? (
                  <ul className="items-list">
                    {filteredItems.notes.map(note => (
                      <li key={note.id}>
                        <span className="item-title">{note.title}</span>
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