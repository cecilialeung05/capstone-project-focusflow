import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/AnimatedPage';
import SplitFlapDisplay from '../components/Dashboard/DashboardHeader';
import './Dashboard.scss';
import { formatDate } from '../utils/dateUtils';
import 'react-resizable/css/styles.css';

function Dashboard({ notes = [], tasks = [], tags = [] }) {
  const recentNotes = notes.slice(0, 5);
  const recentTasks = tasks.slice(0, 5);

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    blocked: tasks.filter(t => t.status === 'blocked').length
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'rgba(var(--success-rgb), 0.1)';
      case 'in progress':
        return 'rgba(var(--info-rgb), 0.1)';
      case 'blocked':
        return 'rgba(var(--danger-rgb), 0.1)';
      default:
        return 'var(--bg-primary)';
    }
  };

  const getStatusBorder = (status) => {
    switch (status) {
      case 'completed':
        return 'var(--success-color)';
      case 'in progress':
        return 'var(--info-color)';
      case 'blocked':
        return 'var(--danger-color)';
      default:
        return 'var(--border-color)';
    }
  };

  const recentItems = useMemo(() => {
    const allItems = [
      ...(tasks || []).map(task => ({
        id: task.id || '',
        title: task.title || 'Untitled Task',
        type: 'task',
        date: task.created_at ? new Date(task.created_at) : new Date(),
        status: task.status || 'open'
      })),
      ...(notes || []).map(note => ({
        id: note.id || '',
        title: note.title || 'Untitled Note',
        type: 'note',
        date: note.created_at ? new Date(note.created_at) : new Date()
      }))
    ];

    return allItems
      .filter(item => item.id) 
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  }, [tasks, notes]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return {
      today: tasks.filter(task => {
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      }),
      upcoming: tasks.filter(task => {
        const taskDate = new Date(task.due_date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate > today && taskDate <= nextWeek;
      })
    };
  }, [tasks]);

  const renderComponentContent = (componentId) => {
    switch (componentId) {
      case 'tasks':
        return (
          <div className="dashboard__tasks">
            <div className="dashboard__stats">
              <div className="dashboard__stat">
                <span>Total:</span>
                <span>{taskStats.total}</span>
              </div>
              <div className="dashboard__stat dashboard__stat--completed">
                <span>Completed:</span>
                <span>{taskStats.completed}</span>
              </div>
              <div className="dashboard__stat dashboard__stat--in-progress">
                <span>In Progress:</span>
                <span>{taskStats.inProgress}</span>
              </div>
              <div className="dashboard__stat dashboard__stat--blocked">
                <span>Blocked:</span>
                <span>{taskStats.blocked}</span>
              </div>
            </div>
          </div>
        );

      case 'recent':
        return (
          <div className="dashboard__recent">
            {recentItems.length > 0 ? (
              recentItems.map(item => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={`/${item.type}s/${item.id}`}
                  className="dashboard__recent-item"
                >
                  <span className="dashboard__recent-icon" role="img" aria-label={item.type}>
                    {item.type === 'task' ? '📋' : '📝'}
                  </span>
                  <span className="dashboard__recent-title">
                    {item.title}
                  </span>
                  {item.type === 'task' && (
                    <span className={`dashboard__recent-status dashboard__recent-status--${item.status}`}>
                      {item.status}
                    </span>
                  )}
                  <span className="dashboard__recent-date">
                    {formatDate(item.date)}
                  </span>
                </Link>
              ))
            ) : (
              <div className="dashboard__empty">
                No recent activity
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatedPage>
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Overview</h1>
          <div className="dashboard__quick-actions">
            <Link to="/tasks/new" className="dashboard__action-button">
              <span role="img" aria-label="New Task">📋</span>
              New Task
            </Link>
            <Link to="/notes/new" className="dashboard__action-button">
              <span role="img" aria-label="New Note">📝</span>
              New Note
            </Link>
          </div>
        </div>
        <div className="dashboard__stats-overview">
          <div className="dashboard__stat-card">
            <h3>Total Tasks and Notes</h3>
            <SplitFlapDisplay 
              value={taskStats.total} 
              digits={2}
              backgroundColor="var(--bg-primary)"
              textColor="var(--text-primary)"
            />
          </div>
        </div>
        <div className="dashboard__upcoming">
          <div className="dashboard__widget dashboard__widget--full">
            <h2>Upcoming Tasks</h2>
            <div className="dashboard__upcoming-grid">
              {/* Today's Tasks */}
              <div className="dashboard__upcoming-section">
                <h3>Due Today</h3>
                <div className="dashboard__upcoming-list">
                  {upcomingTasks.today.length > 0 ? (
                    upcomingTasks.today.map(task => (
                      <Link
                        key={task.id}
                        to={`/tasks/${task.id}`}
                        className="dashboard__upcoming-item"
                      >
                        <div className={`dashboard__status dashboard__status--${task.status}`} />
                        <span className="dashboard__upcoming-title">{task.title}</span>
                        <span className={`dashboard__upcoming-badge dashboard__upcoming-badge--${task.status}`}>
                          {task.status}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="dashboard__empty">No tasks due today</p>
                  )}
                </div>
              </div>
              <div className="dashboard__upcoming-section">
                <h3>Coming Up</h3>
                <div className="dashboard__upcoming-list">
                  {upcomingTasks.upcoming.length > 0 ? (
                    upcomingTasks.upcoming.map(task => (
                      <Link
                        key={task.id}
                        to={`/tasks/${task.id}`}
                        className="dashboard__upcoming-item"
                      >
                        <div className={`dashboard__status dashboard__status--${task.status}`} />
                        <span className="dashboard__upcoming-title">{task.title}</span>
                        <span className="dashboard__upcoming-date">
                          {formatDate(new Date(task.due_date))}
                        </span>
                        <span className={`dashboard__upcoming-badge dashboard__upcoming-badge--${task.status}`}>
                          {task.status}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="dashboard__empty">No upcoming tasks</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard__grid">
          <div className="dashboard__widget">
            <h2>Tasks</h2>
            {renderComponentContent('tasks')}
          </div>
          <div className="dashboard__widget">
            <h2>Notes</h2>
            <div className="dashboard__stats">
              <div className="dashboard__stat">
                <span>Total:</span>
                <span>{notes.length}</span>
              </div>
            </div>
          </div>

          <div className="dashboard__widget">
            <h2>Recent Activity</h2>
            {renderComponentContent('recent')}
          </div>
        </div>

      </div>
    </AnimatedPage>
  );
}

export default Dashboard;
