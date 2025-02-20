import React, { useState, useEffect } from 'react';
import TagList from '../Tags/TagList';
import './NoteForm.scss';

function NoteForm({ note, addNote, tasks, tags, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    task_id: '',
    tags: []
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting note with data:', formData);

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

    addNote(note ? { ...noteData, id: note.id } : noteData);
    
    if (!note) {
      setFormData({
        title: '',
        content: '',
        task_id: '',
        tags: []
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

  const handleTagChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    console.log('Selected tag IDs:', selectedOptions);
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
          value={formData.title}
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
          value={formData.content}
          onChange={handleChange}
          rows={4}
          className="note-form__textarea"
        />
      </div>

      <div className="note-form__group">
        <label htmlFor="task" className="note-form__label">Related Task:</label>
        <select
          id="task"
          name="task_id"
          value={formData.task_id}
          onChange={handleChange}
          className="note-form__select"
        >
          <option value="">None</option>
          {tasks.map(task => (
            <option key={task.id} value={task.id}>
              {task.title}
            </option>
          ))}
        </select>
      </div>

      <div className="note-form__group">
        <label className="note-form__label">Tags</label>
        <TagList 
          tags={tags}
          selectedTags={formData.tags}
          onTagClick={(tag) => {
            setFormData(prev => ({
              ...prev,
              tags: prev.tags.some(t => t === tag.id)
                ? prev.tags.filter(t => t !== tag.id)
                : [...prev.tags, tag.id]
            }));
          }}
        />
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
}

export default NoteForm;