import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import '../pages/TaskDetails.scss';

function TaskDetails({ tasks, tags, updateTask, deleteTask }) {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  const task = tasks.find(t => t.id === Number(taskId));

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
          tags={tags}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="task-details__header">
            <h2 className="task-details__title">{task.title}</h2>
            <span className={`task-details__status task-details__status--${task.status.replace(' ', '-')}`}>
              {task.status}
            </span>
          </div>
          
          <div className="task-details__info">
            <p className="task-details__info-item">
              <strong>Description:</strong> {task.description}
            </p>
            <p className="task-details__info-item">
              <strong>Due Date:</strong> {formatDate(task.due_date)}
            </p>
            <p className="task-details__info-item">
              <strong>Status:</strong> {task.status}
            </p>
          </div>

          <div className="task-details__actions">
            <button 
              className="task-details__button task-details__button--edit"
              onClick={() => setIsEditing(true)}
            >
              Edit Task
            </button>
            <button 
              className="task-details__button task-details__button--delete"
              onClick={handleDelete}
            >
              Delete Task
            </button>
            <button 
              className="task-details__button task-details__button--back"
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