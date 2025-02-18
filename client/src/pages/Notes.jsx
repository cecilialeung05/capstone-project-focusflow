import React, { useState } from 'react';
import NoteForm from '../components/NoteForm';
import NoteItem from '../components/NoteItem';
import './Notes.scss';

function Notes({ notes, tasks, tags, addNote, updateNote, deleteNote }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  console.log('Notes component received:', { notes, tasks, tags }); // Debug log

  const handleAddNote = (noteData) => {
    console.log('Adding note with data:', noteData); // Debug log
    addNote(noteData);
    setShowForm(false);
    setSelectedNote(null);
  };

  const handleEditNote = (note) => {
    console.log('Editing note:', note); // Debug log
    setSelectedNote(note);
    setShowForm(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedNote(null);
  };

  // Create a map of task IDs to task titles for quick lookup
  const taskMap = tasks?.reduce((acc, task) => {
    acc[task.id] = task.title;
    return acc;
  }, {});

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2>Notes</h2>
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
        >
          Add Note
        </button>
      </div>

      {showForm && (
        <div className="note-form-container">
          <NoteForm
            note={selectedNote}
            addNote={handleAddNote}
            tasks={tasks}
            tags={tags}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="notes-list">
        {notes.map(note => {
          // Add task title to note object if there's a related task
          const noteWithTask = {
            ...note,
            task_title: note.task_id ? taskMap[note.task_id] : null
          };
          
          return (
            <NoteItem
              key={note.id}
              note={noteWithTask}
              onEdit={() => handleEditNote(noteWithTask)}
              onDelete={() => handleDeleteNote(note.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Notes;