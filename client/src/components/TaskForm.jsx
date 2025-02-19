import React, { useState, useEffect } from 'react';
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
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="due_date">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <select
          id="tags"
          name="tags"
          multiple
          value={formData.tags}
          onChange={handleTagChange}
          className="tag-select"
        >
          {tags?.map(tag => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <small className="form-help-text">
          Hold Ctrl (Cmd on Mac) to select multiple tags. Click again to deselect.
        </small>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          {task ? 'Update Task' : 'Add Task'}
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

export default TaskForm;