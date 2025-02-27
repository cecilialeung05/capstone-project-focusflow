import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiX, FiSave, FiCheck } from 'react-icons/fi';
import './TaskItem.scss';

function TaskItem({ task, updateTask, deleteTask, onStatusChange, onCheck, isSelected }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    due_date: task.due_date || '',
  });

  const handleTitleSubmit = async () => {
    if (editedTitle.trim() !== task.title) {
      console.log('TaskItem - Attempting to update task:', task.id);
      
      // Only send necessary fields for update
      const updateData = {
        id: task.id,
        title: editedTitle.trim(),
        status: task.status,
        description: task.description,
        due_date: task.due_date
      };
      
      try {
        await updateTask(task.id, updateData);
        console.log('TaskItem - Update successful');
        setIsEditing(false);
      } catch (error) {
        console.error('TaskItem - Failed to update task:', error);
        setEditedTitle(task.title);
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setShowDetails(!showDetails);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`task-item ${task.status.toLowerCase().replace(' ', '-')} ${showDetails ? 'show-details' : ''}`}>
      <div className="task-item__header">
        <div className="task-item__title-group">
          <div 
            className={`task-item__checkbox ${isSelected ? 'checked' : ''}`}
            onClick={() => onCheck(task.id, task)}
          >
            {isSelected && <FiCheck className="check-icon" />}
          </div>
          {isEditing ? (
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={handleKeyPress}
              className="task-item__title-input"
              autoFocus
            />
          ) : (
            <h3 className="task-item__title">
              {task.title}
            </h3>
          )}
        </div>
        
        <div className="task-item__actions">
          <button 
            className="task-item__button"
            onClick={handleEditClick}
            title={showDetails ? "Hide details" : "Show details"}
          >
            <FiEdit2 />
          </button>
          <button 
            className="task-item__button"
            onClick={() => deleteTask(task.id)}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>

      {showDetails && (
        <div className="task-item__details">
          <div className="task-item__details-actions">
            {isEditing ? (
              <>
                <button 
                  className="task-item__button task-item__button--success"
                  onClick={handleTitleSubmit}
                  title="Save changes"
                >
                  <FiSave />
                </button>
                <button 
                  className="task-item__button"
                  onClick={() => setIsEditing(false)}
                  title="Cancel editing"
                >
                  <FiX />
                </button>
              </>
            ) : (
              <>
                <button 
                  className="task-item__button"
                  onClick={() => setShowDetails(false)}
                  title="Close panel"
                >
                  <FiX />
                </button>
              </>
            )}
          </div>
          <div className="task-item__details-content">
            <div className="details-line">
              {isEditing ? (
                <input
                  type="text"
                  name="description"
                  value={editData.description}
                  onChange={handleChange}
                  className="task-item__input task-item__input--textarea"
                  placeholder="Add description..."
                />
              ) : (
                <span className="detail-value">
                  {task.description || 'No description provided'}
                </span>
              )}
            </div>
            {task.tags && task.tags.length > 0 && (
              <div className="task-item__tags">
                {task.tags.map(tag => (
                  <span key={`task-${task.id}-tag-${tag.id}`} className="task-item__tag tag-badge">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;