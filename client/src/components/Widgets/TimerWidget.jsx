import React, { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaUndo } from 'react-icons/fa';
import { BellSimpleRinging } from "@phosphor-icons/react";
import './TimerWidget.scss';

function TimerWidget({ onTimerEvent, autoStart, selectedTask }) {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeToday, setTotalTimeToday] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [breakCountdown, setBreakCountdown] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);

  const breakPrompts = [
      "Do a quick stretch!",
      "Take a water break",
      "20-20-20 rule, look away from your screen",
      "Ahhhh... Deep breath moment",
      "Itching to move? Go for a quick walk",
      "Quick! Do a posture check"
  ];

  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleEscape = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowBreakPrompt(false);
      setTime(25 * 60); 
      setIsRunning(false);
    }
  }, []);

  useEffect(() => {
    if (showBreakPrompt) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [showBreakPrompt, handleEscape]);

  useEffect(() => {
    if (autoStart) {
      handleStart();
    }
  }, [autoStart]);

  useEffect(() => {
    let countdownInterval;
    if (breakCountdown > 0) {
      countdownInterval = setInterval(() => {
        setBreakCountdown(prev => {
          const newCount = prev - 1;
          if (newCount === 0) {
            setShowBreakPrompt(false);
          }
          return newCount;
        });
      }, 1000);
    }
    return () => clearInterval(countdownInterval);
  }, [breakCountdown]);

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            const randomPrompt = breakPrompts[Math.floor(Math.random() * breakPrompts.length)];
            setCurrentPrompt(randomPrompt);
            setShowBreakPrompt(true);
            setShowOverlay(true);
            onTimerEvent?.('break', totalTimeToday, selectedTask?.id);
            setIsRunning(false);
            
            const breakDuration = randomPrompt.includes("15") ? 15 * 60 : 5 * 60;
            setBreakCountdown(breakDuration);
            
            setTimeout(() => {
              setShowOverlay(false);
            }, 3000);
          }
          return newTime;
        });
        setTotalTimeToday(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, totalTimeToday, onTimerEvent, selectedTask]);

  const handleStart = () => {
    if (!selectedTask) {
      alert('Please select a task to start the timer');
      return;
    }
    setIsRunning(true);
    setShowBreakPrompt(false);
    onTimerEvent?.('start', totalTimeToday, selectedTask.id);
  };

  const handlePause = () => {
    setIsRunning(false);
    onTimerEvent?.('pause', totalTimeToday, selectedTask?.id);
  };

  const handleReset = () => {
    setTime(25 * 60);
    setIsRunning(false);
    setShowBreakPrompt(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatBreakTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerBreakDemo = () => {
    const randomPrompt = breakPrompts[Math.floor(Math.random() * breakPrompts.length)];
    setCurrentPrompt(randomPrompt);
    setShowBreakPrompt(true);
    setShowOverlay(true);
    setIsRunning(false);
    onTimerEvent?.('break', totalTimeToday, selectedTask?.id);
    
    const breakDuration = randomPrompt.includes("15") ? 15 * 60 : 5 * 60;
    setBreakCountdown(breakDuration);
    
    setTimeout(() => {
      setShowOverlay(false);
    }, 3000);
  };

  const TaskInfo = () => selectedTask && (
    <div className="timer-widget__task-info">
      <span className="timer-widget__task-label">Current Task:</span>
      <span className="timer-widget__task-title">{selectedTask.title}</span>
    </div>
  );

  return (
    <div className="timer-widget">
      <TaskInfo />
      {showBreakPrompt && (
        <>
          {showOverlay && (
            <div 
              className="timer-widget__modal-overlay"
              onClick={() => setShowBreakPrompt(false)}
            />
          )}
          <div className="timer-widget__modal">
            <button 
              className="timer-widget__modal-close"
              onClick={() => setShowBreakPrompt(false)}
            >
              ×
            </button>
            <div className="timer-widget__prompt-duration">
              {formatBreakTime(breakCountdown)}
            </div>
            <div className="timer-widget__prompt-message">
              {currentPrompt}
            </div>
          </div>
        </>
      )}
      <div className="timer-widget__display">
        {formatTime(time)}
        <button 
          className="timer-widget__demo-trigger"
          onClick={triggerBreakDemo}
          title="Demo break prompt"
        >
          <BellSimpleRinging size={20} weight="duotone" />
        </button>
      </div>
      
      <div className="timer-widget__controls">
        {!isRunning ? (
          <button 
            onClick={handleStart} 
            className={`timer-widget__button ${!selectedTask ? 'disabled' : ''}`}
            disabled={!selectedTask}
          >
            <FaPlay />
            {selectedTask ? 'Start' : 'Select Task'}
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