import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import './TaskForm.scss';

function TaskForm({ task, addTask, tags, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'open',
    tags: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
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
    onCancel?.();
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
    <form onSubmit={handleSubmit} className="task-form-inline">
      <div className="task-form-inline__content">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Add new task..."
          className="task-form-inline__title"
          autoFocus
        />
        <div className="task-form-inline__actions">
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="task-form-inline__date"
          />
          <button 
            type="submit" 
            className="task-form-inline__button task-form-inline__button--success" 
            title="Save task"
          >
            <FiCheck />
          </button>
          <button 
            type="button" 
            onClick={onCancel}
            className="task-form-inline__button task-form-inline__button--cancel"
            title="Cancel"
          >
            <FiX />
          </button>
        </div>
      </div>
    </form>
  );
}

export default TaskForm;