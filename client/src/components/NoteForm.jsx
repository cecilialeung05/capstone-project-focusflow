import React, { useState, useEffect } from 'react';
import './NoteForm.scss';

function NoteForm({ note, addNote, tasks, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    task_id: ''
  });

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || '',
        content: note.content || '',
        task_id: note.task_id || ''
      });
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Title and content are required');
      return;
    }

    const noteData = {
      ...formData,
      title: formData.title.trim(),
      content: formData.content.trim(),
      task_id: formData.task_id || null
    };

    addNote(note ? { ...noteData, id: note.id } : noteData);
    
    if (!note) {
      setFormData({
        title: '',
        content: '',
        task_id: ''
      });
    }

    if (onCancel) {
      onCancel();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter note title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Content *</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Enter note content"
          rows="4"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="task_id">Link to Task</label>
        <select
          id="task_id"
          name="task_id"
          value={formData.task_id}
          onChange={handleChange}
        >
          <option value="">No linked task</option>
          {tasks?.map(task => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {note ? 'Update Note' : 'Add Note'}
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;