import React from 'react';

function NoteItem({ note, updateNote, deleteNote }) {
  return (
    <li>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <p>Task ID: {note.task_id || 'None'}</p> {/* Display linked task ID */}
      <button onClick={() => deleteNote(note.id)}>Delete</button>
    </li>
  );
}

export default NoteItem;