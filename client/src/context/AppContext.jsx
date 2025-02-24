import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);

  // CRUD operations
  const addTask = (task) => {
    // ... task adding logic
  };

  // ... other operations

  return (
    <AppContext.Provider value={{
      tasks,
      notes,
      tags,
      addTask,
      // ... other methods
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext); 