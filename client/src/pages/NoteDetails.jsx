import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import NoteForm from '../components/Notes/NoteForm';

function NoteDetails({ notes = [], tasks = [], tags = [], updateNote, deleteNote }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const note = notes.find(n => n.id === parseInt(id));

  if (!note) {
    return <Navigate to="/notes" replace />;
  }
  
  const handleSubmit = async (updatedNote) => {
    try {
      await updateNote(updatedNote);
      navigate('/notes', { replace: true });
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
        navigate('/notes', { replace: true });
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleCancel = () => {
    navigate('/notes', { replace: true });
  };

  return (
    <div className="note-details">
      <div className="note-details__header">
        <h2>{note.title}</h2>
      </div>
      <NoteForm
        note={note}
        tasks={tasks}
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}

export default NoteDetails;