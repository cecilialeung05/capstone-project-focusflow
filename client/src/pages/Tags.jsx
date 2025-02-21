import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TagList from '../components/Tags/TagList';
import tagService from '../services/tagService';
import './Tags.scss';

function Tags({ tags, addTag, updateTag, deleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [taggedItems, setTaggedItems] = useState({ tasks: [], notes: [] });

  useEffect(() => {
    const fetchTaggedItems = async () => {
      if (selectedTag) {
        try {
          const items = await tagService.getTaggedItems(selectedTag.id);
          setTaggedItems(items);
        } catch (error) {
          console.error('Error fetching tagged items:', error);
        }
      } else {
        setTaggedItems({ tasks: [], notes: [] });
      }
    };

    fetchTaggedItems();
  }, [selectedTag]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim() });
      setNewTagName('');
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tags">
      <div className="tags__header">
        <h1>Tags</h1>
        <form onSubmit={handleAddTag} className="tags__form">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name..."
            className="tags__input"
          />
          <button type="submit" className="tags__button">Add Tag</button>
        </form>
      </div>

      <div className="tags__search">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search tags..."
          className="tags__search-input"
        />
      </div>

      <div className="tags__content">
        <div className="tags__list">
          <TagList
            tags={filteredTags}
            selectedTags={selectedTag ? [selectedTag] : []}
            onTagClick={(tag) => setSelectedTag(
              selectedTag?.id === tag.id ? null : tag
            )}
            updateTag={updateTag}
          />
        </div>

        {selectedTag && (
          <div className="tags__details">
            <div className="tags__details-header">
              <h2>Items tagged with "{selectedTag.name}"</h2>
              <button 
                onClick={() => deleteTag(selectedTag.id)}
                className="tags__button tags__button--danger"
              >
                Delete Tag
              </button>
            </div>

            <div className="tags__section">
              <h3>Tasks</h3>
              {taggedItems.tasks.length > 0 ? (
                <ul className="tags__items">
                  {taggedItems.tasks.map(task => (
                    <li key={task.id} className="tags__item">
                      <Link to={`/tasks/${task.id}`} className="tags__link">
                        <span className={`status-dot status-dot--${task.status}`} />
                        {task.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tags__empty">No tasks with this tag</p>
              )}
            </div>

            <div className="tags__section">
              <h3>Notes</h3>
              {taggedItems.notes.length > 0 ? (
                <ul className="tags__items">
                  {taggedItems.notes.map(note => (
                    <li key={note.id} className="tags__item">
                      <Link to={`/notes/${note.id}`} className="tags__link">
                        {note.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="tags__empty">No notes with this tag</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tags;