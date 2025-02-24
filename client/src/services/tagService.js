import axios from 'axios';
import taskService from './taskService';
import noteService from './noteService';
import { sampleTags, sampleNotes, sampleTasks } from '../components/Layout/sampleData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 
const API_ENDPOINT = `${API_BASE_URL}/tags`;

const tagService = {
  getAllTags: async () => {
    try {
      const response = await axios.get(API_ENDPOINT);
      return response.data;  // Now includes tags, notes, and tasks with relationships
    } catch (error) {
      console.error('Error fetching tags:', error);
      // If API fails in dev mode, return sample data
      if (localStorage.getItem('devMode') === 'true') {
        console.log('Falling back to sample data');
        return {
          tags: sampleTags,
          notes: sampleNotes,
          tasks: sampleTasks
        };
      }
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

  getTaggedItems: async (tagId) => {
    try {
      // Use existing services that already handle tag filtering
      const [tasks, notes] = await Promise.all([
        taskService.getAllTasks(tagId),
        noteService.getAllNotes(tagId)
      ]);
      
      return {
        tasks,
        notes
      };
    } catch (error) {
      console.error(`Error fetching items for tag ${tagId}:`, error);
      return { tasks: [], notes: [] };
    }
  },

  getTagsWithRelationships: async () => {
    const response = await fetch('/api/tags/relationships');
    const data = await response.json();
    return data;
  }
};

export default tagService;