import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import './NoteItem.scss';

function NoteItem({ note, task, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="note-item">
      <div className="note-item__content">
        <div className="note-item__header">
          <h3 className="note-item__title">
            <Link to={`/notes/${note.id}`}>{note.title}</Link>
          </h3>
          <span className="note-item__date">
            {formatDate(note.created_at)}
          </span>
        </div>

        <p className="note-item__text">{note.content}</p>

        {task && (
          <div className="note-item__task">
            <span className="note-item__task-label">Related Task:</span>
            <Link to={`/tasks/${task.id}`} className="note-item__task-link">
              {task.title}
            </Link>
          </div>
        )}

        {note.tags?.length > 0 && (
          <div className="note-item__tags">
            {note.tags.map(tag => (
              <span key={tag.id} className="note-item__tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="note-item__actions">
        <button 
          className="note-item__button note-item__button--edit"
          onClick={() => navigate(`/notes/${note.id}`)}
        >
          Edit
        </button>
        <button 
          className="note-item__button note-item__button--delete"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;