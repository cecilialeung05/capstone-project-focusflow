import React, { createContext, useState, useEffect } from 'react';
import noteService from '../services/noteService';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setLoading(true);
        const data = await noteService.getAllNotes();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setError('Failed to fetch notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const createNote = async (noteData) => {
    try {
      // Ensure data meets validation requirements
      const formattedNote = {
        title: noteData.title,
        content: noteData.content,
        task_id: noteData.task_id || null,
        tags: Array.isArray(noteData.tags) ? noteData.tags : []
      };

      console.log('Sending note data:', formattedNote);
      
      const response = await noteService.createNote(formattedNote);
      setNotes(prevNotes => [...prevNotes, response]);
      return response;
    } catch (error) {
      console.error('Error creating note:', error);
      console.log('Server response:', {
        status: error.response?.status,
        data: error.response?.data,
        validationErrors: error.response?.data?.errors
      });
      throw error;
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const updated = await noteService.updateNote(id, {
        ...updatedNote,
        task_id: updatedNote.task_id || null,
        tags: updatedNote.tags || []
      });
      setNotes(prevNotes => 
        prevNotes.map(note => (note.id === id ? updated : note))
      );
      return updated;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  return (
    <NoteContext.Provider 
      value={{ 
        notes, 
        createNote, 
        updateNote, 
        deleteNote,
        loading,
        error
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NoteProvider;