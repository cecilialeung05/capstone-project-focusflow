import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081"; 
const API_ENDPOINT = `${API_BASE_URL}/notes`;

const noteService = {
  getAllNotes: async () => {
    try {
      const response = await axios.get(API_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  getNote: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      throw error;
    }
  },
  

  createNote: async (note) => {
    try {
      // Format the data, ensuring task_id is either a number or undefined (not null)
      const formattedNote = {
        title: String(note.title || '').trim(),
        content: String(note.content || '').trim(),
        // If task_id is null or falsy, omit it from the request
        ...(note.task_id ? { task_id: parseInt(note.task_id) } : {}),
        tags: Array.isArray(note.tags) ? note.tags : []
      };

      console.log('Sending to server:', formattedNote);

      const response = await axios.post(API_ENDPOINT, formattedNote);
      return response.data;
    } catch (error) {
      console.error('Server response:', {
        status: error.response?.status,
        data: error.response?.data,
        validationErrors: error.response?.data?.errors
      });
      throw error;
    }
  },

  updateNote: async (id, note) => {
    try {
      const response = await axios.put(`${API_ENDPOINT}/${id}`, {
        title: note.title,
        content: note.content,
        task_id: note.task_id || null,
        tags: note.tags || []
      });
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