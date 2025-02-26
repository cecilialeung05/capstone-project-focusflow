import React from 'react';
import Navbar from './Navbar';
import Header from './Header';
import RightSidebar from "./RightSidebar";
import './Container.scss'; 

const Container = ({ children, isTimerOpen, setIsTimerOpen }) => {
  return (
    <div className="app-container"> 
        <div className="layout-container"> 
      <Navbar isTimerOpen={isTimerOpen} setIsTimerOpen={setIsTimerOpen} />
      <div className="container">
      <div className="content-wrapper">  
        <Header />
        {children}
        <RightSidebar />
      </div>
      </div>
      </div>
    </div>
  );
};

export default Container;