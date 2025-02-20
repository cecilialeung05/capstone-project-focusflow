import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";   
import { ThemeProvider } from './context/ThemeContext';
import { useAppData } from './hooks/useAppData';
import Container from './components/Layout/Container';
import './App.scss';

function App() {
  const {
    tasks,
    notes,
    tags,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    addNote,
    updateNote,
    deleteNote,
    addTag,
    updateTag,
    deleteTag
  } = useAppData();

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Container
            tasks={tasks}
            notes={notes}
            tags={tags}
            addTask={addTask}
            updateTask={updateTask}
            deleteTask={deleteTask}
            addNote={addNote}
            updateNote={updateNote}
            deleteNote={deleteNote}
            addTag={addTag}
            updateTag={updateTag}
            deleteTag={deleteTag}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
