import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function TaskDetails({ tasks }) {
  const { taskId } = useParams();
  console.log("Tasks prop:", tasks); // Add this line
  const task = tasks.find(task => task.id === parseInt(taskId));

  if (!task) {
    return <div>Task not found.</div>;
  }

  return (
    <div>
      <h1>Task Details</h1>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Status: {task.status}</p>
      {/* Display other task details */}
    </div>
  );
}

export default TaskDetails;