import React, { useState, useMemo } from 'react';
import { DndContext } from '@dnd-kit/core';
import { FaPlus } from 'react-icons/fa';
import TaskForm from '../components/Tasks/TaskForm';
import TaskList from '../components/TaskList';
import TagSuggestions from '../components/Tags/TagSuggestions';
import DraggableTagList from '../components/Tags/DraggableTagList';
import './Tasks.scss';

function Tasks({ tasks, tags, addTask, updateTask, deleteTask }) {
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created');
  const [searchTerm, setSearchTerm] = useState('');

  console.log("showForm:", showForm);

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

  const handleAddTask = (taskData) => {
    addTask(taskData);
    setShowForm(false);
  };

  const filteredTasks = useMemo(() => {
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
        
        updateTask(taskId, { ...task, tags: updatedTags });
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

        <div className="tasks__filters">
          <div className="tasks__filters-row">
            <div className="tasks__filters-search">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="tasks__filters-search-input"
              />
            </div>

            <select 
              className="tasks__filters-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created">Sort by Created Date</option>
              <option value="due">Sort by Due Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>

          <div className="tasks__status-filters">
            <button
              className={`tasks__status-button ${statusFilter === 'all' ? 'tasks__status-button--selected all' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button
              className={`tasks__status-button ${statusFilter === 'open' ? 'tasks__status-button--selected open' : ''}`}
              onClick={() => setStatusFilter('open')}
            >
              Open ({tasks.filter(t => t.status === 'open').length})
            </button>
            <button
              className={`tasks__status-button ${statusFilter === 'in-progress' ? 'tasks__status-button--selected in-progress' : ''}`}
              onClick={() => setStatusFilter('in-progress')}
            >
              In Progress ({tasks.filter(t => t.status === 'in-progress').length})
            </button>
            <button
              className={`tasks__status-button ${statusFilter === 'completed' ? 'tasks__status-button--selected completed' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed ({tasks.filter(t => t.status === 'completed').length})
            </button>
            <button
              className={`tasks__status-button ${statusFilter === 'blocked' ? 'tasks__status-button--selected blocked' : ''}`}
              onClick={() => setStatusFilter('blocked')}
            >
              Blocked ({tasks.filter(t => t.status === 'blocked').length})
            </button>
          </div>
        </div>

        {showForm && (
          <TaskForm
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
            tags={tags}
          />
        )}

        <div className="tasks__content">
          <div className="tasks__main">
            <TaskList
              tasks={filteredTasks}
              onTaskUpdate={updateTask}
              onTaskDelete={deleteTask}
              tags={tags}
            />
          </div>

          <div className="tasks__sidebar">
            <DraggableTagList
              tags={tagsWithCounts}
              onTagDrop={handleTagDrop}
            />
          </div>
        </div>
      </div>
    </DndContext>
  );
}

export default Tasks;