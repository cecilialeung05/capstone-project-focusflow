import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import './NoteList.scss';

function NoteList({ notes, onNoteUpdate, onNoteDelete, tags }) {
  return (
    <div className="note-list">
      {notes.length > 0 ? (
        <div className="note-list__grid">
          {notes.map(note => (
            <div key={note.id} className="note-list__item">
              <div className="note-list__item-header">
                <h3>
                  <Link to={`/notes/${note.id}`}>{note.title}</Link>
                </h3>
                <span className="note-list__item-date">
                  {formatDate(new Date(note.created_at))}
                </span>
              </div>
              
              <div className="note-list__item-content">
                {note.content?.substring(0, 150)}
                {note.content?.length > 150 && '...'}
              </div>

              {note.tags?.length > 0 && (
                <div className="note-list__item-tags">
                  {note.tags.map(tagId => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <span key={tag.id} className="note-list__item-tag">
                        {tag.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}

              <div className="note-list__item-actions">
                <Link 
                  to={`/notes/${note.id}`} 
                  className="note-list__item-button note-list__item-button--edit"
                >
                  Edit
                </Link>
                <button 
                  className="note-list__item-button note-list__item-button--delete"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this note?')) {
                      onNoteDelete(note.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="note-list__empty">
          <p>No notes found</p>
        </div>
      )}
    </div>
  );
}

export default NoteList; 