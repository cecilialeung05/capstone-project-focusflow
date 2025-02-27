import React, { useState, useEffect } from 'react';
import './DashboardHeader.scss';

function SplitFlapDisplay() {
  const [targetDate, setTargetDate] = useState(localStorage.getItem('milestoneDate') || '');
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [message, setMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const motivationalMessages = [
    "One day at a time!",
    "You've got this!",
    "Making progress every day!",
    "You're on your way!",
  ];

  useEffect(() => {
    const calculateDaysRemaining = () => {
      if (!targetDate) return 0;
      
      const today = new Date();
      const milestone = new Date(targetDate);
      const diffTime = milestone - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    };

    const days = calculateDaysRemaining();
    setDaysRemaining(days);

    if (days === 0) {
      setMessage("TODAY IS THE DAY!");
    } else if (days <= 7) {
      setMessage("Almost there! The big day is coming!");
    } else {
      setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    }

    const timer = setInterval(() => {
      setDaysRemaining(calculateDaysRemaining());
    }, 86400000); // 24 hours

    return () => clearInterval(timer);
  }, [targetDate]);

  const handleDateSubmit = (e) => {
    e.preventDefault();
    const date = e.target.date.value;
    localStorage.setItem('milestoneDate', date);
    setTargetDate(date);
    setIsEditing(false);
  };

  return (
    <div className="goal-display">
      {isEditing ? (
        <form onSubmit={handleDateSubmit} className="date-input-form">
          <input 
            type="date" 
            name="date"
            defaultValue={targetDate}
            min={new Date().toISOString().split('T')[0]}
            required
            autoFocus
          />
          <div className="form-buttons">
            <button type="submit">Set</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <div 
            className="split-flap-container" 
            onClick={() => setIsEditing(true)}
            title="Click to set date"
          >
            <div className="split-flap">
              {String(Math.min(daysRemaining, 99)).padStart(2, '0').split('').map((digit, index) => (
                <div key={index} className="split-flap__digit">
                  {digit}
                </div>
              ))}
            </div>
            <span className="hover-label">set date here</span>
          </div>
          <div className="goal-display__message">
            {targetDate && (
              <div className="goal-display__label">
                days until you reach your goal
              </div>
            )}
            <div className="goal-display__motivation">{message}</div>
          </div>
        </>
      )}
    </div>
  );
}

export default SplitFlapDisplay;