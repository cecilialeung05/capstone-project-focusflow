import React, { useState } from 'react';
import './Tags.scss';

export function TagBadges({ tags, itemTags }) {
  const tagObjects = itemTags?.map(tagRef => 
    tags.find(tag => tag.id === tagRef.tag_id)
  ).filter(Boolean);

  return (
    <div className="tag-badges">
      {tagObjects?.map(tag => (
        <span key={tag.id} className="tag-badges__item">
          {tag.name}
        </span>
      ))}
    </div>
  );
}

export function TagList({ tags, selectedTags, onTagClick, updateTag }) {
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

export function TagSuggestions({ tags, selectedTags = [], onTagSelect }) {
  const recentTags = [...tags]
    .sort((a, b) => (b.taskCount || 0) - (a.taskCount || 0))
    .slice(0, 8);

  return (
    <div className="tag-suggestions">
      <h3 className="tag-suggestions__title">Recently Used Tags</h3>
      <div className="tag-suggestions__list">
        {recentTags.map(tag => (
          <button
            key={tag.id}
            onClick={() => onTagSelect(tag)}
            className={`tag-suggestions__item ${
              selectedTags.includes(tag.id) ? 'tag-suggestions__item--selected' : ''
            }`}
          >
            {tag.name}
            <span className="tag-suggestions__count">{tag.taskCount || 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 