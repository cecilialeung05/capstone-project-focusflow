import React, { useState } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';

function Tasks({ tasks, addTask, updateTask, deleteTask }) {
  return (
    <div>
      <h1>Tasks</h1>
      <TaskForm addTask={addTask} />
      <ul>
        {tasks.map(task => (
          <TaskItem key={task.id} task={task} addTask={addTask} updateTask={updateTask} deleteTask={deleteTask}/>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
