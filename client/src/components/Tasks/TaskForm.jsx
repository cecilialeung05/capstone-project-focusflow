import React, { useState, useEffect } from 'react';
import { FaTimes, FaRegClock, FaTags } from 'react-icons/fa';
import './TaskForm.scss';

function TaskForm({ onSubmit, onCancel, tags }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    due_date: '',
    tags: [],
    status: 'open'
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [draftKey] = useState(`task-draft-${Date.now()}`);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      setTask(JSON.parse(savedDraft));
    }
  }, [draftKey]);

  // Auto-save draft while typing
  useEffect(() => {
    const saveDraft = () => {
      if (task.title || task.description) {
        localStorage.setItem(draftKey, JSON.stringify(task));
      }
    };
    
    const timeoutId = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timeoutId);
  }, [task, draftKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
    localStorage.removeItem(draftKey);
    setTask({ title: '', description: '', due_date: '', tags: [], status: 'open' });
  };

  const handleTagToggle = (tagId) => {
    setTask(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  // Suggested tags based on title and description
  const suggestedTags = tags.filter(tag => 
    !task.tags.includes(tag.id) && 
    (task.title.toLowerCase().includes(tag.name.toLowerCase()) ||
     task.description.toLowerCase().includes(tag.name.toLowerCase()))
  ).slice(0, 3);

  return (
    <div className="task-form">
      <form onSubmit={handleSubmit}>
        {/* Main inputs */}
        <div className="task-form__main">
          <input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="task-form__input task-form__input--title"
            required
            autoFocus
          />
          
          <textarea
            placeholder="Description (optional)"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="task-form__input task-form__input--description"
            rows="2"
          />
        </div>

        {/* Date and Status row */}
        <div className="task-form__row">
          <div className="task-form__field">
            <FaRegClock className="task-form__icon" />
            <input
              type="date"
              value={task.due_date}
              onChange={(e) => setTask({ ...task, due_date: e.target.value })}
              className="task-form__input task-form__input--date"
            />
          </div>

          <div className="task-form__field">
            <select
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              className="task-form__input task-form__input--status"
            >
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Tags section */}
        <div className="task-form__tags">
          <div className="task-form__tags-header">
            <button
              type="button"
              className="task-form__tag-button"
              onClick={() => setShowTagDropdown(!showTagDropdown)}
            >
              <FaTags /> Select Tags ({task.tags.length})
            </button>
          </div>

          {/* Suggested tags */}
          {suggestedTags.length > 0 && (
            <div className="task-form__suggested-tags">
              <span className="task-form__suggested-label">Suggested:</span>
              {suggestedTags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  className="task-form__tag-pill"
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
          
          {/* Tag dropdown */}
          {showTagDropdown && (
            <div className="task-form__tag-dropdown">
              {tags.map(tag => (
                <label key={tag.id} className="task-form__tag-option">
                  <input
                    type="checkbox"
                    checked={task.tags.includes(tag.id)}
                    onChange={() => handleTagToggle(tag.id)}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Fixed bottom actions */}
        <div className="task-form__actions">
          <button type="submit" className="task-form__button task-form__button--submit">
            Add Task
          </button>
          <button 
            type="button" 
            onClick={() => {
              localStorage.removeItem(draftKey);
              onCancel();
            }}
            className="task-form__button task-form__button--cancel"
          >
            <FaTimes />
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;