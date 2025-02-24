import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NoteItem from '../components/Notes/NoteItem';
import Modal from '../components/Layout/Modal';
import { FaFileExport, FaPlus } from 'react-icons/fa';
import { TagList, TagBadges } from '../components/Tags/Tags';
import './Notes.scss';
import { useData } from '../context/DataContext';
// import TagBadges from '../components/Tags/TagBadges';

function Notes() {
  const { notes, tags, tasks } = useData();
  const [showExport, setShowExport] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTask, setFilterTask] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const navigate = useNavigate();
  const [relatedNotes, setRelatedNotes] = useState([]);

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
        <Link to="/notes/new" className="notes__button notes__button--primary">
          <FaPlus /> Add Note
        </Link>
      </div>

      <div className="notes__filters">
        <div className="notes__filters-row">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="notes__search-input"
          />
          <select 
            value={filterTask}
            onChange={(e) => setFilterTask(e.target.value)}
            className="notes__select"
          >
            <option value="all">All Tasks</option>
            {tasks.map(task => (
              <option key={task.id} value={task.id}>{task.title}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="notes__select"
          >
            <option value="created">Sort by Created Date</option>
            <option value="updated">Sort by Updated Date</option>
          </select>
        </div>

        <div className="notes__tag-section">
          <div className="notes__tag-section-header">
            Recently Used Tags
          </div>
          <div className="notes__tag-section-content">
            <TagList 
              tags={tags}
              selectedTags={[]}
              onTagClick={(tag) => {
                const notesWithTag = notes.filter(note => 
                  note.tags.includes(tag.id)
                );
                setRelatedNotes(notesWithTag);
              }}
            />
          </div>
          <div className="notes__tag-section-footer">
            <Link to="/tags" className="notes__manage-tags">
              Manage Tags →
            </Link>
          </div>
        </div>
      </div>

      <div className="notes__content">
        <div className="notes__main">
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
                  <TagBadges 
                    tags={tags} 
                    itemTags={note.note_tags} 
                  />
                  {note.content.substring(0, 100)}...
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
        </div>
        
        <div className="notes__sidebar">
          {relatedNotes.length > 0 && (
            <div className="notes__related">
              <h3>Related Notes</h3>
              <div className="notes__related-list">
                {relatedNotes.map(note => (
                  <Link 
                    key={note.id}
                    to={`/notes/${note.id}`}
                    className="notes__related-item"
                  >
                    {note.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
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