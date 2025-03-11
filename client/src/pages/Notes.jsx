import React, { useState, useMemo, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import NoteItem from '../components/Note/NoteItem';
import { TaskContext } from '../context/TaskContext';
import { NoteContext } from '../context/NoteContext';
import './Notes.scss';
import { FiPlus } from 'react-icons/fi';

function Notes() {
  const location = useLocation();
  const { tasks } = useContext(TaskContext);
  const { notes, createNote, updateNote, deleteNote, loading, error } = useContext(NoteContext);

  // State
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [selectedTask, setSelectedTask] = useState(location.state?.taskId || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [activeTab, setActiveTab] = useState('All');

  // Initialize new note if coming from task
  useEffect(() => {
    if (location.state?.createNote) {
      console.log('Received state from Tasks:', location.state);
      setIsCreatingNew(true);
      // Ensure taskId is a number
      setSelectedTask(location.state.taskId ? parseInt(location.state.taskId) : '');
      // Set the active tab to the task's notes if coming from a task
      if (location.state.taskId) {
        const task = tasks.find(t => t.id === location.state.taskId);
        if (task) {
          setActiveTab(task.title);
        }
      }
    }
  }, [location.state, tasks]);

  // Get unique task titles for tabs
  const noteTabs = useMemo(() => {
    const taskTabs = [...new Set(notes
      .filter(note => note.task_id)
      .map(note => {
        const task = tasks.find(t => t.id === note.task_id);
        return task ? task.title : null;
      })
      .filter(Boolean)
    )];
    
    return ['All', 'Unassigned', ...taskTabs];
  }, [notes, tasks]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        // Tab filtering
        if (activeTab === 'All') {
          return true;
        }
        if (activeTab === 'Unassigned') {
          return !note.task_id;
        }
        const task = tasks.find(t => t.id === note.task_id);
        return task && task.title === activeTab;
      })
      .filter(note => {
        // Search filtering
        const matchesSearch = (note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
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
  }, [notes, activeTab, searchTerm, sortBy, tasks]);

  const handleCreateNote = async (_, noteData) => {
    try {
      // Log the incoming data
      console.log('Incoming note data:', noteData);
      
      // Ensure we're sending a plain object with the correct structure
      const noteToCreate = {
        title: noteData.title,
        content: noteData.content,
        // Only include task_id if it's a valid number
        ...(noteData.task_id ? { task_id: parseInt(noteData.task_id) } : {}),
        tags: noteData.tags || []
      };

      console.log('Formatted note to create:', noteToCreate);
      await createNote(noteToCreate);
      setIsCreatingNew(false);
    } catch (error) {
      console.error('Create note error:', {
        data: error.response?.data,
        status: error.response?.status
      });
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
      <div className="sidebar">
        <div className="tabs-section">
          {noteTabs.map(tab => (
            <div 
              key={tab}
              className={`tab-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
              {tab !== 'All' && tab !== 'Unassigned' && (
                <span className="count-badge">
                  {notes.filter(note => {
                    const task = tasks.find(t => t.id === note.task_id);
                    return task && task.title === tab;
                  }).length}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="header-actions">
          <button 
            onClick={() => setIsCreatingNew(true)} 
            className="add-note-button"
            disabled={isCreatingNew}
          >
            <FiPlus /> Add New Note
          </button>
        </div>

        <div className="filters-section">
          <div className="filters-container">
            <div className="filters-row">
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="created">Created Date</option>
                <option value="updated">Updated Date</option>
                <option value="title">Title</option>
              </select>

              <select 
                value={selectedTask} 
                onChange={(e) => setSelectedTask(e.target.value)}
                className="filter-select"
              >
                <option value="">Task</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>{task.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="notes-list">
          {isCreatingNew && (
            <NoteItem
              note={{
                title: location.state?.taskTitle ? `Notes for: ${location.state.taskTitle}` : '',
                content: '',
                // Ensure task_id is a number if present
                task_id: location.state?.taskId ? parseInt(location.state.taskId) : undefined,
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