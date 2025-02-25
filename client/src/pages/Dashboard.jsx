import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import SplitFlapDisplay from '../components/Dashboard/DashboardHeader';
import './Dashboard.scss';

function Dashboard({ tasks, notes }) {
  const statistics = useMemo(() => {
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in progress').length,
      open: tasks.filter(task => task.status === 'open').length,
    };

    return { taskStats };
  }, [tasks]);

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

  return (
    <div className="dashboard">
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <SplitFlapDisplay 
              value={statistics.taskStats.total} 
              digits={2}
              backgroundColor="var(--bg-primary)"
              textColor="var(--text-primary)"
            />
          </div>
        </div>
      </section>

      <section className="recent-section">
        <h2>Notes from yesterday</h2>
        <div className="activity-list">
          {notes
            .filter(note => {
              const noteDate = new Date(note.created_at);
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              return noteDate.toDateString() === yesterday.toDateString();
            })
            .map(note => (
              <Link 
                key={note.id}
                to={`/notes/${note.id}`}
                className="activity-item"
              >
                <div className="activity-type note">
                  📝
                </div>
                <div className="activity-content">
                  <h4>{note.title}</h4>
                  <p className="activity-date">{formatDate(note.created_at)}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="activity-tags">
                      {note.tags.map(tag => (
                        <span key={tag.id} className="tag">{tag.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          {notes.filter(note => {
            const noteDate = new Date(note.created_at);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return noteDate.toDateString() === yesterday.toDateString();
          }).length === 0 && (
            <p className="no-notes">No notes from yesterday</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
