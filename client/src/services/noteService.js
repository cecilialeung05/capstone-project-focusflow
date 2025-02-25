import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 
const API_ENDPOINT = `${API_BASE_URL}/notes`;

const noteService = {
  getAllNotes: async () => {
    try {
      const response = await axios.get(API_ENDPOINT);
<<<<<<< HEAD
=======
      console.log('Note service response:', response.data); // Debug log
>>>>>>> 2d968fb (commit finalized copy)
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  getNote: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
<<<<<<< HEAD
=======
      console.log('Single note response:', response.data); // Debug log
>>>>>>> 2d968fb (commit finalized copy)
      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      throw error;
    }
  },

  createNote: async (note) => {
    try {
<<<<<<< HEAD
=======
      console.log('Creating note with data:', note); // Debug log
>>>>>>> 2d968fb (commit finalized copy)
      const response = await axios.post(API_ENDPOINT, note);
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  updateNote: async (id, note) => {
    try {
<<<<<<< HEAD
=======
      console.log('Updating note with data:', note); // Debug log
>>>>>>> 2d968fb (commit finalized copy)
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