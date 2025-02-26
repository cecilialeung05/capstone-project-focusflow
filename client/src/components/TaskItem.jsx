import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TaskForm from './TaskForm';

function TaskItem({ task, updateTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleStatusChange = (newStatus) => {
    updateTask(task.id, { ...task, status: newStatus });
  };

  return (
    <li key={task.id}>
      <h3>
        <Link to={`/tasks/${task.id}`}>{task.title}</Link>
      </h3>
      <p>{task.description}</p>
      <p>Due Date: {task.due_date}</p>
      <p>Status: {task.status}</p>
             {task.tags && task.tags.length > 0 && (
                <div>
                <h4>Tags:</h4>
                  {task.tags.map((tag) => (
                    <span key={tag}> {tag}</span>
                  ))}
                </div>
              )}
      <button onClick={() => handleStatusChange('open')}>Set Open</button>
      <button onClick={() => handleStatusChange('in progress')}>Set In Progress</button>
      <button onClick={() => handleStatusChange('completed')}>Set Completed</button>
      <button onClick={() => setIsEditing(true)}>Update Task</button> 
      <button onClick={() => deleteTask(task.id)}>Delete</button>
    
     {isEditing && ( 
      <div className="modal">
        <div className="modal-content">
           <TaskForm 
             task={task} 
             addTask={updateTask} 
             onCancel={() => setIsEditing(false)}
            />
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}
    </li>
  );
}

export default TaskItem;