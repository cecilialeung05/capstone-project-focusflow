import React from 'react';
import NoteForm from '../components/NoteForm';
import NoteItem from '../components/NoteItem';

function Notes({ notes, addNote, updateNote, deleteNote }) {
  return (
    <div>
      <h1>Notes</h1>
      <NoteForm addNote={addNote} />
      <ul>
        {notes.map(note => (
          <NoteItem key={note.id} note={note}  updateNote={updateNote} deleteNote={deleteNote}/>
        ))}
      </ul>
    </div>
  );
}

export default Notes;