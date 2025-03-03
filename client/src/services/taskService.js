import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"; 
const API_ENDPOINT = `${API_BASE_URL}/tasks`;

const taskService = {
  getAllTasks: async (tagId = null) => {
    try {
      const params = tagId ? { tagId } : {};
      const response = await axios.get(API_ENDPOINT, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  getTask: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  getTaskWithNotes: async (id) => {
    try {
      const response = await axios.get(`${API_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id} with notes:`, error);
      throw error;
    }
  },

  createTask: async (task) => {
    try {
      const taskData = {
        title: task.title || "New Task",
        description: task.description || "",
        status: (task.status || "open").toLowerCase(),
        priority: "MEDIUM",
        due_date: task.due_date || null,
        tags: task.tags || [],
        completed: false
      };

      console.log('Creating task with payload:', JSON.stringify(taskData, null, 2));
      
      const response = await axios.post(API_ENDPOINT, taskData);
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  updateTask: async (id, updatedTask) => {
    try {
      // Debug incoming date
      console.log('Received due_date:', updatedTask.due_date);

      const updateData = {
        title: updatedTask.title,
        description: updatedTask.description || "",
        status: (updatedTask.status || "open").toLowerCase(),
        // Only send null if the date is explicitly empty
        due_date: updatedTask.due_date === '' ? null : updatedTask.due_date,
        tags: updatedTask.tags || []
      };

      console.log('Sending update data:', JSON.stringify(updateData, null, 2));
      
      const response = await axios.put(`${API_ENDPOINT}/${id}`, updateData);
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: updatedTask // Log the original data
      });
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      await axios.delete(`${API_ENDPOINT}/${id}`);
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },
};

export default taskService;