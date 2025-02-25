import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiX, FiMaximize2, FiExternalLink, FiSave, FiCircle } from 'react-icons/fi';
import { formatDate } from '../../utils/dateUtils';
import './TaskItem.scss';

function TaskItem({ task, updateTask, deleteTask }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    due_date: task.due_date || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: task.title,
      description: task.description || '',
      due_date: task.due_date || '',
    });
  };

  const handleSave = () => {
    updateTask(task.id, {
      ...task,
      ...editData,
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`task-item ${task.status.toLowerCase().replace(' ', '-')}`}>
      <div className="task-item__header">
        <div className="task-item__title-group">
          <h3 className="task-item__title">
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleChange}
                className="edit-input"
                autoFocus
              />
            ) : (
              <button 
                className="task-item__title-button"
                onClick={() => setShowDetails(!showDetails)}
              >
                <FiCircle className="task-item__bullet" />
                {task.title}
              </button>
            )}
          </h3>
        </div>
        <div className="task-item__actions">
          <div className="task-item__status">
            <button 
              className={`task-item__status-button task-item__status-button--${task.status.toLowerCase().replace(' ', '-')}`}
              onClick={() => setShowStatusMenu(!showStatusMenu)}
            >
              {task.status}
            </button>
            {showStatusMenu && (
              <div className="task-item__status-menu">
                {['open', 'in progress', 'completed'].map(status => (
                  status !== task.status.toLowerCase() && (
                    <button
                      key={status}
                      className={`task-item__status-option task-item__status-option--${status.replace(' ', '-')}`}
                      onClick={() => {
                        updateTask(task.id, { ...task, status: status });
                        setShowStatusMenu(false);
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
          <button 
            className={`task-item__button ${showDetails ? 'task-item__button--disabled' : ''}`}
            onClick={() => setShowDetails(true)}
            title="View details"
            disabled={showDetails}
          >
            <FiEdit2 />
          </button>
          <button 
            className="task-item__button"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
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
                  onClick={handleSave}
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
              <span className="detail-label">Description:</span>
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
                <span className="detail-value">{task.description || 'No description provided'}</span>
              )}
              <span className="detail-separator">•</span>
              <span className="detail-label">Due:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="due_date"
                  value={editData.due_date}
                  onChange={handleChange}
                  className="task-item__input"
                />
              ) : (
                <span className="detail-value">{formatDate(task.due_date)}</span>
              )}
              {task.tags && task.tags.length > 0 && (
                <>
                  <div className="task-item__tags">
                    {task.tags.map(tag => (
                      <span key={`task-${task.id}-tag-${tag.id}`} className="task-item__tag tag-badge">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;