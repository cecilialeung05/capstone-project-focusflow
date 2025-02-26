import { Link } from 'react-router-dom';
import { 
  MdDashboard,
  MdTask,         
  MdNote,        
  MdLocalLibrary, 
  MdSettings       
} from 'react-icons/md';
import TimerWidget from '../Widgets/TimerWidget';
import MotivationalQuotes from '../Widgets/MotivationalQuotes';
import { useState } from 'react';

import './Navbar.scss'; 

function Navbar({ isTimerOpen, setIsTimerOpen }) {
  const [totalTimeToday, setTotalTimeToday] = useState(0);
  const [timerEvent, setTimerEvent] = useState(null);

  const handleTimerEvent = (event, time) => {
    setTotalTimeToday(time);
    setTimerEvent(event);
  };

  return (
    <nav className="navbar">
      <ul>
        <li className="navbar__item">
          <button className="navbar__user-circle"></button>
        </li>
        <li>
          <Link to="/" className="nav-link">
            <MdDashboard className="nav-icon" />
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/tasks" className="nav-link">
            <MdTask className="nav-icon" />
            <span>Tasks</span>
          </Link>
        </li>
        <li>
          <Link to="/notes" className="nav-link">
            <MdNote className="nav-icon" />
            <span>Notes</span>
          </Link>
        </li>
        <li>
          <Link to="/tags" className="nav-link">
            <MdLocalLibrary className="nav-icon" />
            <span>Tag Library</span>
          </Link>
        </li>
        <li>
          <Link to="/settings" className="nav-link">
            <MdSettings className="nav-icon" />
            <span>Settings</span>
          </Link>
        </li>
        <li className="timer-container">
          <span className="timer-label">Timer</span>
          <div className="timer-display">
            <TimerWidget 
              onTimerEvent={handleTimerEvent} 
              autoStart={isTimerOpen}
            />
          </div>
        </li>
        <li>
          <div className="motivational-quote">
            <MotivationalQuotes 
              totalTimeToday={totalTimeToday} 
              timerEvent={timerEvent}
            />
          </div>
        </li>
      </ul>
      {isTimerOpen && (
        <div className="timer-widget">
          <button onClick={() => setIsTimerOpen(false)}>Close Timer</button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;