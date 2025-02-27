import React, { useState, useMemo, useEffect } from 'react';
import NoteForm from '../components/Note/NoteForm';
import NoteItem from '../components/Note/NoteItem';
import './Notes.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiClock, FiSmile, FiCoffee } from 'react-icons/fi';

function Notes({ notes, tasks, tags, addNote, updateNote, deleteNote }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created'); 
  const [showEndPrompt, setShowEndPrompt] = useState(false);

  // Handle incoming task context
  useEffect(() => {
    if (location.state?.createNote) {
      setShowForm(true);
      setSelectedTask(location.state.taskId);
    }
  }, [location]);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(note => {
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tagId => note.tags?.some(tag => tag.id === tagId));
        const matchesTask = !selectedTask || note.task_id === selectedTask;
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesTags && matchesTask && matchesSearch;
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
  }, [notes, selectedTags, selectedTask, searchTerm, sortBy]);

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const taskMap = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.id] = task;
      return acc;
    }, {});
  }, [tasks]);

  const handleNoteEdit = async (noteId, updatedData) => {
    console.log('Starting edit with:', { noteId, updatedData });
    try {
      // Just update the note without changing any form state
      await updateNote(noteId, {
        title: updatedData.title,
        content: updatedData.content,
        task_id: selectedTask || null,
        tags: updatedData.tags || [],
      });
      
      console.log('Note updated successfully');
      // Don't set any form-related state here
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleEndSession = () => {
    setShowEndPrompt(true);
  };

  const handleFeedback = (feedback) => {
    setShowEndPrompt(false);
    // Navigate back to tasks page
    navigate('/tasks');
  };

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
              <option value="none">Notes without Tasks</option>
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

          <div className="filter-group">
            <label>Tags</label>
            <div className="tags-filter">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className={`tag-filter-btn ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
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
              onClick={handleEndSession}
              className="header-button end-session-button"
            >
              <FiClock size={18} />
              End Session
            </button>
            <button 
              onClick={() => setShowForm(true)} 
              className="header-button add-note-button"
            >
              Add Note
            </button>
          </div>
        </div>

        {showForm && (
          <div className="form-section">
            <NoteForm
              onSubmit={addNote}
              tasks={tasks}
              tags={tags}
              initialTaskId={location.state?.taskId}
              initialTitle={location.state?.taskTitle ? `Notes for: ${location.state.taskTitle}` : ''}
              onCancel={() => {
                setShowForm(false);
                setSelectedNote(null);
              }}
            />
          </div>
        )}

        <div className="notes-list">
          {filteredNotes.length > 0 ? (
            filteredNotes.map(note => (
              <NoteItem
                key={note.id}
                note={{
                  ...note,
                  task: note.task_id ? taskMap[note.task_id] : null
                }}
                onEdit={handleNoteEdit}
                onDelete={() => {
                  if (window.confirm('Are you sure you want to delete this note?')) {
                    deleteNote(note.id);
                  }
                }}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No notes found matching your filters</p>
            </div>
          )}
        </div>

        {showEndPrompt && (
          <div className="task-action-prompt">
            <div className="prompt-content">
              <h3>How are you feeling after this session?</h3>
              <div className="prompt-actions">
                <button 
                  className="prompt-action-button"
                  onClick={() => handleFeedback('good')}
                >
                  <FiSmile size={24} />
                  <span>Feeling Good!</span>
                </button>
                <button 
                  className="prompt-action-skip"
                  onClick={() => handleFeedback('break')}
                >
                  <FiCoffee size={24} />
                  <span>Need a Break</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;