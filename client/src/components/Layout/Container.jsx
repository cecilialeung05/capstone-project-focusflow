import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import RightSidebar from "./RightSidebar";
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import Dashboard from "../../pages/Dashboard";
import Notes from "../../pages/Notes";
import Tasks from "../../pages/Tasks";
import Tags from "../../pages/Tags";
import TaskDetails from "../../pages/TaskDetails";
import NoteDetails from "../../pages/NoteDetails";
import NoteForm from '../Notes/NoteForm';
import './Container.scss';
import { normalizeData } from '../../utils/dataHelpers';
import { sampleTags, sampleNotes, sampleTasks } from './sampleData';

function Container({ devMode = false }) {
  console.log('Dev Mode:', devMode);
  console.log('Sample Data:', { sampleTags, sampleNotes, sampleTasks });

  const [notes, setNotes] = useState(() => {
    if (devMode) {
      console.log('Using sample notes:', sampleNotes);
      return sampleNotes;
    }
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? normalizeData(JSON.parse(savedNotes), devMode).notes : [];
  });

  const [tasks, setTasks] = useState(() => {
    if (devMode) {
      console.log('Using sample tasks:', sampleTasks);
      return sampleTasks;
    }
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? normalizeData(JSON.parse(savedTasks), devMode).tasks : [];
  });

  const [tags, setTags] = useState(() => {
    if (devMode) {
      console.log('Using sample tags:', sampleTags);
      return sampleTags;
    }
    const savedTags = localStorage.getItem('tags');
    return savedTags ? JSON.parse(savedTags) : [];
  });

  const [showQuickNotes, setShowQuickNotes] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [notes, tasks, tags]);

  // CRUD operations for notes
  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      note_tags: note.note_tags || []
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (updatedNote) => {
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id 
        ? { ...updatedNote, updated_at: new Date().toISOString() }
        : note
    ));
  };

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  // CRUD operations for tasks
  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      task_tags: task.task_tags || [],
      status: task.status || 'todo'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id 
        ? { ...updatedTask, updated_at: new Date().toISOString() }
        : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Tag operations
  const addTag = (tag) => {
    setTags(prev => [...prev, { ...tag, id: Date.now() }]);
  };

  const deleteTag = (tagId) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
  };

  const updateTag = (updatedTag) => {
    setTags(prev => prev.map(tag => 
      tag.id === updatedTag.id ? updatedTag : tag
    ));
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="layout__main">
        <Header onQuickNote={() => setShowQuickNotes(true)} />
        <Routes>
          <Route 
            path="/" 
            element={
              <Dashboard 
                notes={notes}
                tasks={tasks}
                tags={tags}
              />
            } 
          />
          <Route 
            path="/notes" 
            element={
              <Notes 
                notes={notes}
                tasks={tasks}
                tags={tags}
                addNote={addNote}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            } 
          />
          <Route 
            path="/notes/:noteId" 
            element={
              <NoteDetails 
                notes={notes}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <Tasks 
                tasks={tasks}
                tags={tags}
                addTask={addTask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            } 
          />
          <Route 
            path="/tasks/:taskId" 
            element={
              <TaskDetails 
                tasks={tasks}
                tags={tags}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            } 
          />
          <Route 
            path="/tags" 
            element={
              <Tags 
                tags={tags}
                notes={notes}
                tasks={tasks}
                addTag={addTag}
                deleteTag={deleteTag}
              />
            } 
          />
        </Routes>
        <Footer />
      </div>
      <RightSidebar 
        tasks={tasks} 
        notes={notes}
        updateTask={updateTask}
        updateNote={updateNote}
      />
      {showQuickNotes && (
        <QuickNotes
          onSave={(note) => {
            addNote(note);
            setShowQuickNotes(false);
          }}
          onClose={() => setShowQuickNotes(false)}
        />
      )}
    </div>
  );
}

export default Container;