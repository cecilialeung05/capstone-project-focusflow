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

  const createNote = async (note) => {
    try {
      const newNote = await noteService.createNote({
        ...note,
        task_id: note.task_id || null,
        tags: note.tags || []
      });
      setNotes(prevNotes => [...prevNotes, newNote]);
      return newNote;
    } catch (error) {
      console.error('Error creating note:', error);
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