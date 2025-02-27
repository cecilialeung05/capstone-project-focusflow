import React, { useState, useMemo } from 'react';
import './Tags.scss';

// Define tag groups with ordered arrays and colors
const TAG_GROUPS = {
  'Work Type': {
    tags: ['Deep Focus', 'Light Work'],
    colors: {
      'Deep Focus': '#465669', // More muted navy
      'Light Work': '#779eb7'  // Softer blue
    }
  },
  'Energy Level': {
    tags: ['Feeling Good', 'Feeling Tired'],
    colors: {
      'Feeling Good': '#6b9e81', // Muted sage green
      'Feeling Tired': '#a3adb7'  // Softer gray
    }
  },
  'Time of Day': {
    tags: ['Morning Session', 'Afternoon Session'],
    colors: {
      'Morning Session': '#d4b95e',    // Muted gold
      'Afternoon Session': '#c17f59'   // Muted terracotta
    }
  },
  'Duration': {
    tags: ['25min', '50min'],
    colors: {
      '25min': '#8e7b9f',  // Muted lavender
      '50min': '#6b5b7b'   // Deeper muted purple
    }
  }
};

function Tags({ tags, tasks, notes }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  
  // Group and filter tags by search term
  const groupedTags = useMemo(() => {
    const filtered = searchTerm
      ? tags.filter(tag => 
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : tags;

    const grouped = {};
    filtered.forEach(tag => {
      // Find which group this tag belongs to
      const group = Object.entries(TAG_GROUPS).find(([_, groupData]) => 
        groupData.tags.includes(tag.name)
      )?.[0];
      
      if (group) {
        grouped[group] = grouped[group] || [];
        grouped[group].push(tag);
      }
    });
    return grouped;
  }, [tags, searchTerm]);

  // Filter items by selected tag
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
        <div className="search-container">
          <input
            type="text"
            placeholder="Search tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="tags-content">
        <div className="tags-list">
          {Object.entries(groupedTags).map(([groupName, groupTags]) => (
            <div key={groupName} className="tag-group">
              <h3 className="tag-group-title">{groupName}</h3>
              <div className="tag-group-items">
                {groupTags.map(tag => {
                  const tagColor = TAG_GROUPS[groupName]?.colors[tag.name];
                  return (
                    <button 
                      key={tag.id}
                      onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
                      className={`tag-btn ${selectedTag === tag.id ? 'active' : ''}`}
                      style={{
                        backgroundColor: selectedTag === tag.id ? tagColor : 'white',
                        color: selectedTag === tag.id ? 'white' : tagColor,
                        borderColor: tagColor
                      }}
                    >
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          {Object.keys(groupedTags).length === 0 && (
            <p className="no-results">No tags found matching "{searchTerm}"</p>
          )}
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