import React, { useState, useEffect } from 'react';
import './DashboardHeader.scss';

// Integrated SplitFlapDisplay component
function SplitFlapDisplay({ value, digits = 2 }) {
  const [displayValue, setDisplayValue] = useState(value);
  
  useEffect(() => {
    let currentValue = displayValue;
    const targetValue = value;
    const increment = targetValue > currentValue ? 1 : -1;
    
    if (currentValue !== targetValue) {
      const timer = setInterval(() => {
        currentValue += increment;
        setDisplayValue(currentValue);
        
        if (currentValue === targetValue) {
          clearInterval(timer);
        }
      }, 100);
      
      return () => clearInterval(timer);
    }
  }, [value]);

  return (
    <div className="split-flap">
      {String(displayValue).padStart(digits, '0').split('').map((digit, index) => (
        <div key={index} className="split-flap__digit">
          {digit}
        </div>
      ))}
    </div>
  );
}

function DashboardHeader() {
  const [totalNotes, setTotalNotes] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      setTotalNotes(5); // Replace with actual data
      setTotalTasks(3); // Replace with actual data
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-header">
      <div className="dashboard-header__stats">
        <div className="stat-card">
          <h3>Active Tasks</h3>
          <SplitFlapDisplay value={totalTasks} digits={2} />
        </div>
        <div className="stat-card">
          <h3>Total Notes</h3>
          <SplitFlapDisplay value={totalNotes} digits={2} />
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader; 