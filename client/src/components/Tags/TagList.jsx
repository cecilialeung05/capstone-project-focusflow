import React, { useState } from 'react';

function TagList({ tags, selectedTags, onTagClick, updateTag }) {
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');

  const handleDoubleClick = (tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const handleTagUpdate = async (tag) => {
    try {
      await updateTag(tag.id, { ...tag, name: editingTagName });
      setEditingTagId(null);
      setEditingTagName('');
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const handleKeyPress = (e, tag) => {
    if (e.key === 'Enter') {
      handleTagUpdate(tag);
    } else if (e.key === 'Escape') {
      setEditingTagId(null);
      setEditingTagName('');
    }
  };

  return (
    <div className="tag-list">
      {tags.map(tag => (
        <div 
          key={tag.id}
          className={`tag-list__item ${
            selectedTags?.some(t => t.id === tag.id) ? 'tag-list__item--selected' : ''
          }`}
          onClick={() => onTagClick?.(tag)}
          onDoubleClick={() => handleDoubleClick(tag)}
        >
          {editingTagId === tag.id ? (
            <input
              type="text"
              value={editingTagName}
              onChange={(e) => setEditingTagName(e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, tag)}
              onBlur={() => handleTagUpdate(tag)}
              autoFocus
              className="tag-list__input"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="tag-list__name">{tag.name}</span>
              <span className="tag-list__count">
                {tag.count || 0}
              </span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default TagList; 