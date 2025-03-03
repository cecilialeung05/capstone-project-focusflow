import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiX, FiSave, FiCheck, FiChevronDown, FiChevronUp, FiClock } from 'react-icons/fi';
import './TaskItem.scss';
import { TaskContext } from '../../context/TaskContext';
import { formatDate } from '../../utils/dateUtils';

function TaskItem({ task, updateTask, deleteTask, onStatusChange, onCheck, isSelected, isNew = false }) {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(isNew);
  const [isEditing, setIsEditing] = useState(isNew);
  const [localTask, setLocalTask] = useState(task);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [editData, setEditData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'OPEN',
    due_date: task?.due_date || '',
    priority: task?.priority || 'MEDIUM',
    tags: task?.tags || []
  });
  const { updateTask: contextUpdateTask } = useContext(TaskContext);

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  useEffect(() => {
    if (task && !isNew) {
      setEditData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'TODO',
        due_date: task.due_date || '',
        priority: task.priority || 'MEDIUM',
        tags: task.tags || []
      });
    }
  }, [task, isNew]);

  const handleTitleSubmit = async () => {
    if (editedTitle.trim() !== task.title) {
      try {
        await contextUpdateTask(task.id, {
          ...task,
          title: editedTitle.trim()
        });
      } catch (error) {
        console.error('Failed to update task:', error);
        setEditedTitle(task.title);
      }
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'due_date') {
      setEditData(prev => ({
        ...prev,
        due_date: value || null
      }));
      return;
    }

    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSave = async () => { 
    if (!editData.title.trim()) return;
    
    setIsSaving(true);
    try {
      const updateData = {
        title: editData.title.trim(),
        description: editData.description?.trim() || '',
        status: editData.status.toLowerCase(),
        due_date: editData.due_date || null,
        tags: []
      };

      console.log('Task ID:', task.id);
      console.log('Update payload:', updateData);

      const updatedTask = await updateTask(task.id, updateData);
      console.log('Server response:', updatedTask);
      
      if (updatedTask) {
        setLocalTask({
          ...updatedTask,
          due_date: updatedTask.due_date,
          status: updatedTask.status
        });

        setIsEditing(false);
        setShowDetails(false);
        setShowSaveConfirm(true);
        setTimeout(() => {
          setShowSaveConfirm(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Save error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData: error.config?.data
      });
      
      const errorMessage = error.response?.data?.errors?.[0]?.msg || 
                         error.response?.data?.message || 
                         'Failed to save changes';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    onStatusChange(newStatus);
    setShowStatusMenu(false);
  };

  const handleCancel = () => {
    if (isNew) {
      deleteTask(task.id);
    } else {
      setIsEditing(false);
      setEditData({
        title: localTask.title,
        description: localTask.description,
        status: localTask.status,
        due_date: localTask.due_date,
        priority: localTask.priority,
        tags: localTask.tags
      });
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setShowDetails(true);
    setIsEditing(true);
    setEditData({
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: task.status || 'OPEN',
      due_date: task.due_date || '',
      priority: task.priority || 'MEDIUM',
      tags: task.tags || []
    });
  };

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ];

  const formatDateForInput = (date) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  return (<div className={`task-item ${localTask.status ? localTask.status.toLowerCase().replace(' ', '-') : 'default-status'} ${showDetails ? 'show-details' : ''} ${isEditing ? 'task-item--editing' : ''} ${isNew ? 'task-item--new' : ''}`}>

      <div className="task-item__header">
        <div className="task-item__title-group">
        <div 
  className={`task-item__checkbox ${isSelected ? 'checked' : ''}`}
  onClick={() => onCheck(localTask.id, localTask)}
>
  {isSelected && <FiCheck className="check-icon" />}
</div>
{isEditing || isNew ? (
  <input
    type="text"
    name="title"
    value={editData.title}
    onChange={handleChange}
    onKeyDown={handleKeyDown}
    className="task-item__title-input"
    placeholder="Task title..."
    autoFocus={isNew}
  />
) : (
  <h3 className="task-item__title" onClick={() => setIsEditing(true)}>
    {localTask.title}
    {showSaveConfirm && (
      <span className="task-item__save-confirm">
        <FiCheck /> Saved
      </span>
    )}
  </h3>
)}


        </div>
        
        <div className="task-item__actions">
          {isEditing ? (
            <>
              <button 
                className="task-item__button task-item__button--success"
                onClick={handleSave}
                disabled={isSaving}
                title="Save changes (⌘+Enter)"
              >
                {isSaving ? (
                  <span className="task-item__spinner" />
                ) : (
                  <FiSave />
                )}
              </button>
              <button 
                className="task-item__button"
                onClick={handleCancel}
                disabled={isSaving}
                title="Cancel editing (Esc)"
              >
                <FiX />
              </button>
            </>
          ) : (
            <>
              <button 
                className="task-item__button"
                onClick={() => setShowDetails(!showDetails)}
                title={showDetails ? "Hide details" : "Show details"}
              >
                {showDetails ? <FiChevronUp /> : <FiChevronDown />}
              </button>
                   <button 
        className="task-item__button"
        onClick={handleEditClick}
        title="Edit task"
      >
        <FiEdit2 />
      </button>
      <button 
        className="task-item__button"
        onClick={() => deleteTask(task.id)}
        title="Delete task"
      >
        <FiTrash2 />
      </button> 
           </>
  
              )}
        </div>
      </div>

      {(showDetails || isEditing) && (
        <div className="task-item__details">
          {isEditing ? (
            <div className="task-item__edit-form">
              <textarea
                name="description"
                value={editData.description}
                onChange={handleChange}
                className="task-item__description-input"
                placeholder="Task description..."
              />
              <div className="task-item__form-row">
                <div className="task-item__form-group">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={editData.status.toLowerCase()} 
                    onChange={handleChange}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="task-item__form-group">
                  <label>Priority</label>
                  <select name="priority" value={editData.priority} onChange={handleChange}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="task-item__form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    name="due_date"
                    value={editData.due_date || ''}
                    onChange={handleChange}
                    className="task-form__input"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="task-item__details-content">
              <div className="task-item__details-row">
                <div className="task-item__detail">
                  <span className="task-item__detail-label">Created:</span>
                  <span className="task-item__detail-value">{formatDate(localTask.created_at)}</span>
                </div>
                {localTask.due_date && (
                  <div className="task-item__detail">
                    <span className="task-item__detail-label">Due:</span>
                    <span className="task-item__detail-value">
                      <FiClock className="task-item__detail-icon" />
                      {formatDate(localTask.due_date)}
                    </span>
                  </div>
                )}
                <div className="task-item__detail">
                  <span className="task-item__detail-label">Status:</span>
                  <span className={`task-item__status task-item__status--${localTask.status?.toLowerCase()}`}>
                    {localTask.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="task-item__detail">
                  <span className="task-item__detail-label">Priority:</span>
                  <span className={`task-item__priority task-item__priority--${localTask.priority?.toLowerCase()}`}>
                    {localTask.priority}
                  </span>
                </div>
              </div>

              {localTask.description && (
                <div className="task-item__description">
                  <span className="task-item__detail-label">Description:</span>
                  <p>{localTask.description}</p>
                </div>
              )}

              {localTask.tags && localTask.tags.length > 0 && (
                <div className="task-item__tags">
                  <span className="task-item__detail-label">Tags:</span>
                  <div className="task-item__tags-list">
                    {localTask.tags.map(tag => (
                      <span key={tag.id} className="task-item__tag">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskItem;

