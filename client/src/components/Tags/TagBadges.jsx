import React from 'react';
import './TagBadges.scss';

function TagBadges({ tags, itemTags }) {
  // itemTags contains tag_ids, need to look up full tag info
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

export default TagBadges; 