import React, { useState, useEffect } from 'react';
// import './TimerWidget.scss';

function TimerWidget() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-widget">
      <h3 className="timer-widget__title">Timer</h3>
      <div className="timer-widget__content">
        <div className="timer-widget__display">{formatTime(time)}</div>
        <div className="timer-widget__controls">
          <button 
            className="timer-widget__button"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            className="timer-widget__button"
            onClick={() => setTime(0)}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerWidget; 