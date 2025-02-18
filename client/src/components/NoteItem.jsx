import React from 'react';
import { Link } from 'react-router-dom';
import './NoteItem.scss';

function NoteItem({ note, updateNote, deleteNote }) {
  return (
    <div className="note-item">
      <div className="note-item__content">
        <div className="note-item__header">
          <h3 className="note-item__title">{note.title}</h3>
        </div>
        
        <div className="note-item__body">
          <p className="note-item__content-text">{note.content}</p>
          
          {note.task_id && (
            <div className="note-item__task-info">
              <span className="related-task-badge">
                Related Task: {note.task_title}
              </span>
              <Link 
                to={`/tasks/${note.task_id}`} 
                className="view-task-btn"
                title="View task details"
              >
                View Task Details
              </Link>
            </div>
          )}
        </div>
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