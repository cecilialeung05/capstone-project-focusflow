import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoteForm from '../components/NoteForm';

function NotesDetails({ notes, tasks, tags, updateNote, deleteNote }) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const note = notes.find(n => n.id === Number(noteId));

  if (!note) {
    return <div>Note not found</div>;
  }

  const handleDelete = () => {
    deleteNote(note.id);
    navigate('/notes');
  };

  return (
    <div className="note-details">
      <h1>Edit Note</h1>
      <NoteForm
        note={note}
        addNote={updateNote}
        tasks={tasks}
        tags={tags}
        onCancel={() => navigate('/notes')}
      />
      <button onClick={handleDelete} className="delete-btn">
        Delete Note
      </button>
    </div>
  );
}

export default NotesDetails;