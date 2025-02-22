import React from 'react';
import { Link } from 'react-router-dom';

function PinnedItemsWidget({ 
  pinnedTasks = [], 
  pinnedNotes = [], 
  updateTask, 
  updateNote,
  isAuthenticated 
}) {
  return (
    <div className="pinned-items">
      {(pinnedTasks.length === 0 && pinnedNotes.length === 0) ? (
        <p className="pinned-items__empty">No pinned items</p>
      ) : (
        <>
          {pinnedTasks.length > 0 && (
            <div className="pinned-items__section">
              <h4>Pinned Tasks</h4>
              <ul>
                {pinnedTasks.map(task => (
                  <li key={task.id}>
                    <Link to={`/tasks/${task.id}`}>{task.title}</Link>
                    {isAuthenticated && (
                      <button
                        onClick={() => updateTask({ ...task, isPinned: false })}
                        className="pinned-items__unpin"
                      >
                        Unpin
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {pinnedNotes.length > 0 && (
            <div className="pinned-items__section">
              <h4>Pinned Notes</h4>
              <ul>
                {pinnedNotes.map(note => (
                  <li key={note.id}>
                    <Link to={`/notes/${note.id}`}>{note.title}</Link>
                    {isAuthenticated && (
                      <button
                        onClick={() => updateNote({ ...note, isPinned: false })}
                        className="pinned-items__unpin"
                      >
                        Unpin
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default PinnedItemsWidget; 