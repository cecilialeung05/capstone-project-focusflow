import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import noteService from '../services/noteService';
import { Link, useParams } from 'react-router-dom';
import './Tags.scss';
import TaskItem from './TaskItem';
import NoteItem from './NoteItem';

function Tags({ tags, tasks, notes, addTag, updateTag, deleteTag }) {
  const [newTagName, setNewTagName] = useState('');
  const [selectedTagId, setSelectedTagId] = useState(null);
  const [editingTagId, setEditingTagId] = useState(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState(tags);

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      addTag({ name: newTagName.trim() });
      setNewTagName('');
    }
  };

  const handleEditTag = (tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
  };

  const handleUpdateTag = () => {
    if (editingTagName.trim()) {
      updateTag(editingTagId, { name: editingTagName.trim() });
      setEditingTagId(null);
      setEditingTagName('');
    }
  };

  const handleTagClick = (tagId) => {
    setSelectedTagId(tagId === selectedTagId ? null : tagId);
  };

  useEffect(() => {
    const filtered = tags.filter(tag => 
      tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTags(filtered);
  }, [tags, searchTerm]);

  const filteredNotes = selectedTagId
    ? notes.filter(note => 
        note.tags && note.tags.some(tag => tag.id === selectedTagId)
      )
    : [];

  const filteredTasks = selectedTagId
    ? tasks.filter(task => 
        task.tags && task.tags.some(tag => tag.id === selectedTagId)
      )
    : [];


  useEffect(() => {

    if (selectedTagId) {
      console.log('Selected Tag ID:', selectedTagId);
      console.log('All Tasks:', tasks);
      console.log('Filtered Tasks:', filteredTasks);
      console.log('All Notes:', notes);
      console.log('Filtered Notes:', filteredNotes);
    }
  }, [selectedTagId, tasks, notes]);

  return (
    <div className="tags-container">
      <div className="tags-section">
        <div className="tags-header">
          <h2>Tags</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        <div className="tags-list">
          {filteredTags.map(tag => (
            <div 
              key={tag.id}
              className={`tag-item ${selectedTagId === tag.id ? 'selected' : ''}`}
              onClick={() => handleTagClick(tag.id)}
            >
              <span className="tag-name">{tag.name}</span>
              <span className="tag-count">
                {tasks.filter(task => task.tags?.some(t => t.id === tag.id)).length +
                 notes.filter(note => note.tags?.some(t => t.id === tag.id)).length} items
              </span>
            </div>
          ))}
          {filteredTags.length === 0 && (
            <p className="no-results">No tags found matching "{searchTerm}"</p>
          )}
        </div>
      </div>
      
      <div className="tagged-items">
        {selectedTagId && (
          <>
            <h3>Tasks with this tag:</h3>
            <div className="tasks-list">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskItem key={task.id} task={task} />
                ))
              ) : (
                <p className="no-items">No tasks with this tag</p>
              )}
            </div>

            <h3>Notes with this tag:</h3>
            <div className="notes-list">
              {filteredNotes.length > 0 ? (
                filteredNotes.map(note => (
                  <NoteItem key={note.id} note={note} />
                ))
              ) : (
                <p className="no-items">No notes with this tag</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Tags;