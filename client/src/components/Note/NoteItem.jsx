import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiX, FiExternalLink, FiSave } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import './NoteItem.scss';

function NoteItem({ note, onEdit, onDelete }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: note.title,
    content: note.content
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ title: note.title, content: note.content });
    setTimeout(() => {
      const textarea = document.querySelector(`#note-${note.id}-content`);
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.focus();
      }
    }, 0);
  };

  const handleSave = () => {
    if (editData.title.trim() === '' || editData.content.trim() === '') return;
    onEdit(note.id, editData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-resize textarea
    if (name === 'content') {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditData({ title: note.title, content: note.content });
    }
  };

  return (
    <div className={`note-item ${isEditing ? 'note-item--editing' : ''}`}>
      <div className="note-item__header">
        <div className="note-item__title-container">
          {isEditing ? (
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="note-item__title-input"
              placeholder="Note title..."
              autoFocus
            />
          ) : (
            <h3 
              className="note-item__title"
              onClick={handleEdit}
            >
              {note.title}
            </h3>
          )}
        </div>
        <div className="note-item__actions">
          {isEditing ? (
            <>
              <button 
                className="note-item__button note-item__button--success"
                onClick={handleSave}
                title="Save changes (⌘+Enter)"
              >
                <FiSave />
              </button>
              <button 
                className="note-item__button"
                onClick={() => {
                  setIsEditing(false);
                  setEditData({ title: note.title, content: note.content });
                }}
                title="Cancel editing (Esc)"
              >
                <FiX />
              </button>
            </>
          ) : (
            <>
              <button 
                className="note-item__button"
                onClick={handleEdit}
                title="Edit note"
              >
                <FiEdit2 />
              </button>
              <button 
                className="note-item__button"
                onClick={onDelete}
                title="Delete note"
              >
                <FiTrash2 />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="note-item__content">
        {isEditing ? (
          <textarea
            id={`note-${note.id}-content`}
            name="content"
            value={editData.content}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="note-item__content-input"
            placeholder="Write your note here..."
          />
        ) : (
          <div 
            className="note-item__content-display"
            onClick={handleEdit}
          >
            {note.content}
          </div>
        )}
      </div>

      {showDetails && (
        <div className="note-item__details">
          <div className="note-item__details-actions">
            <Link 
              to={`/notes/${note.id}`}
              className="note-item__button"
              title="Open in full page"
            >
              <FiExternalLink />
            </Link>
            <button 
              className="note-item__button"
              onClick={() => setShowDetails(false)}
              title="Close panel"
            >
              <FiX />
            </button>
          </div>
          <div className="note-item__details-content">
            <div className="note-item__details-line">
              {note.task && (
                <>
                  <span className="note-item__detail--label">Task:</span>
                  <span className="note-item__detail--value">{note.task.title}</span>
                  <span className="note-item__detail--separator">•</span>
                </>
              )}
              <span className="note-item__detail--label">Created:</span>
              <span className="note-item__detail--value">{formatDate(note.created_at)}</span>
              {note.tags && note.tags.length > 0 && (
                <>
                  <span className="note-item__detail--separator">•</span>
                  <span className="note-item__detail--label">Tags:</span>
                  <div className="note-item__tags">
                    {note.tags.map(tag => (
                      <span key={`note-${note.id}-tag-${tag.id}`} className="note-item__tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteItem;