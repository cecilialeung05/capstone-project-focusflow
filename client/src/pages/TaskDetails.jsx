import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';

function TaskDetails({ tasks, updateTask, deleteTask }) {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const task = tasks.find(t => t.id === parseInt(taskId));

  if (!task) {
    return <div>Task not found</div>;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });

    let relativeTime;
    if (diffDays === 0) {
      relativeTime = '(Today)';
    } else if (diffDays === 1) {
      relativeTime = '(Tomorrow)';
    } else if (diffDays === -1) {
      relativeTime = '(Yesterday)';
    } else if (diffDays < -1) {
      relativeTime = `(${Math.abs(diffDays)} days overdue)`;
    } else if (diffDays <= 7) {
      relativeTime = `(in ${diffDays} days)`;
    } else {
      relativeTime = '';
    }

    return `${formattedDate} ${relativeTime}`.trim();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate('/tasks');
  };

  const handleUpdate = async (updatedTaskData) => {
    await updateTask(task.id, updatedTaskData);
    setIsEditing(false);
  };

  return (
    <div className="task-details">
      {isEditing ? (
        <TaskForm 
          task={task}
          addTask={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="task-header">
            <h2>{task.title}</h2>
            <span className={`status-badge ${task.status.replace(' ', '-')}`}>
              {task.status}
            </span>
          </div>
          
          <div className="task-info">
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Due Date:</strong> {formatDate(task.due_date)}</p>
            <p><strong>Status:</strong> {task.status}</p>
          </div>

          <div className="task-actions">
            <button 
              className="edit-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Task
            </button>
            <button 
              className="delete-btn"
              onClick={handleDelete}
            >
              Delete Task
            </button>
            <button 
              className="back-btn"
              onClick={() => navigate('/tasks')}
            >
              Back to Tasks
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskDetails;