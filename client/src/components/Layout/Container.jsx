import React from 'react';
import Navbar from './Navbar';
import Header from '../Header';
import Footer from '../Footer';
import './Container.scss'; 

const Container = ({ children, theme, toggleTheme, tasks, notes }) => {
  return (
    <div className={`app-container ${theme}`}>
      <div className="layout-container">
        <Header />
        <Navbar theme={theme} toggleTheme={toggleTheme} tasks={tasks} notes={notes} />
        <div className="container">
          <div className="content-wrapper">
            {children}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Container;