import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/Common/Modal';
import { FaFileExport, FaSave, FaTrash } from 'react-icons/fa';


function NoteDetails({ notes = [], updateNote, deleteNote }) {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [showExport, setShowExport] = useState(false);
  
  const note = notes.find(n => n.id === parseInt(noteId));
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  if (!note) {
    return <div>Note not found</div>;
  }

  const handleSave = () => {
    const updatedNote = {
      ...note,
      title: title.trim(),
      content: content.trim(),
      updated_at: new Date().toISOString()
    };
    
    updateNote(updatedNote);
    navigate('/notes');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      deleteNote(note.id);
      navigate('/notes');
    }
  };

  return (
    <div className="note-details">
      <div className="note-details__header">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="note-details__title"
        />
        <div className="note-details__actions">
          <button
            onClick={() => setShowExport(true)}
            className="note-details__button note-details__button--export"
            title="Export Note"
          >
            <FaFileExport /> Export
          </button>
          <button
            onClick={handleSave}
            className="note-details__button note-details__button--save"
            title="Save Note"
          >
            <FaSave /> Save
          </button>
          <button
            onClick={handleDelete}
            className="note-details__button note-details__button--delete"
            title="Delete Note"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="note-details__content"
      />

      {showExport && (
        <Modal onClose={() => setShowExport(false)}>
          <NoteExport 
            note={note}
            onClose={() => setShowExport(false)}
          />
        </Modal>
      )}
    </div>
  );
}

export default NoteDetails;