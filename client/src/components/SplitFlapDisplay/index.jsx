import React, { useState, useEffect } from 'react';
import './SplitFlapDisplay.scss';

function SplitFlapDisplay({ value, digits = 2, backgroundColor = '#2c3e50', textColor = '#ecf0f1' }) {
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
    <div className="split-flap" style={{ backgroundColor }}>
      {String(displayValue).padStart(digits, '0').split('').map((digit, index) => (
        <div key={index} className="split-flap__digit" style={{ color: textColor }}>
          {digit}
        </div>
      ))}
    </div>
  );
}

export default SplitFlapDisplay; 