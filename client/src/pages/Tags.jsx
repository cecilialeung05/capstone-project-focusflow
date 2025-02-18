import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Tags.scss';

function Tags({ tags, tasks, notes, addTag, updateTag, deleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [editingTag, setEditingTag] = useState(null);
  const [editTagName, setEditTagName] = useState('');

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }
    addTag({ name: newTagName.trim() });
    setNewTagName('');
  };

  const handleSelectTag = (tagId) => {
    setSelectedTag(tagId === selectedTag ? null : tagId);
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag.id);
    setEditTagName(tag.name);
  };

  const handleUpdateTag = () => {
    if (!editTagName.trim()) {
      alert('Please enter a tag name');
      return;
    }
    updateTag(editingTag, { ...tags.find(t => t.id === editingTag), name: editTagName.trim() });
    setEditingTag(null);
    setEditTagName('');
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setEditTagName('');
  };

  // Filter tasks based on selected tag
  const filteredTasks = selectedTag
    ? tasks.filter(task => 
        task.tags && task.tags.some(tag => tag.id === selectedTag)
      )
    : [];

  // Filter notes based on selected tag
  const filteredNotes = selectedTag
    ? notes.filter(note => 
        note.tags && note.tags.some(tag => tag.id === selectedTag)
      )
    : [];

  const selectedTagName = tags.find(t => t.id === selectedTag)?.name;

  return (
    <div className="tags-page">
      <div className="tags-header">
        <h1>Tags</h1>
        <div className="tag-creation">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New Tag Name"
            className="tag-input"
          />
          <button 
            onClick={handleCreateTag}
            className="create-tag-btn"
          >
            Create Tag
          </button>
        </div>
      </div>

      <div className="tags-content">
        <div className="tags-list">
          <h2>Available Tags</h2>
          <ul>
            {tags.map(tag => (
              <li key={tag.id}>
                {editingTag === tag.id ? (
                  <div className="tag-edit">
                    <input
                      type="text"
                      value={editTagName}
                      onChange={(e) => setEditTagName(e.target.value)}
                      className="tag-edit-input"
                    />
                    <button 
                      onClick={handleUpdateTag}
                      className="save-tag-btn"
                      title="Save tag"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="cancel-edit-btn"
                      title="Cancel edit"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleSelectTag(tag.id)}
                      className={`tag-btn ${selectedTag === tag.id ? 'active' : ''}`}
                    >
                      {tag.name}
                    </button>
                    <div className="tag-actions">
                      <button 
                        onClick={() => handleEditTag(tag)}
                        className="edit-tag-btn"
                        title="Edit tag"
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => deleteTag(tag.id)}
                        className="delete-tag-btn"
                        title="Delete tag"
                      >
                        ×
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {selectedTag && (
          <div className="filtered-content">
            <h2>Items Tagged with "{selectedTagName}"</h2>
            
            <div className="filtered-section">
              <h3>Tasks</h3>
              {filteredTasks.length > 0 ? (
                <ul>
                  {filteredTasks.map(task => (
                    <li key={task.id}>
                      <Link to={`/tasks/${task.id}`}>
                        {task.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No tasks found with this tag.</p>
              )}
            </div>

            <div className="filtered-section">
              <h3>Notes</h3>
              {filteredNotes.length > 0 ? (
                <ul>
                  {filteredNotes.map(note => (
                    <li key={note.id}>
                      <Link to={`/notes/${note.id}`}>
                        {note.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-items">No notes found with this tag.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tags;