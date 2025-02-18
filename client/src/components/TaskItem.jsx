import React from 'react';
import { Link } from 'react-router-dom';
import './TaskItem.scss';

function TaskItem({ task, updateTask, deleteTask }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });

    let relativeTime;
    if (diffDays === 0) {
      relativeTime = '(Today)';
    } else if (diffDays === 1) {
      relativeTime = '(Tomorrow)';
    } else if (diffDays === -1) {
      relativeTime = '(Yesterday)';
    } else if (diffDays < -1) {
      relativeTime = `(${Math.abs(diffDays)} days overdue)`;
    } else if (diffDays <= 7) {
      relativeTime = `(in ${diffDays} days)`;
    } else {
      relativeTime = '';
    }

    return `${formattedDate} ${relativeTime}`.trim();
  };

  const handleStatusChange = (newStatus) => {
    updateTask(task.id, { ...task, status: newStatus });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in progress': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className={`task-item ${getStatusColor(task.status)}`}>
      <div className="task-item__content">
        <div className="task-item__header">
          <h3 className="task-item__title">
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
          </h3>
          <span className={`status-badge ${task.status.replace(' ', '-')}`}>
            {task.status}
          </span>
        </div>

        <div className="task-item__details">
          {task.description && (
            <p className="task-item__description">{task.description}</p>
          )}
          <p className="task-item__due-date">
            <span className="label">Due:</span> {formatDate(task.due_date)}
          </p>
        </div>
      </div>

      <div className="task-item__actions">
        <div className="status-buttons">
          {task.status !== 'open' && (
            <button 
              className="status-btn open"
              onClick={() => handleStatusChange('open')}
            >
              Set Open
            </button>
          )}
          {task.status !== 'in progress' && (
            <button 
              className="status-btn in-progress"
              onClick={() => handleStatusChange('in progress')}
            >
              Set In Progress
            </button>
          )}
          {task.status !== 'completed' && (
            <button 
              className="status-btn completed"
              onClick={() => handleStatusChange('completed')}
            >
              Set Completed
            </button>
          )}
        </div>

        <div className="management-buttons">
          <Link 
            to={`/tasks/${task.id}`} 
            className="edit-btn"
            title="Edit task details"
          >
            Edit Details
          </Link>
          <button 
            className="delete-btn"
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