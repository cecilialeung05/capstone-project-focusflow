import React from 'react';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Productivity App</p>
    </footer>
  );
}

export default Footer;