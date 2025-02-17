import React from 'react';
import { useParams } from 'react-router-dom';

function NotesDetails({ notes }) {
  const { noteId } = useParams();
  const note = notes.find(note => note.id === parseInt(noteId));

  if (!note) {
    return <div>Note not found.</div>;
  }

  return (
    <div>
      <h1>Note Details</h1>
      <h2>{note.title}</h2>
      <p>{note.content}</p>
      {/* Display other note details */}
    </div>
  );
}

export default NotesDetails;