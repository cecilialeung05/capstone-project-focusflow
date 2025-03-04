import React, { createContext, useState, useEffect } from 'react';
import taskService from '../services/taskService';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskNotes, setSelectedTaskNotes] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getAllTasks();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const newTask = await taskService.createTask(task);
      if (newTask) {
        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask;
      }
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const updated = await taskService.updateTask(id, updatedTask);
      if (updated) {
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === id ? updated : task)
        );
        return updated;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      if (selectedTask?.id === id) {
        setSelectedTask(null);
        setSelectedTaskNotes([]);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getTaskWithNotes = async (taskId) => {
    try {
      const taskData = await taskService.getTaskWithNotes(taskId);
      if (taskData) {
        setSelectedTask(taskData);
        setSelectedTaskNotes(taskData.notes || []);
        return taskData;
      }
    } catch (error) {
      console.error('Error fetching task with notes:', error);
      throw error;
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask,
      selectedTask,
      setSelectedTask,
      selectedTaskNotes,
      getTaskWithNotes
    }}>
      {children}
    </TaskContext.Provider>
  );
};