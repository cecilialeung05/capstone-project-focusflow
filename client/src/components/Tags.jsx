import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import noteService from '../services/noteService';
import { Link, useParams } from 'react-router-dom';
import './Tags.scss';

function Tags({ tags, tasks, notes, addTag, updateTag, deleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim() });
      setNewTagName('');
    }
  };

  const handleEditTag = (tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const handleUpdateTag = () => {
    if (editingTagName.trim()) {
      updateTag(editingTagId, { name: editingTagName.trim() });
      setEditingTagId(null);
      setEditingTagName('');
    }
  };

  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId === selectedTagId ? null : tagId);
  };

  // Filter items based on selected tag
  const filteredTasks = selectedTagId
    ? tasks.filter(task => 
        task.tags && task.tags.some(tag => tag.id === selectedTagId)
      )
    : [];

  const filteredNotes = selectedTagId
    ? notes.filter(note => 
        note.tags && note.tags.some(tag => tag.id === selectedTagId)
      )
    : [];

  // Debug logs
  console.log('All Notes:', notes);
  console.log('Selected Tag ID:', selectedTagId);

  // Debug logs for filtered items
  console.log('Filtered Notes:', filteredNotes);
  console.log('Filtered Tasks:', filteredTasks);

  useEffect(() => {
    // Log for debugging
    if (selectedTagId) {
      console.log('Selected Tag ID:', selectedTagId);
      console.log('All Tasks:', tasks);
      console.log('Filtered Tasks:', filteredTasks);
      console.log('All Notes:', notes);
      console.log('Filtered Notes:', filteredNotes);
    }
  }, [selectedTagId, tasks, notes]);

  return (
    <div className="tags-page">
      <div className="tags-page__header">
        <h1>Tags</h1>
        <div className="tag-creation">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New Tag Name"
          />
          <button onClick={handleCreateTag}>Create Tag</button>
        </div>
      </div>

      <div className="tags-page__content">
        <div className="tags-list">
          {tags.map(tag => (
            <div key={tag.id} className="tag-item">
              {editingTagId === tag.id ? (
                <div className="tag-edit">
                  <input
                    type="text"
                    value={editingTagName}
                    onChange={(e) => setEditingTagName(e.target.value)}
                  />
                  <button onClick={handleUpdateTag}>Save</button>
                  <button onClick={() => setEditingTagId(null)}>Cancel</button>
                </div>
              ) : (
                <div className="tag-display">
                  <button 
                    className={`tag-button ${selectedTagId === tag.id ? 'selected' : ''}`}
                    onClick={() => handleTagClick(tag.id)}
                  >
                    {tag.name}
                  </button>
                  <div className="tag-actions">
                    <button onClick={() => handleEditTag(tag)}>Edit</button>
                    <button onClick={() => deleteTag(tag.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedTagId && (
          <div className="tagged-items">
            <h3>Tasks with this tag:</h3>
            <div className="tasks-list">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <p>No tasks with this tag</p>
              )}
            </div>

            <h3>Notes with this tag:</h3>
            <div className="notes-list">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <NoteItem key={note.id} note={note} />
                ))
              ) : (
                <p>No notes with this tag</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tags;