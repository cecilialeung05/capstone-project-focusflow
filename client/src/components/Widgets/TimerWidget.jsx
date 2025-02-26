import React, { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaUndo } from 'react-icons/fa';
import { BellSimpleRinging } from "@phosphor-icons/react";
import './TimerWidget.scss';

function TimerWidget({ onTimerEvent, autoStart }) {
  const [time, setTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTimeToday, setTotalTimeToday] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);

  const breakPrompts = [
      "Do a quick stretch!",
      "Take a water break",
      "Look away from screen",
      "Deep breath moment",
      "Quick posture check"
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
    let interval;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => {
          const newTime = prev - 1;
          if (newTime === 0) {
            const randomPrompt = breakPrompts[Math.floor(Math.random() * breakPrompts.length)];
            setCurrentPrompt(randomPrompt);
            setShowBreakPrompt(true);
            onTimerEvent?.('break', totalTimeToday);
            setIsRunning(false);
          }
          return newTime;
        });
        setTotalTimeToday(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time, totalTimeToday, onTimerEvent]);

  const handleStart = () => {
    setIsRunning(true);
    setShowBreakPrompt(false);
    onTimerEvent?.('start', totalTimeToday);
  };

  const handlePause = () => {
    setIsRunning(false);
    onTimerEvent?.('pause', totalTimeToday);
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

  const triggerBreakDemo = () => {
    const randomPrompt = breakPrompts[Math.floor(Math.random() * breakPrompts.length)];
    setCurrentPrompt(randomPrompt);
    setShowBreakPrompt(true);
    setIsRunning(false);
    onTimerEvent?.('break', totalTimeToday);
    
    setTimeout(() => {
      setShowBreakPrompt(false);
    }, 3000);
  };

  return (
    <div className="timer-widget">
      {showBreakPrompt && (
        <>
          <div className="timer-widget__overlay">
            <span className="timer-widget__overlay-text">
              <button 
                className="timer-widget__overlay-close"
                onClick={() => setShowBreakPrompt(false)}
              >
                ×
              </button>
            </span>
          </div>
          <div className="timer-widget__prompt">
            {currentPrompt}
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