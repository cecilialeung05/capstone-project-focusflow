import React, { useState, useMemo } from 'react';
import NoteForm from '../components/Note/NoteForm';
import NoteItem from '../components/Note/NoteItem';
import './Notes.scss';

function Notes({ notes, tasks, tags, addNote, updateNote, deleteNote }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created'); 

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
          <h1>Notes</h1>
          <button 
            onClick={() => setShowForm(true)} 
            className="primary-action-btn"
          >
            Add Note
          </button>
        </div>

        {showForm && (
          <div className="form-section">
            <NoteForm
              note={selectedNote}
              onSubmit={selectedNote ? updateNote : addNote}
              tasks={tasks}
              tags={tags}
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
                onEdit={() => {
                  setSelectedNote(note);
                  setShowForm(true);
                }}
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
      </div>
    </div>
  );
}

export default Notes;