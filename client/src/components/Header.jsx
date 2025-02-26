import React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">Productivity App</h1>
        <nav className="header__nav">
          <Link to="/tasks" className="header__nav-link">Tasks</Link>
          <Link to="/notes" className="header__nav-link">Notes</Link>
          <Link to="/tags" className="header__nav-link">Tags</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;