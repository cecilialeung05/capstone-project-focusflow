import React, { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "../components/Task/TaskItem";
import { Timer, NotePencil, Trash } from "@phosphor-icons/react";
import { FiSmile, FiCoffee, FiClock, FiPlus } from "react-icons/fi";
import "./Tasks.scss";
import TaskForm from '../components/Task/TaskForm';

const DURATION_FILTERS = [
  { value: '25min', label: '25 Minutes' },
  { value: '50min', label: '50 Minutes' },
];

const TIME_OF_DAY_FILTERS = [
  { value: 'Morning Session', label: 'Morning Session' },
  { value: 'Afternoon Session', label: 'Afternoon Session' },
];

const WORK_TYPE_FILTERS = [
  { value: 'Deep Focus', label: 'Deep Focus' },
  { value: 'Light Work', label: 'Light Work' },
];

const ENERGY_LEVEL_FILTERS = [
  { value: 'Feeling Good', label: 'Feeling Good' },
  { value: 'Feeling Tired', label: 'Feeling Tired' },
];


function Tasks() {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    selectedTask,
    setSelectedTask,
    selectedTaskNotes,
    getTaskWithNotes,
    createNote
  } = useContext(TaskContext);
  const navigate = useNavigate();
  const location = useLocation();
  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [filterTag, setFilterTag] = useState(null);
  const [filterDuration, setFilterDuration] = useState('');
  const [filterTimeOfDay, setFilterTimeOfDay] = useState('');
  const [filterWorkType, setFilterWorkType] = useState('');
  const [filterEnergyLevel, setFilterEnergyLevel] = useState('');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (location.state?.selectedTaskId) {
      const task = tasks.find(t => t.id === location.state.selectedTaskId);
      if (task) {
        setSelectedTask(task);
        setShowPrompt(true);
      }
    }
  }, [location.state]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const getTabFilteredTasks = (tasks) => {
    switch (activeTab) {
      case "Today":
        return tasks.filter(task => {
          if (!task.due_date) return false;
          const taskDate = new Date(task.due_date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === today.getTime();
        });
      case "Yesterday":
        return tasks.filter(task => {
          if (!task.due_date) return false;
          const taskDate = new Date(task.due_date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === yesterday.getTime();
        });
      case "Tomorrow":
        return tasks.filter(task => {
          if (!task.due_date) return false;
          const taskDate = new Date(task.due_date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate.getTime() === tomorrow.getTime();
        });
      case "Archive":
        return tasks.filter(task => 
          task.status?.toLowerCase() === "completed" || 
          task.status?.toLowerCase() === "done"
        );
      case "All":
      default:
        return tasks;
    }
  };

  const filteredTasks = useMemo(() => {
    const baseFiltered = tasks
      .filter((task) => {
        const matchesStatus = filterStatus === "all" || task.status === filterStatus;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !filterTag || task.tags?.some(tag => tag.name === filterTag);
        
        const matchesDuration = !filterDuration || task.tags?.some(tag => tag.name === filterDuration);
        const matchesTimeOfDay = !filterTimeOfDay || task.tags?.some(tag => tag.name === filterTimeOfDay);
        const matchesWorkType = !filterWorkType || task.tags?.some(tag => tag.name === filterWorkType);
        const matchesEnergyLevel = !filterEnergyLevel || task.tags?.some(tag => tag.name === filterEnergyLevel);

        return matchesStatus && matchesSearch && matchesTag &&
               matchesDuration && matchesTimeOfDay && matchesWorkType && matchesEnergyLevel;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "due":
            return new Date(a.due_date || "9999") - new Date(b.due_date || "9999");
          case "status":
            return a.status.localeCompare(b.status);
          default:
            return new Date(b.created_at) - new Date(a.created_at);
        }
      });
      
    return getTabFilteredTasks(baseFiltered);
  }, [tasks, searchTerm, filterStatus, sortBy, filterTag, 
      filterDuration, filterTimeOfDay, filterWorkType, filterEnergyLevel, activeTab]);

  const taskStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status?.toLowerCase() === "completed").length,
    inProgress: tasks.filter((task) => task.status?.toLowerCase() === "in progress").length,
    open: tasks.filter((task) => task.status?.toLowerCase() === "open").length,
  }), [tasks]);

  const handleAddTask = async (taskData) => {
    try {
      console.log('Attempting to create task:', taskData);
      const newTask = await addTask(taskData);
      console.log('Task created successfully:', newTask);
      setShowNewTaskForm(false);
    } catch (error) {
      console.error('Error creating new task:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  const handleStartTimer = () => {
    if (!selectedTask) return;
    navigate(`/notes`, { 
      state: { 
        createNote: true,
        taskId: selectedTask.id,
        taskTitle: selectedTask.title
      } 
    });
  };

  const handleEndSession = async () => {
    if (!selectedTask) return;

    const feelingTired = window.confirm("Did you feel tired during this session?");
    const sessionTags = feelingTired
      ? ["Afternoon Session", "Deep Focus", "Feeling Tired"]
      : ["Morning Session", "Deep Focus", "Feeling Good"];

    await updateTask(selectedTask.id, { ...selectedTask, tags: [...selectedTask.tags, ...sessionTags] });

    setLastAction(feelingTired ? "suggest_break" : "suggest_next");
    setShowPrompt(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await deleteTask(taskId);
        console.log('Task deleted successfully');
        
        if (selectedTask?.id === taskId) {
          setSelectedTask(null);
          setShowPrompt(false);
        }
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleTaskSelect = async (task) => {
    setSelectedTask(task);
    await getTaskWithNotes(task.id);
    setShowPrompt(true);
  };

  const handleTagClick = (tagName) => {
    setFilterTag(tagName === filterTag ? null : tagName);
  };

  const clearFilters = () => {
    setFilterDuration('');
    setFilterTimeOfDay('');
    setFilterWorkType('');
    setFilterEnergyLevel('');
    setFilterTag(null);
    setFilterStatus('all');
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const result = await updateTask(taskId, updatedData);
      console.log('Task updated successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const handleQuickNote = async (taskId) => {
    const quickNote = {
      title: `Quick Note for ${selectedTask.title}`,
      content: '',
      task_id: taskId,
      tags: []
    };
    await createNote(quickNote);
  };

  const renderTaskInput = () => {
    if (showNewTaskForm) {
      return (
        <TaskForm
          addTask={handleAddTask}
          onCancel={() => setShowNewTaskForm(false)}
        />
      );
    }

    return (
      <div className="task-input-container">
        <button 
          onClick={() => setShowNewTaskForm(true)} 
          className="add-task-button"
        >
          <FiPlus /> Add New Task
        </button>
      </div>
    );
  };

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <div className="task-tabs">
          {["All", "Archive", "Yesterday", "Today", "Tomorrow"].map(tab => (
            <div 
              key={tab} 
              className={`task-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              <span>{tab}</span>
            </div>
          ))}
        </div>

        <div className="tasks-content">
          {renderTaskInput()}

          <div className="task-filters">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <div className="filter-group">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>

              <select value={filterDuration} onChange={(e) => setFilterDuration(e.target.value)}>
                <option value="">Duration</option>
                {DURATION_FILTERS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>

              <select value={filterTimeOfDay} onChange={(e) => setFilterTimeOfDay(e.target.value)}>
                <option value="">Time of Day</option>
                {TIME_OF_DAY_FILTERS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>

              <select value={filterWorkType} onChange={(e) => setFilterWorkType(e.target.value)}>
                <option value="">Work Type</option>
                {WORK_TYPE_FILTERS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>

              <select value={filterEnergyLevel} onChange={(e) => setFilterEnergyLevel(e.target.value)}>
                <option value="">Energy Level</option>
                {ENERGY_LEVEL_FILTERS.map(filter => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>

              <button 
                className="clear-filters-button" 
                onClick={clearFilters}
                disabled={!filterDuration && !filterTimeOfDay && !filterWorkType && 
                        !filterEnergyLevel && !filterTag && filterStatus === 'all'}
              >
                Clear Filters
              </button>
            </div>

            <div className="active-filters">
              {[
                { value: filterDuration, label: 'Duration' },
                { value: filterTimeOfDay, label: 'Time of Day' },
                { value: filterWorkType, label: 'Work Type' },
                { value: filterEnergyLevel, label: 'Energy Level' },
                { value: filterTag, label: 'Tag' }
              ].map(filter => filter.value && (
                <span key={filter.label} className="active-filter-tag">
                  {filter.label}: {filter.value}
                  <button onClick={() => {
                    switch(filter.label) {
                      case 'Duration': setFilterDuration(''); break;
                      case 'Time of Day': setFilterTimeOfDay(''); break;
                      case 'Work Type': setFilterWorkType(''); break;
                      case 'Energy Level': setFilterEnergyLevel(''); break;
                      case 'Tag': setFilterTag(null); break;
                    }
                  }}>×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="tasks-list">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task}
                  updateTask={handleUpdateTask}
                  deleteTask={handleDeleteTask}
                  onStatusChange={(status) => handleUpdateTask(task.id, { ...task, status })}
                  onCheck={() => handleTaskSelect(task)}
                  isSelected={selectedTask?.id === task.id}
                  onTagClick={handleTagClick}
                  onQuickNote={() => handleQuickNote(task.id)}
                />
              ))
            ) : (
              <p className="no-tasks-message">No tasks found.</p>
            )}
          </div>
        </div>
      </div>

      {showPrompt && selectedTask && (
        <div className="popup-overlay">
          <div className="focus-popup">
            <h3>Focus Session</h3>
            <p>Ready to focus on: {selectedTask.title}</p>
            
            {selectedTaskNotes && selectedTaskNotes.length > 0 && (
              <div className="task-notes">
                <h4>Task Notes:</h4>
                {selectedTaskNotes.map(note => (
                  <div key={note.id} className="note-item">
                    <p>{note.content}</p>
                    <div className="note-tags">
                      {note.tags.map(tag => (
                        <span key={tag.id} className="tag-badge">{tag.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="focus-buttons">
              <button onClick={handleStartTimer}>Start Timer</button>
              <button onClick={() => setShowPrompt(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
