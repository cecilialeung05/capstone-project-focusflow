import React, { useState, useMemo } from 'react';
import { DndContext } from '@dnd-kit/core';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import TaskForm from '../components/Tasks/TaskForm';
import TaskCard from '../components/Tasks/TaskCard';
import TagList from '../components/Tags/TagList';
import TaskFilters from '../components/Tasks/TaskFilters';

import './Tasks.scss';

function Tasks() {
  const { tasks, tags, notes, addTask, updateTask, deleteTask } = useData();
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created');
  const [searchTerm, setSearchTerm] = useState('');

  console.log("showForm:", showForm);
  console.log('Current tasks:', tasks);

  // Calculate tag usage counts
  const tagsWithCounts = useMemo(() => {
    return tags.map(tag => ({
      ...tag,
      taskCount: tasks.filter(task => task.tags?.includes(tag.id)).length
    }));
  }, [tags, tasks]);

  // Handle tag selection
  const handleTagSelect = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag.id)
        ? prev.filter(id => id !== tag.id)
        : [...prev, tag.id]
    );
  };

  const handleAddTask = async (taskData) => {
    try {
      console.log('Adding task with data:', taskData);
      await addTask(taskData);
      console.log('Task added successfully');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await updateTask(updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = useMemo(() => {
    console.log('Filtered tasks:', tasks);
    return tasks
      .filter(task => {
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tagId => task.tags?.includes(tagId));
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesStatus && matchesTags && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'due':
            return new Date(a.due_date || '9999') - new Date(b.due_date || '9999');
          case 'status':
            return a.status.localeCompare(b.status);
          default: 
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
  }, [tasks, statusFilter, selectedTags, sortBy, searchTerm]);

  const statusCounts = useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {});
  }, [tasks]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const tagId = active.id;
      const taskId = over.id;
      
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updatedTags = task.tags.includes(tagId)
          ? task.tags.filter(id => id !== tagId)
          : [...task.tags, tagId];
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="tasks">
        <div className="tasks__header">
          <h1>Tasks</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="tasks__button tasks__button--primary"
          >
            <FaPlus /> <span>+ Task</span>
          </button>
        </div>

        <TaskFilters 
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        {showForm && (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
            tags={tags}
          />
        )}

        <div className="tasks__content">
          <div className="tasks__main">
            {filteredTasks.length === 0 ? (
              <div className="tasks__empty">
                <p>No tasks found</p>
              </div>
            ) : (
              <div className="task-list">
                {filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    tags={tags}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    variant="list"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default Tasks;