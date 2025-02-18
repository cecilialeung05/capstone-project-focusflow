import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import './Dashboard.scss';

function Dashboard({ tasks, notes, tags }) {
  const [selectedTag, setSelectedTag] = useState(null);

  // Memoized calculations
  const statistics = useMemo(() => {
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in progress').length,
      open: tasks.filter(task => task.status === 'open').length,
      blocked: tasks.filter(task => task.status === 'blocked').length
    };

    const noteStats = {
      total: notes.length,
      withTasks: notes.filter(note => note.task_id).length,
      withTags: notes.filter(note => note.tags?.length > 0).length
    };

    return { taskStats, noteStats };
  }, [tasks, notes]);

  // Filter and sort recent items
  const recentItems = useMemo(() => {
    const allItems = [
      ...tasks.map(task => ({
        ...task,
        type: 'task',
        date: new Date(task.created_at)
      })),
      ...notes.map(note => ({
        ...note,
        type: 'note',
        date: new Date(note.created_at)
      }))
    ];

    return allItems
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  }, [tasks, notes]);

  // Filter items by selected tag
  const filteredItems = useMemo(() => {
    if (!selectedTag) return { tasks, notes };

    return {
      tasks: tasks.filter(task => 
        task.tags?.some(tag => tag.id === selectedTag)
      ),
      notes: notes.filter(note => 
        note.tags?.some(tag => tag.id === selectedTag)
      )
    };
  }, [tasks, notes, selectedTag]);

  return (
    <div className="dashboard">
      {/* Quick Stats Section */}
      <section className="stats-section">
        <h2>Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Tasks</h3>
            <div className="stat-numbers">
              <div className="stat-item">
                <span className="label">Total:</span>
                <span className="value">{statistics.taskStats.total}</span>
              </div>
              <div className="stat-item status-completed">
                <span className="label">Completed:</span>
                <span className="value">{statistics.taskStats.completed}</span>
              </div>
              <div className="stat-item status-in-progress">
                <span className="label">In Progress:</span>
                <span className="value">{statistics.taskStats.inProgress}</span>
              </div>
              <div className="stat-item status-blocked">
                <span className="label">Blocked:</span>
                <span className="value">{statistics.taskStats.blocked}</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <h3>Notes</h3>
            <div className="stat-numbers">
              <div className="stat-item">
                <span className="label">Total:</span>
                <span className="value">{statistics.noteStats.total}</span>
              </div>
              <div className="stat-item">
                <span className="label">With Tasks:</span>
                <span className="value">{statistics.noteStats.withTasks}</span>
              </div>
              <div className="stat-item">
                <span className="label">With Tags:</span>
                <span className="value">{statistics.noteStats.withTags}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="recent-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentItems.map(item => (
            <Link 
              key={`${item.type}-${item.id}`}
              to={`/${item.type}s/${item.id}`}
              className="activity-item"
            >
              <div className={`activity-type ${item.type}`}>
                {item.type === 'task' ? '📋' : '📝'}
              </div>
              <div className="activity-content">
                <h4>{item.title}</h4>
                <p className="activity-date">{formatDate(item.created_at)}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="activity-tags">
                    {item.tags.map(tag => (
                      <span key={tag.id} className="tag">{tag.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tag Filter Section */}
      <section className="filter-section">
        <h2>Filter by Tag</h2>
        <div className="tags-list">
          {tags.map(tag => (
            <button
              key={tag.id}
              className={`tag-button ${selectedTag === tag.id ? 'selected' : ''}`}
              onClick={() => setSelectedTag(selectedTag === tag.id ? null : tag.id)}
            >
              {tag.name}
            </button>
          ))}
        </div>
        
        {selectedTag && (
          <div className="filtered-results">
            <div className="filtered-tasks">
              <h3>Tasks with this tag</h3>
              {filteredItems.tasks.length > 0 ? (
                <ul>
                  {filteredItems.tasks.map(task => (
                    <li key={task.id}>
                      <Link to={`/tasks/${task.id}`}>
                        <span className={`status ${task.status}`}></span>
                        {task.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No tasks found with this tag</p>
              )}
            </div>

            <div className="filtered-notes">
              <h3>Notes with this tag</h3>
              {filteredItems.notes.length > 0 ? (
                <ul>
                  {filteredItems.notes.map(note => (
                    <li key={note.id}>
                      <Link to={`/notes/${note.id}`}>{note.title}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notes found with this tag</p>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
