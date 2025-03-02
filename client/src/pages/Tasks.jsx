import React, { useState, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import TaskItem from "../components/Task/TaskItem";
import { Timer, NotePencil, Trash } from "@phosphor-icons/react";
import { FiSmile, FiCoffee, FiClock, FiPlus } from "react-icons/fi";
import "./Tasks.scss";

function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useContext(TaskContext);
  const navigate = useNavigate();

  // UI State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [lastAction, setLastAction] = useState(null);


  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesStatus = filterStatus === "all" || task.status === filterStatus;
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
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
  }, [tasks, searchTerm, filterStatus, sortBy]);

  // 📊 **Task Statistics**
  const taskStats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter((task) => task.status?.toLowerCase() === "completed").length,
    inProgress: tasks.filter((task) => task.status?.toLowerCase() === "in progress").length,
    open: tasks.filter((task) => task.status?.toLowerCase() === "open").length,
  }), [tasks]);

  // ➕ **Create a New Task**
  const handleAddTask = async () => {
    const newTask = await addTask({
      title: "New Task",
      status: "open",
      tags: [],
    });
    setSelectedTask(newTask);
    setShowPrompt(true);
  };

  // ▶️ **Start a Focus Session**
  const handleStartTimer = () => {
    if (!selectedTask) return;
    navigate(`/notes?taskId=${selectedTask.id}`);
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

  // Add function to handle starting focus session
  const handleStartFocus = (task, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setSelectedTask(task);
    setShowPrompt(true);
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
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Tasks</option>
          <option value="open">Open</option>
          <option value="in progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created">Created Date</option>
          <option value="due">Due Date</option>
          <option value="status">Status</option>
        </select>
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
              onCheck={() => setSelectedTask(task)}
              isSelected={selectedTask?.id === task.id}
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
