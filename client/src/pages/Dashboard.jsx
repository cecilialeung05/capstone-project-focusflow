import React from 'react';
import './Dashboard.scss';

function Dashboard({ tasks, notes }) {

  const sortByDate = (arr) => {
    return [...arr].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

const recentTasks = sortByDate(tasks).slice(0, 5);
const recentNotes = sortByDate(notes).slice(0, 5);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Recent Tasks</h2>
    <ul>
        {recentTasks ? recentTasks.map(task => (
        <li key={task.id}>{task.title}</li>
        )) : <li> No recent tasks </li>
    }
    </ul>
    <h2>Recent Notes</h2>
    <ul>
        {recentNotes ? recentNotes.map(note => (
        <li key={note.id}>{note.title}</li>
        )) : <li> No recent notes </li>
    }
    </ul>
      <h2>Tasks Summary</h2>
      <ul>
        {tasks.slice(0, 5).map(task => (  
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>
      <h2>Notes Summary</h2>
      <ul>
        {notes.slice(0, 5).map(note => ( 
          <li key={note.id}>{note.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
