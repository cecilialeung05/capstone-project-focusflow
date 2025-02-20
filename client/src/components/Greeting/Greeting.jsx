import React, { useState, useEffect } from 'react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import './Greeting.scss';

function Greeting() {
  const [dateTime, setDateTime] = useState(new Date());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 150 });

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = dateTime.getHours();
    if (hour < 12) return 'GOOD MORNING';
    if (hour < 17) return 'GOOD AFTERNOON';
    return 'GOOD EVENING';
  };

  const formatDate = () => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  const handleResize = (e, { size }) => {
    setDimensions({ width: size.width, height: size.height });
  };

  return (
    <div className={`greeting ${isCollapsed ? 'greeting--collapsed' : ''}`}>
      <button 
        className="greeting__toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand greeting' : 'Collapse greeting'}
      >
        {isCollapsed ? '↓' : '↑'}
      </button>
      
      {!isCollapsed && (
        <ResizableBox
          width={dimensions.width}
          height={dimensions.height}
          onResize={handleResize}
          minConstraints={[200, 100]}
          maxConstraints={[500, 200]}
          className="greeting__resizable"
        >
          <div className="greeting__content">
            <div className="greeting__text">{getGreeting()}</div>
            <div className="greeting__date">{formatDate()}</div>
            <div className="greeting__time">{formatTime}</div>
          </div>
        </ResizableBox>
      )}
    </div>
  );
}

export default Greeting; 