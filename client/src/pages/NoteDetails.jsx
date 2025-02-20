import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoteForm from '../components/NoteForm';

function NoteDetails({ notes, tasks, tags, updateNote, deleteNote }) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const note = notes.find(n => n.id === Number(noteId));
  const relatedTask = tasks.find(t => t.id === note?.task_id);

  if (!note) {
    return <div>Note not found</div>;
  }

  const handleDelete = () => {
    deleteNote(note.id);
    navigate('/notes');
  };

  return (
    <div className="notes">
      {isEditing ? (
        <div className="notes__form">
          <NoteForm 
            note={note}
            tasks={tasks}
            tags={tags}
            addNote={updateNote}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <>
          <div className="notes__header">
            <h2 className="notes__title">{note.title}</h2>
            {relatedTask && (
              <span className="notes__task-badge">
                Related to: {relatedTask.title}
              </span>
            )}
          </div>
          
          <div className="notes__content">
            <div className="notes__content-body">
              <p className="notes__content-text">{note.content}</p>
            </div>

            {note.tags && note.tags.length > 0 && (
              <div className="notes__content-tags">
                {note.tags.map(tag => (
                  <span key={tag.id} className="notes__content-tag">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="notes__actions">
            <button 
              className="notes__button notes__button--edit"
              onClick={() => setIsEditing(true)}
            >
              Edit Note
            </button>
            <button 
              className="notes__button notes__button--delete"
              onClick={handleDelete}
            >
              Delete Note
            </button>
            <button 
              className="notes__button notes__button--back"
              onClick={() => navigate('/notes')}
            >
              Back to Notes
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default NoteDetails;