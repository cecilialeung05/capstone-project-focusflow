import React, { useState, useMemo } from 'react';
import NoteForm from '../components/NoteForm';
import NoteItem from '../components/NoteItem';
import './Notes.scss';

function Notes({ notes, tasks, tags, addNote, updateNote, deleteNote }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTask, setSelectedTask] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created'); // 'created', 'updated', 'title'

  // Filter and sort notes
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
          default: // 'created'
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
            addNote={addNote}
            tasks={tasks}
            tags={tags}
            onCancel={() => {
              setShowForm(false);
              setSelectedNote(null);
            }}
          />
        </div>
      )}

      <div className="notes-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-options">
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

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created">Sort by Created Date</option>
            <option value="updated">Sort by Updated Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

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

      <div className="notes-list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => {
            const noteWithTask = {
              ...note,
              task: note.task_id ? taskMap[note.task_id] : null
            };
            
            return (
              <NoteItem
                key={note.id}
                note={noteWithTask}
                onEdit={() => {
                  setSelectedNote(noteWithTask);
                  setShowForm(true);
                }}
                onDelete={() => {
                  if (window.confirm('Are you sure you want to delete this note?')) {
                    deleteNote(note.id);
                  }
                }}
              />
            );
          })
        ) : (
          <div className="no-notes">
            <p>No notes found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;