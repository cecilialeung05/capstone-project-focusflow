import React, { useState } from 'react';

function Tags({ tags, addTag, updateTag, deleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const handleCreateTag = () => {
    addTag({ name: newTagName });
    setNewTagName('');
  };

  const handleSelectTag = (tagId) => {
    setSelectedTag(tagId);
  };
    // Filter tasks and notes based on selected tag
    const filteredTasks = selectedTag
    ? tasks.filter(task => task.tagId === selectedTag || task.tags?.includes(selectedTag))
    : [];

  const filteredNotes = selectedTag
    ? notes.filter(note => note.tagId === selectedTag || note.tags?.includes(selectedTag))
    : [];

  return (
    <div>
      <h1>Tags</h1>
      <input
        type="text"
        value={newTagName}
        onChange={(e) => setNewTagName(e.target.value)}
        placeholder="New Tag Name"
      />
      <button onClick={handleCreateTag}>Create Tag</button>
      {/* Tags List */}
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <button onClick={() => handleSelectTag(tag.id)}>
              {tag.name}
            </button>
          </li>
        ))}
      </ul>
  
      {/* Show Filtered Tasks and Notes */}
      {selectedTag && (
        <div>
          <h2>Tasks for {tags.find(t => t.id === selectedTag)?.name}</h2>
          <ul>
            {filteredTasks.length ? (
              filteredTasks.map(task => <li key={task.id}>{task.name}</li>)
            ) : (
              <p>No tasks found for this tag.</p>
            )}
          </ul>

          <h2>Notes for {tags.find(t => t.id === selectedTag)?.name}</h2>
          <ul>
            {filteredNotes.length ? (
              filteredNotes.map(note => <li key={note.id}>{note.content}</li>)
            ) : (
              <p>No notes found for this tag.</p>
            )}
          </ul>
        </div>
      )}
    </div>
    
  );
}

export default Tags;