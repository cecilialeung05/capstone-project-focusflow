import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiX, FiSave, FiCheck, FiChevronDown, FiChevronUp, FiClock, FiRepeat, FiFileText } from 'react-icons/fi';
import './TaskItem.scss';
import { TaskContext } from '../../context/TaskContext';
import { NoteContext } from '../../context/NoteContext';
import { formatDate } from '../../utils/dateUtils';
import QuickNoteModal from '../QuickNoteModal/QuickNoteModal';

const TAG_CATEGORIES = {
  Duration: [
    { value: '25min', label: '25 Minutes' },
    { value: '50min', label: '50 Minutes' },
  ],
  'Time of Day': [
    { value: 'Morning Session', label: 'Morning Session' },
    { value: 'Afternoon Session', label: 'Afternoon Session' },
  ],
  'Work Type': [
    { value: 'Deep Focus', label: 'Deep Focus' },
    { value: 'Light Work', label: 'Light Work' },
  ],
  'Energy Level': [
    { value: 'Feeling Good', label: 'Feeling Good' },
    { value: 'Feeling Tired', label: 'Feeling Tired' },
  ],
};

function TaskItem({ task, updateTask, deleteTask, onStatusChange, onCheck, isSelected, isNew = false, onTagClick }) {
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
    status: task?.status || 'open',
    due_date: task?.due_date || '',
    priority: task?.priority || 'medium',
    tags: task?.tags || [],
    recurring_type: task?.recurring_type || 'none',
    recurring_interval: task?.recurring_interval || '1',
    recurring_unit: task?.recurring_unit || 'days'
  });
  const { updateTask: contextUpdateTask } = useContext(TaskContext);
  const { createNote } = useContext(NoteContext);
  const [showQuickNote, setShowQuickNote] = useState(false);

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  useEffect(() => {
    if (task && !isNew) {
      setEditData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'open',
        due_date: task.due_date || '',
        priority: task.priority || 'medium',
        tags: task.tags || [],
        recurring_type: task.recurring_type || 'none',
        recurring_interval: task.recurring_interval || '1',
        recurring_unit: task.recurring_unit || 'days'
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

  const getLabelForValue = (category, value) => {
    const option = TAG_CATEGORIES[category].find(opt => opt.value === value);
    return option ? option.label : '';
  };

  const handleTagSelect = async (category, value) => {
    if (!value) return;

    const filteredTags = editData.tags?.filter(tag => {
      const tagCategory = Object.entries(TAG_CATEGORIES).find(([_, tags]) =>
        tags.some(t => t.value === tag.name)
      )?.[0];
      return tagCategory !== category;
    }) || [];

    const updatedTags = [
      ...filteredTags,
      { 
        id: Date.now(),
        name: value 
      }
    ];

    setEditData(prev => ({
      ...prev,
      tags: updatedTags
    }));

    if (!isEditing) {
      try {
        await updateTask(task.id, {
          ...task,
          tags: updatedTags
        });
      } catch (error) {
        console.error('Failed to update tag:', error);
      }
    }
  };

  const getCurrentTagForCategory = (category) => {
    return editData.tags?.find(tag => 
      TAG_CATEGORIES[category].some(t => t.value === tag.name)
    )?.name || '';
  };

  const handleSave = async () => {
    if (!editData.title.trim()) return;
    
    setIsSaving(true);
    try {
      const formattedTags = editData.tags.map(tag => {
        if (tag.id && typeof tag.id === 'number') {
          return { id: tag.id };
        }
        
        if (tag.id && typeof tag.id === 'string' && !isNaN(tag.id)) {
          return { id: parseInt(tag.id) };
        }
        
        console.warn('Tag without ID:', tag);
        return null;
      }).filter(tag => tag !== null);

      const updateData = {
        title: editData.title.trim(),
        description: editData.description?.trim() || '',
        status: editData.status.toLowerCase(),
        due_date: editData.due_date || null,
        priority: editData.priority,
        recurring_type: editData.recurring_type,
        recurring_interval: editData.recurring_type === 'custom' ? parseInt(editData.recurring_interval) : null,
        recurring_unit: editData.recurring_type === 'custom' ? editData.recurring_unit : null,
        tags: formattedTags
      };

      console.log('Task ID:', task.id);
      console.log('Update payload:', updateData);

      const updatedTask = await updateTask(task.id, updateData);
      console.log('Server response:', updatedTask);
      
      if (updatedTask) {
        setLocalTask({
          ...updatedTask,
          due_date: updatedTask.due_date,
          status: updatedTask.status,
          tags: updatedTask.tags,
          recurring_type: updatedTask.recurring_type,
          recurring_interval: updatedTask.recurring_interval,
          recurring_unit: updatedTask.recurring_unit
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
        tags: localTask.tags,
        recurring_type: localTask.recurring_type,
        recurring_interval: localTask.recurring_interval,
        recurring_unit: localTask.recurring_unit
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
      status: task.status || 'open',
      due_date: task.due_date || '',
      priority: task.priority || 'medium',
      tags: task.tags || [],
      recurring_type: task.recurring_type || 'none',
      recurring_interval: task.recurring_interval || '1',
      recurring_unit: task.recurring_unit || 'days'
    });
  };

  const handleTagClick = (tagName) => {
    if (onTagClick) {
      onTagClick(tagName);
    }
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

  const getRecurringBadge = (task) => {
    if (!task.recurring_type || task.recurring_type === 'none') return null;

    let recurringText = '';
    switch (task.recurring_type) {
      case 'daily':
        recurringText = 'Daily';
        break;
      case 'weekly':
        recurringText = 'Weekly';
        break;
      case 'monthly':
        recurringText = 'Monthly';
        break;
      case 'custom':
        recurringText = `Every ${task.recurring_interval} ${task.recurring_unit}`;
        break;
      default:
        return null;
    }

    return (
      <span className="task-item__badge task-item__badge--recurring">
        <FiRepeat /> {recurringText}
      </span>
    );
  };

  const handleQuickNoteSave = async (noteData) => {
    try {
      await createNote(noteData);
      setShowQuickNote(false);
      if (task.id) {
        // If you have a function to refresh task data
        // await refreshTask(task.id);
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      alert('Failed to save note. Please try again.');
    }
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
    {getRecurringBadge(localTask)}
    {localTask.priority && (
      <span className={`task-item__badge task-item__badge--${localTask.priority}`}>
        {localTask.priority}
      </span>
    )}
    {localTask.notes?.length > 0 && (
      <span className="task-item__notes-badge">
        {localTask.notes.length} Notes
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
                onClick={() => setShowQuickNote(true)}
                title="Add Quick Note"
              >
                <FiFileText />
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
                className="task-form__input"
                placeholder="Task description..."
              />
              
              <div className="task-item__form-row task-item__form-row--inline">
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

              <div className="task-item__form-row">
                <div className="task-item__recurring-group">
                  <div className="task-item__form-group">
                    <label>Recurring</label>
                    <select
                      name="recurring_type"
                      value={editData.recurring_type}
                      onChange={handleChange}
                      className="task-form__input"
                    >
                      <option value="none">No Recurrence</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  {editData.recurring_type === 'custom' && (
                    <>
                      <div className="task-item__form-group task-item__form-group--interval">
                        <label>Every</label>
                        <input
                          type="number"
                          name="recurring_interval"
                          value={editData.recurring_interval}
                          onChange={handleChange}
                          min="1"
                          className="task-form__input"
                        />
                      </div>
                      <div className="task-item__form-group">
                        <label>&nbsp;</label>
                        <select
                          name="recurring_unit"
                          value={editData.recurring_unit}
                          onChange={handleChange}
                          className="task-form__input"
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="task-item__tags-editor">
                <label>Task Properties</label>
                <div className="task-item__tags-input">
                  {Object.entries(TAG_CATEGORIES).map(([category, options]) => (
                    <div key={category} className="tag-category">
                      <label>{category}</label>
                      <select
                        value={getCurrentTagForCategory(category)}
                        onChange={(e) => handleTagSelect(category, e.target.value)}
                        className="tag-select"
                      >
                        <option value="">Select {category}</option>
                        {options.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="task-item__tags-list">
                  {editData.tags?.map(tag => (
                    <span key={tag.id} className="task-item__tag">
                      {tag.name}
                    </span>
                  ))}
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
                {localTask.recurring_type && localTask.recurring_type !== 'none' && (
                  <div className="task-item__detail">
                    <span className="task-item__detail-label">Recurring:</span>
                    <span className="task-item__detail-value task-item__detail-value--recurring">
                      <FiRepeat className="task-item__detail-icon" />
                      {localTask.recurring_type === 'custom' 
                        ? `Every ${localTask.recurring_interval} ${localTask.recurring_unit}`
                        : localTask.recurring_type.charAt(0).toUpperCase() + localTask.recurring_type.slice(1)}
                    </span>
                  </div>
                )}
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
                      <span 
                        key={tag.id} 
                        className="task-item__tag"
                        onClick={() => handleTagClick(tag.name)}
                        style={{ cursor: 'pointer' }}
                        title="Click to filter by this tag"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {!isEditing && task.notes && task.notes.length > 0 && (
                <div className="task-item__notes-preview">
                  <h4>Recent Notes</h4>
                  <div className="task-item__notes-list">
                    {task.notes.slice(0, 3).map(note => (
                      <div key={note.id} className="task-item__note">
                        <p>{note.content}</p>
                        <span className="task-item__note-date">
                          {formatDate(note.created_at)}
                        </span>
                      </div>
                    ))}
                    {task.notes.length > 3 && (
                      <div className="task-item__notes-more">
                        +{task.notes.length - 3} more notes
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showQuickNote && (
        <QuickNoteModal
          task={task}
          onSave={handleQuickNoteSave}
          onClose={() => setShowQuickNote(false)}
        />
      )}
    </div>
  );
}

export default TaskItem;
