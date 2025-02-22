import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/Tasks/TaskForm';
import './TaskDetails.scss';

function TaskDetails({ tasks, tags, updateTask, deleteTask }) {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const task = tasks.find(t => t.id === Number(taskId));

  if (!task) {
    return <div>Task not found</div>;
  }

  const formatRelativeDate = (dateString) => {
    if (!dateString) return 'No due date';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Format the actual date
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
    });

    // Add relative time description
    let relativeTime;
    if (diffDays === 0) {
      relativeTime = 'Due today';
    } else if (diffDays === 1) {
      relativeTime = 'Due tomorrow';
    } else if (diffDays === -1) {
      relativeTime = 'Due yesterday';
    } else if (diffDays > 1 && diffDays <= 7) {
      relativeTime = `Due in ${diffDays} days`;
    } else if (diffDays < -1 && diffDays >= -7) {
      relativeTime = `Due ${Math.abs(diffDays)} days ago`;
    } else if (diffDays > 7 && diffDays <= 14) {
      relativeTime = 'Due next week';
    } else if (diffDays < -7 && diffDays >= -14) {
      relativeTime = 'Due last week';
    } else if (diffDays > 14) {
      relativeTime = `Due on ${formattedDate}`;
    } else {
      relativeTime = `Was due on ${formattedDate}`;
    }

    return relativeTime;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
      navigate('/tasks');
    }
  };

  return (
    <div className="task-details">
      {isEditing ? (
        <TaskForm 
          task={task}
          tags={tags}
          onSubmit={(updatedTask) => {
            updateTask(updatedTask);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="task-details__header">
            <h1>{task.title}</h1>
          </div>

          <div className="task-details__info">
            <p className="task-details__date">
              {formatRelativeDate(task.due_date)}
            </p>
            <p className="task-details__description">
              {task.description || 'No description provided'}
            </p>
            <p className="task-details__status">
              Status: {task.status}
            </p>
          </div>

          <div className="task-details__actions">
            <button 
              className="task-details__button task-details__button--edit"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button 
              className="task-details__button task-details__button--delete"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button 
              className="task-details__button task-details__button--status"
              onClick={() => updateTask({ ...task, status: 'in progress' })}
            >
              Set In Progress
            </button>
            <button 
              className="task-details__button task-details__button--status"
              onClick={() => updateTask({ ...task, status: 'completed' })}
            >
              Complete
            </button>
            <button 
              className="task-details__button task-details__button--status"
              onClick={() => updateTask({ ...task, status: 'blocked' })}
            >
              Block
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskDetails;