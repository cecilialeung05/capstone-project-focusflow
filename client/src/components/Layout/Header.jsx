import React from 'react';
import { Link } from 'react-router-dom';
import './Header.scss';

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__logo">Productivity App</h1>
      </div>
    </header>
  );
}

export default Header;