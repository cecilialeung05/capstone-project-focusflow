import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";   
import Container from './components/Layout/Container';
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import TaskDetails from "./pages/TaskDetails";
import Notes from "./pages/Notes";
import NotesDetails from "./pages/NotesDetails";
import Tags from './pages/Tags';
import Settings from "./pages/Settings";
import Layout from './components/Layout/Container';
import taskService from './services/taskService';
import noteService from './services/noteService';
import tagService from './services/tagService';
import Insights from './pages/Insights';
import Weather from './pages/Weather';
import Footer from './components/Footer';
import Navbar from './components/Layout/Navbar';
import './App.scss';

function App() {
  const [theme, setTheme] = useState('light');
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try { 
        const [tasksData, notesData, tagsData] = await Promise.all([
          taskService.getAllTasks(),
          noteService.getAllNotes(),
          tagService.getAllTags()
        ]);
        console.log('Fetched Tasks:', tasksData);
        console.log('Fetched Notes:', notesData);
        console.log('Fetched Tags:', tagsData);
        setTasks(tasksData);
        setNotes(notesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const addTask = async (task) => {
    try {
      const newTask = await taskService.createTask(task);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };


  const updateTask = async (taskId, updatedTask) => {
    try {
      const updatedTaskResponse = await taskService.updateTask(taskId, updatedTask);
      setTasks(prevTasks => prevTasks.map(task => task.id === taskId ? updatedTaskResponse : task));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const addNote = async (note) => {
    try {
      console.log('Creating note with data:', note);
      const newNote = await noteService.createNote(note);
      console.log('Created note response:', newNote);
      setNotes(prevNotes => [...prevNotes, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (noteId, updatedNote) => {
    try {
      console.log('Updating note with data:', updatedNote);
      const updatedNoteResponse = await noteService.updateNote(noteId, updatedNote);
      console.log('Updated note response:', updatedNoteResponse);
      setNotes(prevNotes => prevNotes.map(note => 
        note.id === noteId ? updatedNoteResponse : note
      ));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await noteService.deleteNote(noteId);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }; 


  const addTag = async (tag) => {
    try {
      const newTag = await tagService.createTag(tag);
      setTags(prevTags => [...prevTags, newTag]);
    } catch (error) {
      console.error('Error adding tag:', error);
    }
  };

  const updateTag = async (tagId, updatedTag) => {
    try {
      const updatedTagResponse = await tagService.updateTag(tagId, updatedTag);
      setTags(prevTags => prevTags.map(tag => tag.id === tagId ? updatedTagResponse : tag));
    } catch (error) {
      console.error('Error updating tag:', error);
    }
  };

  const deleteTag = async (tagId) => {
    try {
      await tagService.deleteTag(tagId);
      setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
    } catch (error) {
      console.error('Error deleting tag:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className="app">
        <Navbar 
          theme={theme} 
          toggleTheme={toggleTheme}
          tasks={tasks}
          notes={notes}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <Dashboard tasks={tasks} notes={notes} tags={tags} />
              </>
            } />
            <Route path="/tasks" element={
              <Tasks 
                tasks={tasks} 
                tags={tags}
                addTask={addTask} 
                updateTask={updateTask} 
                deleteTask={deleteTask} 
              />
            } />
            <Route path="/tasks/:taskId" element={
              <TaskDetails 
                tasks={tasks}
                tags={tags}
                updateTask={updateTask} 
                deleteTask={deleteTask}
              />
            } />
            <Route path="/notes" element={
              <Notes 
                notes={notes}
                tasks={tasks}
                tags={tags}
                addNote={addNote} 
                updateNote={updateNote} 
                deleteNote={deleteNote}
              />
            } />
            <Route path="/notes/:noteId" element={
              <NotesDetails 
                notes={notes}
                tasks={tasks}
                tags={tags}
                updateNote={updateNote} 
                deleteNote={deleteNote}
              />
            } />
            <Route path="/tags" element={
              <Tags 
                tags={tags}
                notes={notes}
                tasks={tasks}
                addTag={addTag} 
                updateTag={updateTag} 
                deleteTag={deleteTag}
              />
            } />
            <Route path="/settings" element={<Settings />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/weather" element={<Weather />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
