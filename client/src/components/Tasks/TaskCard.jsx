import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaCheck, FaEllipsisH, FaClock } from 'react-icons/fa';
import { formatDate, formatRelativeDate } from '../../utils/dateUtils';
import { getStatusColor } from '../../utils/taskUtils';
import Tag from '../Tags/Tag';
import './TaskCard.scss';

function TaskCard({ 
  task, 
  tags,
  onUpdate,
  onDelete,
  onSelect,
  isSelected,
  variant = 'card' // 'card' or 'list'
}) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'completed', label: 'Completed' }
  ];

  const handleStatusChange = (newStatus) => {
    onUpdate?.({
      ...task,
      status: newStatus
    });
    setShowStatusMenu(false);
  };

  const renderStatus = () => (
    <div className="task-card__status-control">
      <button 
        className={`status-badge status-${task.status?.toLowerCase()}`}
        onClick={() => setShowStatusMenu(!showStatusMenu)}
      >
        {task.status || 'Open'} {onUpdate && <FaEllipsisH size={12} />}
      </button>
      
      {showStatusMenu && onUpdate && (
        <div className="task-card__status-menu">
          {statusOptions.map(option => (
            <button
              key={option.value}
              className={`task-card__status-option status-${option.value}`}
              onClick={() => handleStatusChange(option.value)}
            >
              {option.label}
              {task.status === option.value && <FaCheck size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const cardContent = (
    <>
      <div className="task-card__header">
        <h4 className="task-card__title">
          {variant === 'card' ? (
            task.title
          ) : (
            <Link to={`/tasks/${task.id}`}>{task.title}</Link>
          )}
        </h4>
        {renderStatus()}
      </div>
      
      {task.description && (
        <p className="task-card__description">
          {variant === 'card' 
            ? `${task.description?.substring(0, 100)}${task.description?.length > 100 ? '...' : ''}`
            : task.description
          }
        </p>
      )}

      <div className="task-card__footer">
        <div className="task-card__due-date">
          {formatRelativeDate(task.due_date)}
        </div>
        
        {task.tags?.length > 0 && (
          <div className="task-card__tags">
            {task.tags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag && (
                <Tag 
                  key={tag.id} 
                  name={tag.name}
                  className="task-card__tag"
                />
              );
            })}
          </div>
        )}
      </div>

      {variant === 'list' && onUpdate && (
        <div className="task-card__actions">
          <Link 
            to={`/tasks/${task.id}`} 
            className="task-card__button task-card__button--edit"
          >
            <FaEdit /> Edit
          </Link>
          {onDelete && (
            <button 
              className="task-card__button task-card__button--delete"
              onClick={() => {
                if (window.confirm('Delete this task?')) {
                  onDelete(task.id);
                }
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </>
  );

  return variant === 'card' ? (
    <Link to={`/tasks/${task.id}`} className="task-card">
      {cardContent}
    </Link>
  ) : (
    <div className="task-card task-card--list">
      {cardContent}
    </div>
  );
}

export default TaskCard; 