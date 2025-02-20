import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RightSidebar from "./RightSidebar"; 
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';

// Pages
import Dashboard from "../../pages/Dashboard";
import Tasks from "../../pages/Tasks";
import TaskDetails from "../../pages/TaskDetails";
import Notes from "../../pages/Notes";
import NoteDetails from "../../pages/NoteDetails";
import Tags from '../../pages/Tags';
import Settings from "../../pages/Settings";
import Insights from '../../pages/Insights';
import Weather from '../../pages/Weather';

import './Container.scss';

function Container({ 
  tasks, 
  notes, 
  tags,
  addTask,
  updateTask,
  deleteTask,
  addNote,
  updateNote,
  deleteNote,
  addTag,
  updateTag,
  deleteTag 
}) {
  // Get pinned items
  const pinnedItems = [
    ...tasks.filter(task => task.isPinned),
    ...notes.filter(note => note.isPinned)
  ];

  return (
    <div className="layout">
      <Navbar tasks={tasks} notes={notes} />
      <div className="layout__main">
        <Header />
        <main className="layout__content">
          <Routes>
            <Route path="/" element={<Dashboard tasks={tasks} notes={notes} tags={tags} />} />
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
              <NoteDetails 
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
        <RightSidebar 
          pinnedItems={pinnedItems}
          updateTask={updateTask}
          updateNote={updateNote}
        />
        <Footer />
      </div>
    </div>
  );
}

export default Container;