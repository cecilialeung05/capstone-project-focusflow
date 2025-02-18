import React from 'react';
import NoteForm from '../components/NoteForm';
import NoteItem from '../components/NoteItem';

function Notes({ notes, tasks, addNote, updateNote, deleteNote }) {
  // Create a map of task IDs to task titles for quick lookup
  const taskMap = tasks?.reduce((acc, task) => {
    acc[task.id] = task.title;
    return acc;
  }, {});

  return (
    <div>
      <h1>Notes</h1>
      <NoteForm addNote={addNote} tasks={tasks} />
      <ul>
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
              updateNote={updateNote} 
              deleteNote={deleteNote}
            />
          );
        })}
      </ul>
    </div>
  );
}

export default Notes;