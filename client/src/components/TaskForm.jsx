import React, { useState } from 'react';

function TaskForm({ addTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('open'); // Default status

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the data if needed
    if (!title) {
      alert("Task title cannot be empty");
      return;
    }

    addTask({
      title,
      description,
      due_date: dueDate, // Make sure your backend expects this format
      status
    });

    // Clear the form after submitting
    setTitle('');
    setDescription('');
    setDueDate('');
    setStatus('open');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required // Add HTML5 validation
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="dueDate">Due Date:</label>
        <input
          type="date" // Use type="date" for date input
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button type="submit">Add Task</button>
    </form>
  );
}

export default TaskForm;