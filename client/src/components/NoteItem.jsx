import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const NoteItem = memo(({ note, updateNote, deleteNote }) => {
  return (
    <li>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
      <p>Task ID: {note.task_id|| 'None'}</p> 
      {note.task_id && (
        <h3>
          <Link to={`/tasks/${note.task_id}`}>
            {note.task_title || 'View Related Task'}
          </Link>
        </h3>
      )}
      <button onClick={() => deleteNote(note.id)}>Delete</button>
    </li>
  );
});

NoteItem.displayName = 'NoteItem';

export default NoteItem;