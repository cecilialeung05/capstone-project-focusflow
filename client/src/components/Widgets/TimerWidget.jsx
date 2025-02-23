import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaUndo } from 'react-icons/fa';
import './TimerWidget.scss';

function TimerWidget() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="timer-widget">
      <div className="timer-widget__content">
        <div className="timer-widget__display">{formatTime(time)}</div>
        <div className="timer-widget__controls">
          <button 
            className={`timer-widget__button ${isRunning ? 'timer-widget__button--stop' : 'timer-widget__button--start'}`}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <FaPause /> Pause
              </>
            ) : (
              <>
                <FaPlay /> Start
              </>
            )}
          </button>
          
          <button 
            className="timer-widget__button timer-widget__button--reset"
            onClick={handleReset}
          >
            <FaUndo /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default TimerWidget; 