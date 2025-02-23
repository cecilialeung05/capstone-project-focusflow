import React from 'react';
import './TagSuggestions.scss';

function TagSuggestions({ tags, selectedTags = [], onTagSelect }) {
  // Sort tags by usage count and take only top 8
  const recentTags = [...tags]
    .sort((a, b) => (b.taskCount || 0) - (a.taskCount || 0))
    .slice(0, 8); // Show only top 8 most used tags

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

export default TagSuggestions; 