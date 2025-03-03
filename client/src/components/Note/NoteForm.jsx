import React, { useState, useEffect } from 'react';
import './NoteForm.scss';

const NoteForm = ({ 
  note, 
  onSubmit, 
  tasks = [],
  tags = [],
  onCancel,
  initialTaskId,
  initialTitle 
}) => {
  const [formData, setFormData] = useState({
    title: initialTitle || '',
    content: note?.content || '',
    task_id: initialTaskId || '',
    tags: note?.tags?.map(tag => tag.id) || []
  });

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

  useEffect(() => {
    if (initialTaskId && tasks?.length > 0) {
      const taskTitle = tasks.find(t => t.id === initialTaskId)?.title;
      if (taskTitle && !formData.title) {
        setFormData(prev => ({
          ...prev,
          title: `New note for: ${taskTitle}`
        }));
      }
    }
  }, [initialTaskId, tasks, formData.title]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit({
        ...formData,
        task_id: formData.task_id || null,
        tags: formData.tags || []
      });
      onCancel?.();
    } catch (error) {
      console.error('Error submitting note:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      tags: selectedOptions
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <div className="note-form__group">
        <label htmlFor="title" className="note-form__label">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title || ''}
          onChange={handleChange}
          required
          className="note-form__input"
        />
      </div>

      <div className="note-form__group">
        <label htmlFor="content" className="note-form__label">Content:</label>
        <textarea
          id="content"
          name="content"
          value={formData.content || ''}
          onChange={handleChange}
          rows={4}
          className="note-form__input note-form__input--textarea"
        />
      </div>

      <div className="note-form__group">
        <label htmlFor="task" className="note-form__label">Related Task:</label>
        <select
          id="task"
          name="task_id"
          value={formData.task_id || ''}
          onChange={handleChange}
          className="note-form__input note-form__input--select"
        >
          <option value="">None</option>
          {tasks?.map(task => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div className="note-form__group">
        <label htmlFor="tags" className="note-form__label">Tags:</label>
        <select
          id="tags"
          name="tags"
          multiple
          value={formData.tags || []}
          onChange={handleTagChange}
          className="note-form__input note-form__input--select note-form__input--tags"
        >
          {tags?.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className="note-form__actions">
        <button type="submit" className="note-form__button note-form__button--primary">
          {note ? 'Update Note' : 'Add Note'}
        </button>
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
};

export default NoteForm;