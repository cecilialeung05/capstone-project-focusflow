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
    <div className="notes">
      <div className="notes__header">
        <h2 className="notes__title">Notes</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="notes__button notes__button--primary"
        >
          {showForm ? 'Cancel' : 'Add New Note'}
        </button>
      </div>

      {showForm && (
        <div className="notes__form">
          <NoteForm 
            addNote={addNote}
            tasks={tasks}
            tags={tags}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="notes__filters">
        <div className="notes__filters-search">
          <input
            type="text"
            className="notes__filters-search-input"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="notes__filters-options">
          <select 
            className="notes__filters-select"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
          >
            <option value="">All Tasks</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>

          <select
            className="notes__filters-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created">Sort by Created Date</option>
            <option value="updated">Sort by Updated Date</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>

        <div className="notes__filters-tags">
          {tags.map(tag => (
            <button
              key={tag.id}
              className={`notes__filters-tag ${
                selectedTags.includes(tag.id) ? 'notes__filters-tag--selected' : ''
              }`}
              onClick={() => handleTagToggle(tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      <div className="notes__list">
        {filteredNotes.length > 0 ? (
          filteredNotes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              task={taskMap[note.task_id]}
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
          <div className="notes__empty">
            <p className="notes__empty-message">No notes found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notes;