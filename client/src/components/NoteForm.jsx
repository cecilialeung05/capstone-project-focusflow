import React, { useState } from 'react';

function NoteForm({ addNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [taskId, setTaskId] = useState(''); // For linking to a task

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    addNote({
      title,
      content,
      task_id: taskId || null // Convert empty string to null for optional task_id
    });

    // Clear the form
    setTitle('');
    setContent('');
    setTaskId('');
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
          required
        />
      </div>
      <div>
        <label htmlFor="content">Content:</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="taskId">Task ID (Optional):</label>
        <input
          type="number" // Or a dropdown if you want to select from existing tasks
          id="taskId"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          placeholder="Enter Task ID"
        />
      </div>
      <button type="submit">Add Note</button>
    </form>
  );
}

export default NoteForm;