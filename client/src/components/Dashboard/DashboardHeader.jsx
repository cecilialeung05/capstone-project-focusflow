import React, { useState, useEffect } from 'react';
import './DashboardHeader.scss';

function SplitFlapDisplay({ value, digits = 2 }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [message, setMessage] = useState('');
  
  const motivationalMessages = [
    "One step at a time!",
  ];

  useEffect(() => {
    let currentValue = displayValue;
    const targetValue = value;
    const increment = targetValue > currentValue ? 1 : -1;
    
    if (value === 0) {
      setMessage("Goal achieved! Amazing work!");
    } else if (value <= 3) {
      setMessage("Almost there! You're so close!");
    } else {
      setMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
    }
    
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
    <div className="goal-display">
      <div className="split-flap">
        {String(displayValue).padStart(digits, '0').split('').map((digit, index) => (
          <div key={index} className="split-flap__digit">
            {digit}
          </div>
        ))}
      </div>
      <div className="goal-display__message">
        <div className="goal-display__label">days until you reach your goal</div>
        <div className="goal-display__motivation">{message}</div>
      </div>
    </div>
  );
}


export default SplitFlapDisplay;