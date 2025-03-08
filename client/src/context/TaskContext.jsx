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
      // Format recurring data before sending
      const formattedTask = {
        ...task,
        recurring_type: task.recurring_type || 'none',
        recurring_interval: task.recurring_type === 'custom' ? parseInt(task.recurring_interval) : null,
        recurring_unit: task.recurring_type === 'custom' ? task.recurring_unit : null
      };

      const newTask = await taskService.createTask(formattedTask);
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
      // Format recurring data before sending
      const formattedTask = {
        ...updatedTask,
        recurring_type: updatedTask.recurring_type || 'none',
        recurring_interval: updatedTask.recurring_type === 'custom' ? 
          parseInt(updatedTask.recurring_interval) : null,
        recurring_unit: updatedTask.recurring_type === 'custom' ? 
          updatedTask.recurring_unit : null
      };

      const updated = await taskService.updateTask(id, formattedTask);
      if (updated) {
        setTasks(prevTasks => 
          prevTasks.map(task => task.id === id ? {
            ...updated,
            recurring_type: updated.recurring_type || 'none',
            recurring_interval: updated.recurring_interval,
            recurring_unit: updated.recurring_unit
          } : task)
        );

        // Update selected task if it's the one being edited
        if (selectedTask?.id === id) {
          setSelectedTask({
            ...updated,
            recurring_type: updated.recurring_type || 'none',
            recurring_interval: updated.recurring_interval,
            recurring_unit: updated.recurring_unit
          });
        }

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
        // Ensure recurring data is properly formatted
        const formattedTask = {
          ...taskData,
          recurring_type: taskData.recurring_type || 'none',
          recurring_interval: taskData.recurring_interval,
          recurring_unit: taskData.recurring_unit
        };
        setSelectedTask(formattedTask);
        setSelectedTaskNotes(formattedTask.notes || []);
        return formattedTask;
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