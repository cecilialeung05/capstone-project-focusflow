import React, { useState, useMemo } from 'react';
import TaskItem from '../components/Task/TaskItem';
import './Tasks.scss';
import { useNavigate } from 'react-router-dom';
import { Timer, NotePencil } from '@phosphor-icons/react';
import { FiSmile, FiCoffee, FiClock, FiPlus } from 'react-icons/fi';

function Tasks({ tasks, tags, addTask, updateTask, deleteTask, onTimerStart }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('created'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tagId => task.tags?.some(tag => tag.id === tagId));
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

  const handleTagToggle = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(task => task.status?.toLowerCase() === 'completed').length,
      inProgress: tasks.filter(task => task.status?.toLowerCase() === 'in progress').length,
      open: tasks.filter(task => task.status?.toLowerCase() === 'open').length,
    };
  }, [tasks]);

  const handleTaskAdd = async (task) => {
    await addTask(task);
    setLastAction('added');
    setShowPrompt(true);
  };

  const handleStatusChange = async (taskId, task, newStatus) => {
    // Normalize the status to match database format
    const normalizedStatus = newStatus.toLowerCase() === 'in progress' ? 'In Progress' :
                            newStatus.toLowerCase() === 'completed' ? 'Completed' :
                            'Open';
    
    await updateTask(taskId, { ...task, status: normalizedStatus });
    
    // Check status with case-insensitive comparison
    if (normalizedStatus.toLowerCase() === 'in progress') {
      setLastAction('added');
      setShowPrompt(true);
    } else if (normalizedStatus.toLowerCase() === 'completed') {
      setLastAction('need_feedback');
      setShowPrompt(true);
    }
  };

  const handleTaskUpdate = async (taskId, updatedTask) => {
    try {
      console.log('Tasks.jsx - Updating task:', taskId, updatedTask);
      await updateTask(taskId, updatedTask);
      console.log('Tasks.jsx - Update successful');
    } catch (error) {
      console.error('Tasks.jsx - Error updating task:', error);
      throw error; // Propagate error back to TaskItem
    }
  };

  const handleAddNewTask = async () => {
    try {
      const newTask = {
        title: "New Task",
        status: "Open",
        description: "",
        due_date: null
      };
      const addedTask = await addTask(newTask);
      // The task list should automatically update if your state management is set up correctly
    } catch (error) {
      console.error('Failed to add new task:', error);
    }
  };

  const handleTaskCheck = async (taskId, task) => {
    // If the task is already selected, unselect it
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
      setShowPrompt(false);
      // Optionally reset the task status if needed
      await handleStatusChange(taskId, task, 'Open');
    } else {
      // Select the new task
      setSelectedTaskId(taskId);
      setLastAction('added');
      setShowPrompt(true);
      await handleStatusChange(taskId, task, 'In Progress');
    }
  };

  const handleEndSession = () => {
    setLastAction('need_feedback');
    setShowPrompt(true);
  };

  return (
    <div className="tasks-page">
      <div className="filters-column">
        <div className="stats-numbers">
          <div className="stat-item">
            <span className="label">Total:</span>
            <span className="value">{taskStats.total}</span>
          </div>
          <div className="stat-item status-completed">
            <span className="label">Completed:</span>
            <span className="value">{taskStats.completed}</span>
          </div>
          <div className="stat-item status-in-progress">
            <span className="label">In Progress:</span>
            <span className="value">{taskStats.inProgress}</span>
          </div>
        </div>

        <div className="filters-section">
          <h3>Filters</h3>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="created">Created Date</option>
              <option value="due">Due Date</option>
              <option value="status">Status</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Tags</label>
            <div className="tags-filter">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  className={`tag-filter-btn ${selectedTags.includes(tag.id) ? 'selected' : ''}`}
                  onClick={() => handleTagToggle(tag.id)}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="tasks-column">
        <div className="header-title-row">
          <div className="header-left">
            <h1 className="welcome-text">
              <span className="welcome-emoji"></span> Ready to get started?
            </h1>
          </div>
          <div className="header-actions">
            {selectedTaskId && (
              <button 
                onClick={handleEndSession}
                className="header-button end-session-button"
              >
                <FiClock size={18} />
                End Session
              </button>
            )}
            <button 
              onClick={handleAddNewTask}
              className="header-button add-task-button"
            >
              <FiPlus size={18} />
              Add Task
            </button>
          </div>
        </div>

        <div className="tasks-list">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                updateTask={handleTaskUpdate}
                deleteTask={deleteTask}
                onStatusChange={handleStatusChange}
                onCheck={handleTaskCheck}
                isSelected={selectedTaskId === task.id}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No tasks found matching your filters</p>
            </div>
          )}
        </div>
      </div>

      {showPrompt && (
        <div className="task-action-prompt">
          {lastAction === 'need_feedback' && (
            <div className="prompt-content">
              <h3>How are you feeling after this session?</h3>
              <div className="prompt-actions">
                <button 
                  className="prompt-action-button"
                  onClick={() => {
                    setShowPrompt(false);
                    setLastAction('completed');
                    setTimeout(() => {
                      setShowPrompt(true);
                      setLastAction('suggest_next');
                    }, 500);
                  }}
                >
                  <FiSmile size={24} />
                  <span>Feeling Good!</span>
                </button>
                <button 
                  className="prompt-action-skip"
                  onClick={() => {
                    setShowPrompt(false);
                    setTimeout(() => {
                      setShowPrompt(true);
                      setLastAction('suggest_break');
                    }, 500);
                  }}
                >
                  <FiCoffee size={24} />
                  <span>Need a Break</span>
                </button>
              </div>
            </div>
          )}

          {lastAction === 'suggest_next' && (
            <div className="prompt-content">
              <h3>Great energy! Want to tackle another deep focus task?</h3>
              <div className="prompt-actions">
                <button 
                  className="prompt-action-button"
                  onClick={() => {
                    setShowPrompt(false);
                  }}
                >
                  Start New Task
                </button>
                <button 
                  className="prompt-action-skip"
                  onClick={() => setShowPrompt(false)}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          )}

          {lastAction === 'suggest_break' && (
            <div className="prompt-content">
              <h3>Take a short break and try a lighter task next! 🌿</h3>
              <div className="prompt-actions">
                <button 
                  className="prompt-action-button"
                  onClick={() => setShowPrompt(false)}
                >
                  Got it!
                </button>
              </div>
            </div>
          )}

          {lastAction === 'added' && (
            <div className="prompt-content">
              <h3>Great! Ready to focus on this task?</h3>
              <div className="prompt-actions">
                <button 
                  className="prompt-action-button"
                  onClick={() => {
                    setShowPrompt(false);
                    onTimerStart();
                    // Simply navigate to notes page
                    navigate('/notes');
                  }}
                >
                  <Timer size={24} weight="duotone" />
                  Start Timer & Take Notes
                </button>
                <button 
                  className="prompt-action-skip"
                  onClick={() => setShowPrompt(false)}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          )}
          
          {lastAction === 'completed' && (
            <div className="prompt-content">
              <h3>Task completed! Want to capture any thoughts?</h3>
              <div className="prompt-actions">
                <button 
                  className="prompt-action-button"
                  onClick={() => {
                    setShowPrompt(false);
                    navigate('/notes/new');
                  }}
                >
                  <NotePencil size={24} weight="duotone" />
                  Add Notes
                </button>
                <button 
                  className="prompt-action-skip"
                  onClick={() => setShowPrompt(false)}
                >
                  Not Now
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Tasks;