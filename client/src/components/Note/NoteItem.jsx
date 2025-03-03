import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiX, FiExternalLink, FiSave, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import './NoteItem.scss';

function NoteItem({ note, onEdit, onDelete, isNew = false }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(isNew);
  const [showDetails, setShowDetails] = useState(false);
  const [editData, setEditData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    task_id: note?.task_id || null,
    tags: note?.tags || []
  });

  useEffect(() => {
    if (isNew) {
      const titleInput = document.querySelector('.note-item__title-input');
      if (titleInput) {
        titleInput.focus();
      }
    }
  }, [isNew]);

  useEffect(() => {
    if (!isNew && note) {
      setEditData({
        title: note.title || '',
        content: note.content || '',
        task_id: note.task_id || null,
        tags: note.tags || []
      });
    }
  }, [note, isNew]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ title: note.title, content: note.content, task_id: note.task_id, tags: note.tags || [] });
    setTimeout(() => {
      const textarea = document.querySelector(`#note-${note.id}-content`);
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        textarea.focus();
      }
    }, 0);
  };

  const handleSave = async () => {
    if (editData.title.trim() === '' || editData.content.trim() === '') return;
    
    try {
      await onEdit(note?.id, {
        ...editData,
        title: editData.title.trim(),
        content: editData.content.trim(),
        task_id: editData.task_id,
        tags: editData.tags
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      if (isNew) {
        onDelete();
      } else {
        setIsEditing(false);
        setEditData({
          title: note.title,
          content: note.content,
          task_id: note.task_id,
          tags: note.tags || []
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'content' && e.target.tagName.toLowerCase() === 'textarea') {
      e.target.style.height = 'auto';
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleTaskClick = (e) => {
    e.preventDefault();
    navigate(`/tasks`, { state: { selectedTaskId: note.task_id } });
  };

  return (
    <div className={`note-item ${isEditing ? 'note-item--editing' : ''} ${isNew ? 'note-item--new' : ''}`}>
      <div className="note-item__header">
        <div className="note-item__title-container">
          {isEditing || isNew ? (
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="note-item__title-input"
              placeholder="Note title..."
              autoFocus={isNew}
            />
          ) : (
            <h3 className="note-item__title" onClick={() => setIsEditing(true)}>
              {note.title}
            </h3>
          )}
        </div>
        <div className="note-item__actions">
          {isEditing || isNew ? (
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
                  if (isNew) {
                    onDelete();
                  } else {
                    setIsEditing(false);
                    setEditData({
                      title: note.title,
                      content: note.content,
                      task_id: note.task_id,
                      tags: note.tags || []
                    });
                  }
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
                onClick={() => setShowDetails(!showDetails)}
                title={showDetails ? "Hide details" : "Show details"}
              >
                {showDetails ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              <button 
                className="note-item__button"
                onClick={() => setIsEditing(true)}
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
        {isEditing || isNew ? (
          <textarea
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
            onClick={() => setIsEditing(true)}
          >
            {note.content}
          </div>
        )}
      </div>

      {showDetails && !isNew && (
        <div className="note-item__details">
          <div className="note-item__details-content">
            <div className="note-item__details-line">
              <span className="note-item__detail--label">Created:</span>
              <span className="note-item__detail--value">{formatDate(note.created_at)}</span>
              
              {note.task_id && (
                <>
                  <span className="note-item__detail--separator">•</span>
                  <span className="note-item__detail--label">Task:</span>
                  <a 
                    href="#"
                    onClick={handleTaskClick}
                    className="note-item__detail--link"
                  >
                    {note.task?.title || 'View Task'} <FiExternalLink size={12} />
                  </a>
                </>
              )}
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="note-item__tags-container">
                <span className="note-item__detail--label">Tags:</span>
                <div className="note-item__tags">
                  {note.tags.map(tag => (
                    <span key={tag.id} className="note-item__tag">
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NoteItem;