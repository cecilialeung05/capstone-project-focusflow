import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import noteService from '../services/noteService';
import { Link, useParams } from 'react-router-dom';
import './Tags.scss';

function Tags({ tags, addTag, updateTag, deleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]); // Fetch tasks and notes
//   const [selectedTagId, setSelectedTagId] = useState(null);

const { tagId } = useParams(); // Get tagId from URL

    useEffect(() => {
    const fetchInitialData = async () => {
        try {
            const [tasksData, notesData] = await Promise.all([
                taskService.getAllTasks(),
                noteService.getAllNotes()
              ]);
              setTasks(tasksData);
              setNotes(notesData);
        } catch (error) {
            console.error("Error fetching initial data:", error);
            // Handle errors (e.g., display an error message to the user)
        }
    };
    fetchInitialData();
  }, []);

//   const handleCreateTag = () => {
//     addTag({ name: newTagName });
//     setNewTagName('');
//   };
  const handleCreateTag = () => {
    addTag({ name: newTagName });
    setNewTagName('');
  };

  // Filter tasks based on selected tag
  const filteredTasks = selectedTagId
    ? tasks.filter(task => task.tags && task.tags.some(tag => tag.id === selectedTagId))
    : [];

  // Filter notes based on selected tag
  const filteredNotes = selectedTagId
    ? notes.filter(note => note.tags && note.tags.some(tag => tag.id === selectedTagId))
    : [];

  return (
    <div className="tags-page"> {/* Added a className for styling */}
      <h1>Tags</h1>
      <input
        type="text"
        value={newTagName}
        onChange={(e) => setNewTagName(e.target.value)}
        placeholder="New Tag Name"
      />
      <button onClick={handleCreateTag}>Create Tag</button>
      <ul>
      {tags.map(tag => (
          <li key={tag.id} className="tags-page__list-item"> {/* Added className for list items */}
            <button onClick={() => handleTagClick(tag.id)}>{tag.name}</button>
          </li>
        ))}
      </ul>
      {selectedTagId && (
        <div className="tags-page__filtered-content"> {/* Add a className for this div */}
          <h2>Tasks with Tag ID {selectedTagId}</h2>
          {filteredTasks.length > 0 ? (
            <ul>
              {filteredTasks.map(task => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          ) : (
            <p>No tasks found with this tag.</p>
          )}

          <h2>Notes with Tag ID {selectedTagId}</h2>
          {filteredNotes.length > 0 ? (
            <ul>
              {filteredNotes.map(note => (
                <li key={note.id}>{note.title}</li>
              ))}
            </ul>
          ) : (
            <p>No notes found with this tag.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Tags;