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
import { socketService } from '../../services/socketService'; // Add this import
import { taskService } from '../../services/taskService';
import { noteService } from '../../services/noteService';
import { tagService } from '../../services/tagService';


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

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Modify the initial data loading
  useEffect(() => {
    const fetchData = async () => {
      if (!devMode) {  // Only fetch from backend if not in dev mode
        try {
          setIsLoading(true);
          // Fetch data from backend
          const [tasksData, notesData, tagsData] = await Promise.all([
            taskService.getAllTasks(),
            noteService.getAllNotes(),
            tagService.getAllTags()
          ]);
          
          setTasks(tasksData);
          setNotes(notesData);
          setTags(tagsData);
          
          // Connect to WebSocket after data is loaded
          socketService.connect();
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup WebSocket connection
    return () => {
      if (!devMode) {
        socketService.disconnect();
      }
    };
  }, [devMode]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [notes, tasks, tags]);

  useEffect(() => {
    if (!devMode) {  // Only connect if not in dev mode
      socketService.connect();

      socketService.subscribeToUpdates((type, data) => {
        switch(type) {
          case 'task':
            setTasks(prev => prev.map(task => 
              task.id === data.id ? { ...data, updated_at: new Date().toISOString() } : task
            ));
            break;
          case 'note':
            setNotes(prev => prev.map(note => 
              note.id === data.id ? { ...data, updated_at: new Date().toISOString() } : note
            ));
            break;
          case 'tag':
            setTags(prev => prev.map(tag => 
              tag.id === data.id ? data : tag
            ));
            break;
        }
      });

      return () => socketService.disconnect();
    }
  }, [devMode]);

  const addNote = (note) => {
    const newNote = {
      ...note,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      note_tags: note.note_tags || []
    };
    setNotes(prev => [...prev, newNote]);
    if (!devMode) socketService.emitNoteUpdate(newNote);
  };

  const updateNote = (updatedNote) => {
    const noteWithTimestamp = {
      ...updatedNote,
      updated_at: new Date().toISOString()
    };
    setNotes(prev => prev.map(note => 
      note.id === updatedNote.id ? noteWithTimestamp : note
    ));
    if (!devMode) socketService.emitNoteUpdate(noteWithTimestamp);
  }; 

  const deleteNote = (noteId) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (!devMode) socketService.emitNoteUpdate({ id: noteId, deleted: true });
  };

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
    if (!devMode) socketService.emitTaskUpdate(newTask);
  };

  const updateTask = (updatedTask) => {
    const taskWithTimestamp = {
      ...updatedTask,
      updated_at: new Date().toISOString()
    };
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? taskWithTimestamp : task
    ));
    if (!devMode) socketService.emitTaskUpdate(taskWithTimestamp);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (!devMode) socketService.emitTaskUpdate({ id: taskId, deleted: true });
  };

  const addTag = (tag) => {
    const newTag = { ...tag, id: Date.now() };
    setTags(prev => [...prev, newTag]);
    if (!devMode) socketService.emitTagUpdate(newTag);
  };

  const deleteTag = (tagId) => {
    setTags(prev => prev.filter(tag => tag.id !== tagId));
    if (!devMode) socketService.emitTagUpdate({ id: tagId, deleted: true });
  };

  const updateTag = (updatedTag) => {
    setTags(prev => prev.map(tag => 
      tag.id === updatedTag.id ? updatedTag : tag
    ));
    if (!devMode) socketService.emitTagUpdate(updatedTag);
  };

  return (
    <div className="layout">
      <Navbar />
      <div className="layout__main">
        <Header />
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
        </Routes>
        <Footer />
      </div>
      <RightSidebar 
        tasks={tasks} 
        notes={notes}
        updateTask={updateTask}
        updateNote={updateNote}
      />
    </div>
  );
}

export default Container;