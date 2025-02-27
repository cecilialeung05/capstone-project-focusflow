import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import SplitFlapDisplay from '../components/Dashboard/DashboardHeader';
import { 
  ListChecks, 
  Timer, 
  NotePencil,
  Target,
  HourglassHigh,
  CheckCircle 
} from "@phosphor-icons/react";
import './Dashboard.scss';

function Dashboard({ tasks, notes, onTimerStart }) {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Guest');

  useEffect(() => {
    const handleNameUpdate = () => {
      setUserName(localStorage.getItem('userName') || 'Guest');
    };

    window.addEventListener('nameUpdated', handleNameUpdate);
    window.addEventListener('storage', handleNameUpdate);
    
    return () => {
      window.removeEventListener('nameUpdated', handleNameUpdate);
      window.removeEventListener('storage', handleNameUpdate);
    };
  }, []);

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
      <section className="welcome-section">
        <h1>{userName}'s Space</h1>
        
        <div className="goal-counter">
          <div className="counter-display">
            <SplitFlapDisplay />
          </div>
        </div>

        <div className="start-day-container">
          <h2>Start Your Day</h2>
          <div className="action-cards">
            <Link to="/tasks" className="action-card">
              <div className="card-icon">
                <ListChecks size={40} weight="duotone" />
              </div>
              <h3>Plan Your Tasks</h3>
              <p>Create and organize your daily tasks</p>
            </Link>
            <button 
              className="action-card timer-card"
              onClick={onTimerStart}
            >
              <div className="card-icon">
                <Timer size={40} weight="duotone" />
              </div>
              <h3>Focus Timer</h3>
              <p>Start a 25-minute focus session</p>
            </button>
            <Link to="/notes" className="action-card">
              <div className="card-icon">
                <NotePencil size={40} weight="duotone" />
              </div>
              <h3>Quick Notes</h3>
              <p>Capture your thoughts and ideas</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="progress-section">
        <h2>Today's Progress</h2>
        <div className="progress-pills">
          <div className="pill">
            <span className="pill-icon">
              <Target size={24} weight="duotone" />
            </span>
            <span className="pill-label">Open</span>
            <span className="pill-value">{statistics.taskStats.open}</span>
          </div>
          <div className="pill">
            <span className="pill-icon">
              <HourglassHigh size={24} weight="duotone" />
            </span>
            <span className="pill-label">In Progress</span>
            <span className="pill-value">{statistics.taskStats.inProgress}</span>
          </div>
          <div className="pill">
            <span className="pill-icon">
              <CheckCircle size={24} weight="duotone" />
            </span>
            <span className="pill-label">Completed</span>
            <span className="pill-value">{statistics.taskStats.completed}</span>
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
                <NotePencil size={25} weight="duotone" />
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
