import React, { useState, useEffect } from 'react';
import './Tags.scss';
import TaskItem from './TaskItem';
import NoteItem from './NoteItem';

function Tags({ tags, tasks, notes }) {
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState(tags);

  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId === selectedTagId ? null : tagId);
  };

  useEffect(() => {
    const filtered = tags.filter(tag => 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTags(filtered);
  }, [tags, searchTerm]);

  const filteredNotes = selectedTagId ? notes.filter(note => note.tags?.some(tag => tag.id === selectedTagId)) : [];
  const filteredTasks = selectedTagId ? tasks.filter(task => task.tags?.some(tag => tag.id === selectedTagId)) : [];

  return (
    <div className="tags__container">
      <div className="tags__section">
        <div className="tags__header">
          <h2 className="tags__title">Tags</h2>
          <div className="tags__search">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="tags__search-input"
            />
          </div>
        </div>

        <div className="tags__list">
          {filteredTags.map(tag => (
            <div 
              key={tag.id}
              className={`tags__item ${selectedTagId === tag.id ? 'tags__item--selected' : ''}`}
              onClick={() => handleTagClick(tag.id)}
            >
              <span className="tags__name">{tag.name}</span>
              <span className="tags__count">
                {filteredTasks.length + filteredNotes.length} items
              </span>
            </div>
          ))}
          {filteredTags.length === 0 && (
            <p className="tags__empty">No tags found matching "{searchTerm}"</p>
          )}
        </div>
      </div>
      
      <div className="tags__content">
        {selectedTagId && (
          <>
            <h3>Tasks with this tag:</h3>
            <div className="tags__tasks">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <p className="tags__empty">No tasks with this tag</p>
              )}
            </div>

            <h3>Notes with this tag:</h3>
            <div className="tags__notes">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <NoteItem key={note.id} note={note} />
                ))
              ) : (
                <p className="tags__empty">No notes with this tag</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Tags;