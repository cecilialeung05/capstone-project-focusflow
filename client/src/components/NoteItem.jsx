import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import './NoteItem.scss';

function NoteItem({ note, updateNote, deleteNote }) {
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

        {note.tags && note.tags.length > 0 && (
          <div className="note-item__tags">
            {note.tags.map(tag => (
              <span key={`note-${note.id}-tag-${tag.id}`} className="tag-badge">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="note-item__actions">
        <Link 
          to={`/notes/${note.id}`} 
          className="edit-btn"
          title="Edit note"
        >
          Edit
        </Link>
        <button 
          className="delete-btn"
          onClick={() => deleteNote(note.id)}
          title="Delete note"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default NoteItem;