import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);

  const value = {
    notes,
    setNotes,
    tasks,
    setTasks,
    tags,
    setTags
  };

  const addTask = async (taskData) => {
    try {
      console.log('Before adding - tasks:', tasks);
      // Your existing addTask logic
      setTasks(prev => [...prev, taskData]);
      console.log('After adding - tasks:', tasks);
      return taskData;
    } catch (error) {
      console.error('Error in addTask:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
} 