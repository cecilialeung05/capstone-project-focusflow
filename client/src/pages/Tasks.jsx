import React, { useState } from 'react';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

function Tasks({ tasks, tags, addTask, updateTask, deleteTask }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="tasks-page">
      <div className="tasks-page__header">
        <h1>Tasks</h1>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add New Task'}
        </button>
      </div>

      {showForm && (
        <TaskForm 
          addTask={addTask}
          tags={tags}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="tasks-list">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}

export default Tasks;