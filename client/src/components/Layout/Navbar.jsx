import React from 'react';
import { Link } from 'react-router-dom';
import Search from '../Search/Search';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.scss'; // 
import { FaUser } from 'react-icons/fa';

function Navbar({ tasks, notes }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <ul className="navbar__list">
        <li className="navbar__item">
          <button className="navbar__user-circle"></button>
          </li>
          <li className="navbar__item">
            <Link to="/" className="navbar__link">Dashboard</Link>
          </li>
          <li className="navbar__item">
            <Link to="/tasks" className="navbar__link">Tasks</Link>
          </li>
          <li className="navbar__item">
            <Link to="/notes" className="navbar__link">Notes</Link>
          </li>
          <li className="navbar__item">
            <Link to="/tags" className="navbar__link">Tags</Link>
          </li>
          <li className="navbar__item">
            <Link to="/settings" className="navbar__link">Settings</Link>
          </li>
          <li className="navbar__item">
            <div className="navbar__search">
              <Search tasks={tasks} notes={notes} />
            </div>
          </li>
          <li className="navbar__item">
            <button 
              onClick={toggleTheme} 
              className="navbar__button navbar__button--theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'} 
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;