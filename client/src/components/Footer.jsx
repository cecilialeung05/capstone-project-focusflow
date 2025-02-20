import React from 'react';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">
          © {new Date().getFullYear()} Productivity App
        </p>
      </div>
    </footer>
  );
}

export default Footer;