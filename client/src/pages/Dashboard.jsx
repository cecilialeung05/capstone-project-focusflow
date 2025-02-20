import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import './Dashboard.scss';

function Dashboard({ tasks, notes, tags }) {
  const [selectedTag, setSelectedTag] = useState(null);

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
      <div className="dashboard__header">
        <h2 className="dashboard__title">Dashboard</h2>
      </div>

      <div className="dashboard__stats">
        <div className="dashboard__card">
          <h3 className="dashboard__card-title">Tasks Overview</h3>
          <div className="dashboard__card-content dashboard__stats-grid">
            <div className="dashboard__stats-item">
              <span className="dashboard__stats-label">Total Tasks</span>
              <span className="dashboard__stats-value">{tasks.length}</span>
            </div>
            <div className="dashboard__stats-item">
              <span className="dashboard__stats-label">Completed</span>
              <span className="dashboard__stats-value">{statistics.taskStats.completed}</span>
            </div>
            <div className="dashboard__stats-item">
              <span className="dashboard__stats-label">In Progress</span>
              <span className="dashboard__stats-value">{statistics.taskStats.inProgress}</span>
            </div>
            <div className="dashboard__stats-item">
              <span className="dashboard__stats-label">Blocked</span>
              <span className="dashboard__stats-value">{statistics.taskStats.blocked}</span>
            </div>
          </div>
        </div>

        <div className="dashboard__card">
          <h3 className="dashboard__card-title">Notes</h3>
          <div className="dashboard__card-content">
            <div className="dashboard__stats-item">
              <span className="dashboard__stats-label">Total</span>
              <span className="dashboard__stats-value">{statistics.noteStats.total}</span>
            </div>
            <div className="dashboard__stats-item">
              <span className="dashboard__stats-label">With Tasks</span>
              <span className="dashboard__stats-value">{statistics.noteStats.withTasks}</span>
            </div>
            <div className="dashboard__stats-item">
              <span className="dashboard__stats-label">With Tags</span>
              <span className="dashboard__stats-value">{statistics.noteStats.withTags}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard__recent">
        <div className="dashboard__card">
          <h3 className="dashboard__card-title">Recent Tasks</h3>
          <div className="dashboard__recent-list">
            {tasks.slice(0, 5).map(task => (
              <Link 
                key={task.id} 
                to={`/tasks/${task.id}`}
                className="dashboard__recent-item"
              >
                <span className={`dashboard__status dashboard__status--${task.status.replace(' ', '-')}`} />
                <span>{task.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard__card">
          <h3 className="dashboard__card-title">Recent Notes</h3>
          <div className="dashboard__recent-list">
            {/* ... notes list */}
          </div>
        </div>
      </div>

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
