import React, { useState, useMemo } from 'react';
import TaskForm from '../components/Task/TaskForm';
import TaskItem from '../components/Task/TaskItem';
import './Tasks.scss';

function Tasks({ tasks, tags, addTask, updateTask, deleteTask }) {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created'); 
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tagId => task.tags?.some(tag => tag.id === tagId));
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesTags && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'due':
            return new Date(a.due_date || '9999') - new Date(b.due_date || '9999');
          case 'status':
            return a.status.localeCompare(b.status);
          default:
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  }, [tasks, statusFilter, selectedTags, sortBy, searchTerm]);

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.status?.toLowerCase() === 'completed').length,
      inProgress: tasks.filter(task => task.status?.toLowerCase() === 'in progress').length,
      open: tasks.filter(task => task.status?.toLowerCase() === 'open').length,
    };
  }, [tasks]);

  return (
    <div className="tasks-page">
      <div className="filters-column">
        <div className="stats-numbers">
          <div className="stat-item">
            <span className="label">Total:</span>
            <span className="value">{taskStats.total}</span>
          </div>
          <div className="stat-item status-completed">
            <span className="label">Completed:</span>
            <span className="value">{taskStats.completed}</span>
          </div>
          <div className="stat-item status-in-progress">
            <span className="label">In Progress:</span>
            <span className="value">{taskStats.inProgress}</span>
          </div>
        </div>

        <div className="filters-section">
          <h3>Filters</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="created">Created Date</option>
              <option value="due">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tags</label>
            <div className="tags-filter">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className={`tag-filter-btn ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tasks-column">
        <div className="header-title-row">
          <h1>... Ready to get started?</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="primary-action-btn"
          >
            {showForm ? 'Cancel' : '+ Add Task'}
          </button>
        </div>

        {showForm && (
          <div className="form-section">
            <TaskForm 
              addTask={addTask}
              tags={tags}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        <div className="tasks-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks found matching your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;