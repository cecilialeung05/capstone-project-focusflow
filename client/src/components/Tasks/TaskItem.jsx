import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import './TaskItem.scss';

function TaskItem({ task, updateTask, deleteTask }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-in-progress';
      case 'blocked': return 'status-blocked';
      default: return 'status-open';
    }
  };

  const handleStatusChange = (newStatus) => {
    updateTask(task.id, { ...task, status: newStatus });
  };

  return (
    <div className={`task-item task-item--${task.status?.toLowerCase().replace(' ', '-') || 'open'}`}>
      <div className="task-item__content">
        <div className="task-item__header">
          <h3 className="task-item__title">
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
          </h3>
          <span className={`status-badge ${task.status?.toLowerCase().replace(' ', '-') || 'open'}`}>
            {task.status || 'Open'}
          </span>
        </div>

        <div className="task-item__details">
          {task.description && (
            <p className="task-item__description">{task.description}</p>
          )}
          <p className="task-item__due-date">
            <span className="task-item__due-date-label">Due:</span> 
            {formatDate(task.due_date)}
          </p>
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="task-item__tags">
            {task.tags.map(tag => (
              <span 
                key={`task-${task.id}-tag-${tag.id}`} 
                className="task-item__tag"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="task-item__actions">
        <div className="task-item__status-buttons">
          {task.status !== 'open' && (
            <button 
              className="task-item__button task-item__button--open"
              onClick={() => handleStatusChange('open')}
            >
              Set Open
            </button>
          )}
          {task.status !== 'in progress' && (
            <button 
              className="task-item__button task-item__button--progress"
              onClick={() => handleStatusChange('in progress')}
            >
              Set In Progress
            </button>
          )}
          {task.status !== 'completed' && (
            <button 
              className="task-item__button task-item__button--complete"
              onClick={() => handleStatusChange('completed')}
            >
              Set Completed
            </button>
          )}
          {task.status !== 'blocked' && (
            <button 
              className="task-item__button task-item__button--block"
              onClick={() => handleStatusChange('blocked')}
            >
              Set Blocked
            </button>
          )}
        </div>

        <div className="task-item__management">
          <Link 
            to={`/tasks/${task.id}`} 
            className="task-item__button task-item__button--edit"
            title="Edit task details"
          >
            Edit Details
          </Link>
          <button 
            className="task-item__button task-item__button--delete"
            onClick={() => deleteTask(task.id)}
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;