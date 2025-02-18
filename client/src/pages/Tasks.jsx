import React, { useState, useMemo } from 'react';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import './Tasks.scss';

function Tasks({ tasks, tags, addTask, updateTask, deleteTask }) {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created'); // 'created', 'due', 'status'
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort tasks
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
          default: // 'created'
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  }, [tasks, statusFilter, selectedTags, sortBy, searchTerm]);

  const statusCounts = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  }, [tasks]);

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>Tasks</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm 
          addTask={addTask}
          tags={tags}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="tasks-filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-options">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status ({tasks.length})</option>
            <option value="open">Open ({statusCounts.open || 0})</option>
            <option value="in progress">In Progress ({statusCounts['in progress'] || 0})</option>
            <option value="completed">Completed ({statusCounts.completed || 0})</option>
            <option value="blocked">Blocked ({statusCounts.blocked || 0})</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created">Sort by Created Date</option>
            <option value="due">Sort by Due Date</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>

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
          <div className="no-tasks">
            <p>No tasks found matching your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Tasks;