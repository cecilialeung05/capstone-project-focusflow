// src/pages/TasksPage/TasksPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TasksPage.scss';

function TasksPage() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>
      <Link to="/tasks/add" className="tasks-page__add-button">Add Task</Link>
      <ul className="tasks-page__list">
        {tasks.map((task) => (
          <li key={task.id} className="tasks-page__list-item">
            <Link to={`/tasks/${task.id}`} className="tasks-page__task-link">{task.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksPage;