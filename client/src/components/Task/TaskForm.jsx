import React, { useState, useEffect } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';
import './TaskForm.scss';

function TaskForm({ addTask, tags, onCancel, initialTask }) {
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    due_date: initialTask?.due_date || '',
    status: 'open',
    tags: initialTask?.tags?.map(tag => tag.id) || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialTask) {
      addTask({ ...formData, id: initialTask.id });
    } else {
      addTask(formData);
    }
    onCancel();
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