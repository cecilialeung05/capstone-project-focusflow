import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TagList, TagBadges, TagSuggestions } from '../components/Tags/Tags';
import TagGraph from '../components/Graph/TagGraph';
import tagService from '../services/tagService';
import { useData } from '../context/DataContext';
import './Tags.scss';

function Tags({ addTag, updateTag, deleteTag }) {
  const { tags, notes, tasks, setNotes, setTasks, setTags } = useData();
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [taggedItems, setTaggedItems] = useState({ tasks: [], notes: [] });

  console.log('Tags Component Data:', { tags, notes, tasks });

  useEffect(() => {
    const fetchTaggedItems = async (tagId) => {
      if (tagId) {
        try {
          const items = await tagService.getTaggedItems(tagId);
          setTaggedItems(items);
        } catch (error) {
          console.error('Error fetching tagged items:', error);
        }
      } else {
        setTaggedItems({ tasks: [], notes: [] });
      }
    };

    fetchTaggedItems(selectedTagId);
  }, [selectedTagId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await tagService.getAllTags();
        setTags(data.tags);
        setNotes(data.notes);
        setTasks(data.tasks);
        console.log('Tag relationships:', data);
      } catch (error) {
        console.error('Error fetching tag data:', error);
      }
    };

    fetchData();
  }, [setTags, setNotes, setTasks]);

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

  const handleGraphInteraction = (node) => {
    if (node.type === 'tag') {
      setSelectedTagId(node.id);
      // Fetch related items
      fetchTaggedItems(node.id);
    }
  };

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

      <div className="tags__graph">
        <TagGraph 
          tags={tags}
          notes={notes}
          tasks={tasks}
          selectedTagId={selectedTagId}
          onTagSelect={handleGraphInteraction}
        />
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
            selectedTags={selectedTagId ? [selectedTagId] : []}
            onTagClick={(tag) => setSelectedTagId(tag.id)}
            updateTag={updateTag}
          />
        </div>

        {selectedTagId && (
          <div className="tags__details">
            <div className="tags__details-header">
              <h2>Items tagged with "{tags.find(t => t.id === selectedTagId)?.name}"</h2>
              <button 
                onClick={() => deleteTag(selectedTagId)}
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