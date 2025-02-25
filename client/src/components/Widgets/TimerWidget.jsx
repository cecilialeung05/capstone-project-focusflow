import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaUndo } from 'react-icons/fa';
import './TimerWidget.scss';

function TimerWidget({ onTimerEvent }) {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeToday, setTotalTimeToday] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  const prompts = [
    "Time for a quick stretch!",
    "Take a water break",
    "Look away from screen",
    "Deep breath moment",
    "Quick posture check"
  ];

  const [currentPrompt, setCurrentPrompt] = useState('');

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
        setTotalTimeToday(prev => prev + 1);
        
        if (totalTimeToday % (20 * 60) === 0) {
          const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
          setCurrentPrompt(randomPrompt);
          setShowPrompt(true);
          setTimeout(() => setShowPrompt(false), 5000);
          onTimerEvent?.('milestone', totalTimeToday);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, totalTimeToday, onTimerEvent]);

  const handleStart = () => {
    setIsRunning(true);
    onTimerEvent?.('start', totalTimeToday);
  };

  const handlePause = () => {
    setIsRunning(false);
    onTimerEvent?.('break', totalTimeToday);
  };

  const handleReset = () => {
    setTime(25 * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-widget">
      <div className="timer-widget__display">
        {formatTime(time)}
        {showPrompt && (
          <div className="timer-widget__prompt">
            {currentPrompt}
          </div>
        )}
      </div>
      
      <div className="timer-widget__controls">
        {!isRunning ? (
          <button onClick={handleStart} className="timer-widget__button">
            <FaPlay />
            Start
          </button>
        ) : (
          <button onClick={handlePause} className="timer-widget__button">
            <FaPause />
            Pause
          </button>
        )}
        <button onClick={handleReset} className="timer-widget__button">
          <FaUndo />
          Reset
        </button>
      </div>
    </div>
  );
}

export default TimerWidget; 