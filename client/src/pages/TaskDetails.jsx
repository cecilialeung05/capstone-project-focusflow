import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/Task/TaskForm';

function TaskDetails({ tasks, tags, updateTask, deleteTask }) {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = tasks.find(t => t.id === Number(taskId));

  if (!task) {
    return <div>Task not found</div>;
  }

  const handleUpdate = async (updatedTaskData) => {
    await updateTask(task.id, updatedTaskData);
    navigate('/tasks');
  };

  const handleDelete = () => {
    deleteTask(task.id);
    navigate('/tasks');
  };

  return (
    <div className="task-details">
      <TaskForm 
        task={task}
        addTask={handleUpdate}
        tags={tags}
        onCancel={() => navigate('/tasks')}
      />
      <button 
        className="delete-btn"
        onClick={handleDelete}
      >
        Delete Task
      </button>
    </div>
  );
}

export default TaskDetails;