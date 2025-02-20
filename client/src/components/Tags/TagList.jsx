import React from 'react';
import './TagList.scss';

function TagList({ tags, selectedTags, onTagClick }) {
  return (
    <div className="tag-list">
      {tags.map(tag => (
        <div 
          key={tag.id}
          className={`tag-list__item ${
            selectedTags?.some(t => t.id === tag.id) ? 'tag-list__item--selected' : ''
          }`}
          onClick={() => onTagClick?.(tag)}
        >
          <span className="tag-list__name">{tag.name}</span>
          <span className="tag-list__count">
            {tag.count || 0}
          </span>
        </div>
      ))}
    </div>
  );
}

export default TagList; 