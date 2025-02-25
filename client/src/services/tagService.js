import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 
const API_ENDPOINT = `${API_BASE_URL}/tags`;

const tagService = {
  getAllTags: async () => {
    try {
      const response = await axios.get(API_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  getTag: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tag ${id}:`, error);
      throw error;
    }
  },

  createTag: async (tag) => {
    try {
      const response = await axios.post(API_ENDPOINT, tag);
      return response.data;
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  updateTag: async (id, tag) => {
    try {
      const response = await axios.put(`${API_ENDPOINT}/${id}`, tag);
      return response.data;
    } catch (error) {
      console.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  },

  deleteTag: async (id) => {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting tag ${id}:`, error);
      throw error;
    }
  },

  // Get all items associated with a tag
  getTaggedItems: async (tagId) => {
    try {
      const [tasksResponse, notesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/tasks`, { params: { tagId } }),
        axios.get(`${API_BASE_URL}/notes`, { params: { tagId } })
      ]);
      
      return {
        tasks: tasksResponse.data,
        notes: notesResponse.data
      };
    } catch (error) {
      console.error(`Error fetching items for tag ${tagId}:`, error);
      throw error;
    }
  },
};

export default tagService;