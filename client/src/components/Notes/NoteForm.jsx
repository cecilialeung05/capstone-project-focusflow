import React, { useState, useEffect } from 'react';
import TagList from '../Tags/TagList';
import './NoteForm.scss';

function NoteForm({ note, tasks, tags, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    task_id: '',
    tags: []
  });

  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        task_id: note.task_id || '',
        tags: note.tags?.map(tag => tag.id) || []
      });
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    const noteData = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
      task_id: formData.task_id || null,
      tags: formData.tags.map(Number)
    };

    onSubmit(note ? { ...noteData, id: note.id } : noteData);
  };

  const handleExport = () => {
    const content = JSON.stringify(formData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `note-${formData.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <div className="note-form__group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="note-form__group">
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          rows={4}
        />
      </div>

      <div className="note-form__group">
        <label htmlFor="task">Related Task:</label>
        <select
          id="task"
          name="task_id"
          value={formData.task_id}
          onChange={(e) => setFormData(prev => ({ ...prev, task_id: e.target.value }))}
        >
          <option value="">None</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>{task.title}</option>
          ))}
        </select>
      </div>

      <div className="note-form__group">
        <label>Tags</label>
        <TagList 
          tags={tags}
          selectedTags={formData.tags}
          onTagClick={(tag) => {
            setFormData(prev => ({
              ...prev,
              tags: prev.tags.includes(tag.id)
                ? prev.tags.filter(id => id !== tag.id)
                : [...prev.tags, tag.id]
            }));
          }}
        />
      </div>

      <div className="note-form__actions">
        <button type="submit" className="note-form__button note-form__button--primary">
          {note ? 'Update Note' : 'Add Note'}
        </button>
        {note && (
          <button 
            type="button" 
            onClick={handleExport}
            className="note-form__button note-form__button--export"
          >
            Export
          </button>
        )}
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="note-form__button note-form__button--secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;