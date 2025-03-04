import React, { useState, useContext, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "../components/Task/TaskItem";
import { Timer, NotePencil, Trash } from "@phosphor-icons/react";
import { FiSmile, FiCoffee, FiClock, FiPlus } from "react-icons/fi";
import "./Tasks.scss";

// Update filter constants to use names
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
    getTaskWithNotes 
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

  useEffect(() => {
    if (location.state?.selectedTaskId) {
      const task = tasks.find(t => t.id === location.state.selectedTaskId);
      if (task) {
        setSelectedTask(task);
        setShowPrompt(true);
      }
    }
  }, [location.state]);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesStatus = filterStatus === "all" || task.status === filterStatus;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = !filterTag || task.tags?.some(tag => tag.name === filterTag);
        
        // Update filter conditions to use tag names
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
  }, [tasks, searchTerm, filterStatus, sortBy, filterTag, 
      filterDuration, filterTimeOfDay, filterWorkType, filterEnergyLevel]);

  // 📊 **Task Statistics**
  const taskStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status?.toLowerCase() === "completed").length,
    inProgress: tasks.filter((task) => task.status?.toLowerCase() === "in progress").length,
    open: tasks.filter((task) => task.status?.toLowerCase() === "open").length,
  }), [tasks]);

  // ➕ **Create a New Task**
  const handleAddTask = async () => {
    try {
      const initialTaskData = {
        title: "New Task",
        description: "",
        status: "open",
        due_date: null,
        tags: []
      };

      console.log('Attempting to create task:', initialTaskData);

      const newTask = await addTask(initialTaskData);
      console.log('Task created successfully:', newTask);

      if (newTask) {
        setSelectedTask({ ...newTask, isNew: true });
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Error creating new task:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  };

  // ▶️ **Start a Focus Session**
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

  // ⏳ **End Session & Log Energy**
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

  // Add delete task handler
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId);
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setShowPrompt(false);
      }
    }
  };

  // Update the task selection handler
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

  return (
    <div className="tasks-page">
      {/* 🎯 Task Filters */}
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

        {/* Active filters display */}
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

      {/* ➕ Quick Add Task */}
      <button onClick={handleAddTask} className="add-task-button">
        <FiPlus size={18} /> Add Task
      </button>

      {/* 📌 Task List */}
      <div className="tasks-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task}
              updateTask={updateTask}
              deleteTask={deleteTask}
              onStatusChange={(status) => updateTask(task.id, { ...task, status })}
              onCheck={() => handleTaskSelect(task)}
              isSelected={selectedTask?.id === task.id}
              onTagClick={handleTagClick}
            />
          ))
        ) : (
          <p>No tasks found.</p>
        )}
      </div>

      {/* ⏳ Focus Timer Popup */}
      {showPrompt && selectedTask && (
        <div className="popup-overlay">
          <div className="focus-popup">
            <h3>Focus Session</h3>
            <p>Ready to focus on: {selectedTask.title}</p>
            
            {/* Add Notes Section */}
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
