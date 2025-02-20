import { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import noteService from '../services/noteService';
import tagService from '../services/tagService';

export function useAppData() {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [tasksData, notesData, tagsData] = await Promise.all([
          taskService.getAllTasks(),
          noteService.getAllNotes(),
          tagService.getAllTags()
        ]);
        setTasks(tasksData);
        setNotes(notesData);
        setTags(tagsData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Task operations
  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      const updatedTask = await taskService.updateTask(taskId, taskData);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  // Note operations
  const addNote = async (noteData) => {
    try {
      const newNote = await noteService.createNote(noteData);
      setNotes(prev => [...prev, newNote]);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const updateNote = async (noteId, noteData) => {
    try {
      const updatedNote = await noteService.updateNote(noteId, noteData);
      setNotes(prev => prev.map(note => 
        note.id === noteId ? updatedNote : note
      ));
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await noteService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  // Tag operations
  const addTag = async (tagData) => {
    try {
      const newTag = await tagService.createTag(tagData);
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (error) {
      console.error('Error adding tag:', error);
      throw error;
    }
  };

  const updateTag = async (tagId, tagData) => {
    try {
      const updatedTag = await tagService.updateTag(tagId, tagData);
      setTags(prev => prev.map(tag => 
        tag.id === tagId ? updatedTag : tag
      ));
      return updatedTag;
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  };

  const deleteTag = async (tagId) => {
    try {
      await tagService.deleteTag(tagId);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  };

  return {
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
  };
} 