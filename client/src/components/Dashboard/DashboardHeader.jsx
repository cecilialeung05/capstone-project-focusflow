import React from 'react';
import SplitFlapDisplay from '../SplitFlapDisplay';
import './DashboardHeader.scss';

function DashboardHeader({ taskCount, noteCount }) {
  return (
    <div className="dashboard-header">
      <div className="dashboard-header__stats">
        <div className="stat-card">
          <h3>Active Tasks</h3>
          <SplitFlapDisplay 
            value={taskCount} 
            digits={2}
            backgroundColor="#2c3e50"
            textColor="#ecf0f1"
          />
        </div>
        <div className="stat-card">
          <h3>Total Notes</h3>
          <SplitFlapDisplay 
            value={noteCount} 
            digits={2}
            backgroundColor="#2c3e50"
            textColor="#ecf0f1"
          />
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader; 