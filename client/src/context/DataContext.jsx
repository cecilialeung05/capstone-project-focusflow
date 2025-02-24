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

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
} 