import React, { useState } from 'react';
import { FiX, FiCheck, FiClock } from 'react-icons/fi';
import './TaskForm.scss';

function TaskForm({ addTask, onCancel, initialTask }) {
  const [formData, setFormData] = useState({
    title: initialTask?.title || '',
    description: initialTask?.description || '',
    due_date: initialTask?.due_date || '',
    status: initialTask?.status || 'open',
    priority: initialTask?.priority || 'medium',
    recurring_type: initialTask?.recurring_type || 'none',
    recurring_interval: initialTask?.recurring_interval || '1',
    recurring_unit: initialTask?.recurring_unit || 'days',
    parent_task_id: initialTask?.parent_task_id || null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(formData);
    onCancel();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-form__group">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Task title..."
          className="task-form__input"
          required
          autoFocus
        />
      </div>

      <div className="task-form__group">
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Task description..."
          className="task-form__input"
          rows={3}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__group">
          <label className="task-form__label">Priority</label>
          <div className="task-form__priority-options">
            {['low', 'medium', 'high'].map(priority => (
              <label
                key={priority}
                className={formData.priority === priority ? 'selected' : ''}
              >
                <input
                  type="radio"
                  name="priority"
                  value={priority}
                  checked={formData.priority === priority}
                  onChange={handleChange}
                  hidden
                />
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <div className="task-form__group">
          <label className="task-form__label">Due Date</label>
          <div className="task-form__date-input">
            <FiClock />
            <input
              type="datetime-local"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              className="task-form__input"
            />
          </div>
        </div>
      </div>

      <div className="task-form__recurring">
        <label className="task-form__label">Recurring Task</label>
        <select
          name="recurring_type"
          value={formData.recurring_type}
          onChange={handleChange}
          className="task-form__input"
        >
          <option value="none">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>

        {formData.recurring_type === 'custom' && (
          <div className="task-form__custom-recurring">
            <input
              type="number"
              name="recurring_interval"
              value={formData.recurring_interval}
              onChange={handleChange}
              min="1"
              className="task-form__input"
            />
            <select
              name="recurring_unit"
              value={formData.recurring_unit}
              onChange={handleChange}
              className="task-form__input"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
        )}
      </div>

      <div className="task-form__actions">
        <button type="submit" className="task-form__button task-form__button--primary">
          <FiCheck /> Save Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="task-form__button task-form__button--secondary"
        >
          <FiX /> Cancel
        </button>
      </div>
    </form>
  );
}

export default TaskForm;