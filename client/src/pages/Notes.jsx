import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteItem from '../components/Notes/NoteItem';
import Modal from '../components/Common/Modal';
import { FaFileExport, FaPlus } from 'react-icons/fa';
import './Notes.scss';

function Notes({ notes = [], tasks = [], tags = [], addNote, updateNote, deleteNote }) {
  const [showExport, setShowExport] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTask, setFilterTask] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const navigate = useNavigate();

  const filteredNotes = notes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTask = filterTask === 'all' || note.task_id === filterTask;
      return matchesSearch && matchesTask;
    })
    .sort((a, b) => {
      if (sortBy === 'created') {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return new Date(b.updated_at) - new Date(a.updated_at);
    });

  return (
    <div className="notes">
      <div className="notes__header">
        <h1>Notes</h1>
        <Link to="/notes/new" className="add-note">
          <FaPlus /> Add Note
        </Link>
      </div>

      <div className="notes__controls">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterTask}
          onChange={(e) => setFilterTask(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Tasks</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>{task.title}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="created">Sort by Created Date</option>
          <option value="updated">Sort by Updated Date</option>
        </select>
      </div>

      <div className="notes__grid">
        {filteredNotes.map(note => (
          <div key={note.id} className="notes__card">
            <div className="notes__card-header">
              <h3>
                <Link to={`/notes/${note.id}`}>{note.title}</Link>
              </h3>
              <div className="notes__card-date">
                {new Date(note.created_at).toLocaleString()}
              </div>
            </div>
            <div className="notes__card-content">
              {note.content}
            </div>
            <div className="notes__card-actions">
              <button className="edit" onClick={() => navigate(`/notes/${note.id}`)}>
                Edit
              </button>
              <button className="delete" onClick={() => deleteNote(note.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showExport && selectedNote && (
        <Modal onClose={() => setShowExport(false)}>
          <NoteItem 
            note={selectedNote}
            onClose={() => setShowExport(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default Notes;