import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import NoteItem from '../components/Note/NoteItem';
import { TaskContext } from '../context/TaskContext';
import { NoteContext } from '../context/NoteContext';
import './Notes.scss';

function Notes() {
  const location = useLocation();
  const { tasks } = useContext(TaskContext);
  const { notes, createNote, updateNote, deleteNote, loading, error } = useContext(NoteContext);

  // State
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedTask, setSelectedTask] = useState(location.state?.taskId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created');

  // Initialize new note if coming from task
  useEffect(() => {
    if (location.state?.createNote) {
      setIsCreatingNew(true);
      setSelectedTask(location.state.taskId);
    }
  }, [location.state]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const matchesTask = !selectedTask || note.task_id === selectedTask;
        const matchesSearch = (note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesTask && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'updated':
            return new Date(b.updated_at) - new Date(a.updated_at);
          default: 
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  }, [notes, selectedTask, searchTerm, sortBy]);

  const handleCreateNote = async (_, noteData) => {
    try {
      await createNote({
        ...noteData,
        task_id: selectedTask || null
      });
      setIsCreatingNew(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleUpdateNote = async (id, updatedData) => {
    try {
      await updateNote(id, updatedData);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(id);
      } catch (error) {
        console.error('Error deleting note:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="notes-page">
      <div className="filters-column">
        <div className="filters-section">
          <h3>Filters</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Task</label>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
            >
              <option value="">All Tasks</option>
              {tasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created">Created Date</option>
              <option value="updated">Updated Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      <div className="notes-column">
        <div className="header-title-row">
          <div className="header-left">
            <h1>Notes</h1>
          </div>
          <div className="header-actions">
            <button 
              onClick={() => setIsCreatingNew(true)} 
              className="header-button add-note-button"
              disabled={isCreatingNew}
            >
              Add Note
            </button>
          </div>
        </div>

        <div className="notes-list">
          {isCreatingNew && (
            <NoteItem
              note={{
                title: location.state?.taskTitle ? `Notes for: ${location.state.taskTitle}` : '',
                content: '',
                task_id: location.state?.taskId || null,
                tags: []
              }}
              onEdit={handleCreateNote}
              onDelete={() => setIsCreatingNew(false)}
              isNew={true}
            />
          )}
          
          {filteredNotes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              onEdit={handleUpdateNote}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))}

          {filteredNotes.length === 0 && !isCreatingNew && (
            <div className="empty-state">
              <p>No notes found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Notes;