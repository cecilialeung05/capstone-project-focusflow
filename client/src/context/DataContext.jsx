import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tasks and notes in parallel
        const [tasksResponse, notesResponse] = await Promise.all([
          axiosInstance.get('/api/tasks'),
          axiosInstance.get('/api/notes')
        ]);

        setTasks(tasksResponse.data);
        setNotes(notesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Only fetch on mount

  const addTask = async (task) => {
    try {
      const response = await axiosInstance.post('/api/tasks', task);
      setTasks(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const addNote = async (note) => {
    try {
      const response = await axiosInstance.post('/api/notes', note);
      setNotes(prev => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  return (
    <DataContext.Provider
      value={{
        tasks,
        notes,
        loading,
        error,
        addTask,
        addNote,
        setTasks,
        setNotes
      }}
    >
      {children}
    </DataContext.Provider>
  );
}; 