import React, { useState } from 'react';
import { FiX, FiSave } from 'react-icons/fi';
import './QuickNoteModal.scss';

function QuickNoteModal({ task, onSave, onClose }) {
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setIsSaving(true);
    try {
      await onSave({
        title: `Quick Note for: ${task.title}`,
        content: noteContent.trim(),
        task_id: task.id,
        tags: []
      });
      setNoteContent('');
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="quick-note-modal">
      <div className="quick-note-modal__content">
        <div className="quick-note-modal__header">
          <h3>Quick Note for: {task.title}</h3>
          <button 
            onClick={onClose} 
            className="quick-note-modal__close"
            disabled={isSaving}
          >
            <FiX />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Type your note here..."
            autoFocus
            disabled={isSaving}
          />
          <div className="quick-note-modal__actions">
            <button 
              type="submit" 
              disabled={!noteContent.trim() || isSaving}
            >
              <FiSave /> {isSaving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuickNoteModal; 