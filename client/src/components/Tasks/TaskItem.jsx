import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaCheck, FaEllipsisH, FaClock } from 'react-icons/fa';
import { formatDate } from '../../utils/dateUtils';
import './TaskItem.scss';
import { useDroppable } from '@dnd-kit/core';

function TaskItem({ task, onUpdate, onDelete, onSelect, isSelected }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleStatusChange = (newStatus) => {
    onUpdate({
      ...task,
      status: newStatus
    });
    setShowStatusMenu(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'in progress': return 'status-in-progress';
      case 'blocked': return 'status-blocked';
      default: return 'status-open';
    }
  };

  const formatRelativeDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format the actual date
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });
    
    // Get relative time
    let relativeTime;
    if (diffDays === 0) relativeTime = 'due today';
    else if (diffDays === 1) relativeTime = 'due tomorrow';
    else if (diffDays === -1) relativeTime = 'due yesterday';
    else if (diffDays > 1 && diffDays <= 7) relativeTime = `due in ${diffDays} days`;
    else if (diffDays < -1 && diffDays >= -7) relativeTime = `due ${Math.abs(diffDays)} days ago`;
    else if (diffDays > 7 && diffDays <= 14) relativeTime = 'due next week';
    else if (diffDays < -7 && diffDays >= -14) relativeTime = 'due last week';
    else relativeTime = diffDays > 0 ? 'upcoming' : 'overdue';
    
    return {
      date: formattedDate,
      relative: relativeTime
    };
  };

  const dueDate = formatRelativeDate(task.due_date);

  console.log('Task tags:', task.tags);

  const { setNodeRef, isOver } = useDroppable({
    id: task.id,
    data: {
      type: 'task',
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`task-item ${isOver ? 'task-item--drag-over' : ''}`}
    >
      <div className="task-item__content">
        <div className="task-item__header">
          <h3 className="task-item__title">
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
          </h3>
          
          <div className="task-item__controls">
            {/* Timer button */}
            {task.status !== 'completed' && (
              <button 
                className={`task-item__button task-item__button--timer ${isSelected ? 'task-item__button--timer-active' : ''}`}
                onClick={() => onSelect(task)}
                title={isSelected ? "Stop focusing" : "Start focus timer"}
              >
                <FaClock /> {isSelected ? 'Focusing' : 'Focus'}
              </button>
            )}
            
            {/* Existing status control */}
            <div className="task-item__status-control">
              <button 
                className={`status-badge ${getStatusColor(task.status)}`}
                onClick={() => setShowStatusMenu(!showStatusMenu)}
              >
                {task.status || 'Open'} <FaEllipsisH size={12} />
              </button>
              
              {showStatusMenu && (
                <div className="task-item__status-menu">
                  {statusOptions.map(option => (
                    <button
                      key={option.value}
                      className={`task-item__status-option ${getStatusColor(option.value)}`}
                      onClick={() => handleStatusChange(option.value)}
                    >
                      {option.label}
                      {task.status === option.value && <FaCheck size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}
        
        <div className="task-item__details">
          <p className="task-item__due-date">
            <span className="task-item__due-date-label">Due:</span> 
            {dueDate.date} ({dueDate.relative})
          </p>

          {task.tags && task.tags.length > 0 && (
            <div className="task-item__tags">
              {task.tags.map((tag, index) => (
                <span 
                  key={`${task.id}-tag-${index}`}
                  className="task-item__tag"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="task-item__actions">
        <Link 
          to={`/tasks/${task.id}`} 
          className="task-item__button task-item__button--edit"
          title="Edit task details"
        >
          <FaEdit /> Edit
        </Link>
        <button 
          className="task-item__button task-item__button--delete"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) {
              onDelete(task.id);
            }
          }}
          title="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;