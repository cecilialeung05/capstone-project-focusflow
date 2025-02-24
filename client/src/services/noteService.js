import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 
const API_ENDPOINT = `${API_BASE_URL}/notes`;

const noteService = {
  getAllNotes: async (tagId = null) => {
    try {
      const url = tagId 
        ? `${API_ENDPOINT}?tagId=${tagId}`
        : API_ENDPOINT;
      const response = await axios.get(url);
      // Response should include note_tags array for each note
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  getNote: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      console.log('Single note response:', response.data); 
      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      throw error;
    }
  },

  createNote: async (note) => {
    try {
      console.log('Creating note with data:', note); 
      const response = await axios.post(API_ENDPOINT, note);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  updateNote: async (id, note) => {
    try {
      console.log('Updating note with data:', note); 
      const response = await axios.put(`${API_ENDPOINT}/${id}`, note);
      return response.data;
    } catch (error) {
      console.error(`Error updating note ${id}:`, error);
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      throw error;
    }
  },
};

export default noteService;