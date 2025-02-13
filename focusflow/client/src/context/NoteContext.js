import React, { createContext, useState, useEffect } from 'react';
import noteService from '../services/noteService';

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await noteService.getAllNotes();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };

    fetchNotes();
  }, []);

  const addNote = async (note) => {
    try {
      const newNote = await noteService.createNote(note);
      setNotes([...notes, newNote]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async (id, updatedNote) => {
    try {
      const updated = await noteService.updateNote(id, updatedNote);
      setNotes(notes.map(note => (note.id === id ? updated : note)));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NoteContext.Provider>
  );
};