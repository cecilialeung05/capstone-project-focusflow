import React, { useState, useEffect } from 'react';
import TagList from './TagList';
import './TaskForm.scss';

function TaskForm({ task, addTask, tags, onCancel }) {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'open',
    tags: [] 
  });


  useEffect(() => {
    if (task) {

      const formattedDate = task.due_date ? 
        new Date(task.due_date).toISOString().split('T')[0] : '';
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        due_date: formattedDate,
        status: task.status || 'open',
        tags: task.tags?.map(tag => tag.id) || [] 
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim()
    };

    addTask(task ? { ...taskData, id: task.id } : taskData);
    
    if (!task) {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'open',
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
    const selectedOptions = Array.from(e.target.selectedOptions, option => Number(option.value));
    setFormData(prev => ({
      ...prev,
      tags: selectedOptions
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-form__group">
        <label htmlFor="title" className="task-form__label">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
          className="task-form__input"
        />
      </div>

      <div className="task-form__group">
        <label htmlFor="description" className="task-form__label">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="3"
          className="task-form__input task-form__input--textarea"
        />
      </div>

      <div className="task-form__group-row">
        <div className="task-form__group">
          <label htmlFor="due_date" className="task-form__label">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="task-form__input"
          />
        </div>

        <div className="task-form__group">
          <label htmlFor="status" className="task-form__label">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="task-form__select"
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="task-form__group">
        <label className="task-form__label">Tags</label>
        <TagList 
          tags={tags}
          selectedTags={formData.tags.map(id => tags.find(tag => tag.id === id))}
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

      <div className="task-form__actions">
        <button type="submit" className="task-form__button task-form__button--primary">
          {task ? 'Update Task' : 'Add Task'}
        </button>
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="task-form__button task-form__button--secondary"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;