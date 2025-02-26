import React, { useState, useEffect } from 'react';
import './Greeting.scss';

function Greeting() {
  const [dateTime, setDateTime] = useState(new Date());
  const [isEditing, setIsEditing] = useState(!localStorage.getItem('userName'));
  const [name, setName] = useState(localStorage.getItem('userName') || '');

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = dateTime.getHours();
    const timeGreeting = hour < 12 ? 'GOOD MORNING' : 
                        hour < 17 ? 'GOOD AFTERNOON' : 
                        'GOOD EVENING';
    return `${timeGreeting}, ${name.toUpperCase()}`;
  };

  const formatDate = () => {
    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return dateTime.toLocaleDateString('en-US', options).toUpperCase();
  };

  const formatTime = dateTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).toUpperCase();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      localStorage.setItem('userName', name.trim());
      setIsEditing(false);
      window.dispatchEvent(new Event('nameUpdated'));
    }
  };

  const handleClearSession = () => {
    localStorage.removeItem('userName');
    setName('');
    setIsEditing(true);
    window.dispatchEvent(new Event('nameUpdated'));
  };

  return (
    <div className="greeting">
      {isEditing ? (
        <form onSubmit={handleSubmit} className="greeting__form">
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="greeting__input"
            autoFocus
          />
          <button type="submit" className="greeting__button">
            Get Started
          </button>
        </form>
      ) : (
        <div className="greeting__content">
          <div className="greeting__text">{getGreeting()}</div>
          <div className="greeting__date">{formatDate()}</div>
          <div className="greeting__time">{formatTime}</div>
          <button 
            className="greeting__edit"
            onClick={handleClearSession}
          >
            Change Name
          </button>
        </div>
      )}
    </div>
  );
}

export default Greeting; 