import React from "react";
import "./Insights.scss";
import AnimatedPage from "../components/AnimatedPage";
import TaskCompletionChart from "../components/TaskCompletionChart";

function Insights({ tasks, notes, tags }) {
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    inProgress: tasks.filter(task => task.status === 'in progress').length,
    open: tasks.filter(task => task.status === 'open').length
  };

  return (
    <AnimatedPage>
      <div className="insights">
        <div className="insights__header">
          <h1>Insights</h1>
        </div>
        
        <div className="insights__grid">
          <div className="insights__card">
            <h2>Task Statistics</h2>
            <div className="insights__stats">
              <div className="stat-item">
                <span className="stat-label">Total Tasks</span>
                <span className="stat-value">{taskStats.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed</span>
                <span className="stat-value">{taskStats.completed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">In Progress</span>
                <span className="stat-value">{taskStats.inProgress}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Open</span>
                <span className="stat-value">{taskStats.open}</span>
              </div>
            </div>
          </div>

          <div className="insights__card">
            <h2>Task Completion Trend</h2>
            <TaskCompletionChart tasks={tasks} />
          </div>

          <div className="insights__card">
            <h2>Notes Overview</h2>
            <div className="insights__stats">
              <div className="stat-item">
                <span className="stat-label">Total Notes</span>
                <span className="stat-value">{notes.length}</span>
              </div>
            </div>
          </div>

          <div className="insights__card">
            <h2>Tags Overview</h2>
            <div className="insights__stats">
              <div className="stat-item">
                <span className="stat-label">Total Tags</span>
                <span className="stat-value">{tags.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Insights;
