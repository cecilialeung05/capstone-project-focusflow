import React, { useState } from 'react';
import { FaPlus, FaTasks, FaFileAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './FloatingActionButton.scss';

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleAction = (type) => {
    setIsOpen(false);
    switch(type) {
      case 'task':
        navigate('/tasks/new');
        break;
      case 'note':
        navigate('/notes/new');
        break;
    }
  };

  return (
    <div className={`floating-action-button ${isOpen ? 'is-open' : ''}`}>
      <button 
        className="fab-main"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Add new item"
      >
        <FaPlus />
      </button>
      
      <div className="fab-menu">
        <button 
          onClick={() => handleAction('task')}
          className="fab-item"
          aria-label="Add new task"
        >
          <FaTasks />
          <span>New Task</span>
        </button>
        <button 
          onClick={() => handleAction('note')}
          className="fab-item"
          aria-label="Add new note"
        >
          <FaFileAlt />
          <span>New Note</span>
        </button>
      </div>
    </div>
  );
} 