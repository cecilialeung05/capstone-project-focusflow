import React from 'react';
import './TaskFilters.scss';

function TaskFilters({ 
  statusFilter, 
  onStatusChange, 
  sortBy, 
  onSortChange, 
  searchTerm, 
  onSearchChange 
}) {
  return (
    <div className="task-filters">
      <div className="task-filters__row">
        <div className="task-filters__search">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="task-filters__search-input"
          />
        </div>

        <select 
          className="task-filters__select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="created">Sort by Created Date</option>
          <option value="due">Sort by Due Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      <div className="task-filters__status">
        <button
          className={`task-filters__status-button ${statusFilter === 'all' ? 'task-filters__status-button--selected all' : ''}`}
          onClick={() => onStatusChange('all')}
        >
          All
        </button>
        <button
          className={`task-filters__status-button ${statusFilter === 'open' ? 'task-filters__status-button--selected open' : ''}`}
          onClick={() => onStatusChange('open')}
        >
          Open
        </button>
        <button
          className={`task-filters__status-button ${statusFilter === 'in-progress' ? 'task-filters__status-button--selected in-progress' : ''}`}
          onClick={() => onStatusChange('in-progress')}
        >
          In Progress
        </button>
        <button
          className={`task-filters__status-button ${statusFilter === 'completed' ? 'task-filters__status-button--selected completed' : ''}`}
          onClick={() => onStatusChange('completed')}
        >
          Completed
        </button>
        <button
          className={`task-filters__status-button ${statusFilter === 'blocked' ? 'task-filters__status-button--selected blocked' : ''}`}
          onClick={() => onStatusChange('blocked')}
        >
          Blocked
        </button>
      </div>
    </div>
  );
}

export default TaskFilters; 