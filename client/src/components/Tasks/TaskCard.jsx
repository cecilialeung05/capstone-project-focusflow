import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/dateUtils';
import { getTagColor } from '../../utils/tagColors';
import { Tag } from '../Tags';
import './TaskCard.scss';

function TaskCard({ task, tags }) {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'var(--success-color)';
      case 'in progress': return 'var(--info-color)';
      case 'blocked': return 'var(--danger-color)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <Link to={`/tasks/${task.id}`} className="task-card">
      <div className="task-card__header">
        <h4 className="task-card__title">{task.title}</h4>
        <span 
          className="task-card__status"
          style={{ backgroundColor: getStatusColor(task.status) }}
        >
          {task.status}
        </span>
      </div>
      
      <p className="task-card__description">
        {task.description?.substring(0, 100)}
        {task.description?.length > 100 && '...'}
      </p>

      <div className="task-card__footer">
        <div className="task-card__due-date">
          <span>Due: {formatDate(new Date(task.due_date))}</span>
        </div>
        
        {task.tags?.length > 0 && (
          <div className="task-card__tags">
            {task.tags.map(tagId => {
              const tag = tags.find(t => t.id === tagId);
              return tag && <Tag key={tag.id} name={tag.name} className="task-card__tag" />;
            })}
          </div>
        )}
      </div>
    </Link>
  );
}

export default TaskCard; 