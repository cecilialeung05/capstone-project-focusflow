import React from "react";
import PropTypes from 'prop-types';
import TaskItem from './Tasks/TaskItem';
import TaskCard from './Tasks/TaskCard';
import './TaskList.scss';

const TaskList = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete,
  onTaskSelect,
  selectedTaskId,
  tags 
}) => {
  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
          onSelect={onTaskSelect}
          isSelected={selectedTaskId === task.id}
          tags={tags}
        />
      ))}
      {tasks.length === 0 && (
        <div className="task-list__empty">
          <p>No tasks found</p>
        </div>
      )}
    </div>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string,
    due_date: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.number)
  })).isRequired,
  onTaskUpdate: PropTypes.func.isRequired,
  onTaskDelete: PropTypes.func.isRequired,
  onTaskSelect: PropTypes.func.isRequired,
  selectedTaskId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tags: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }))
};

export default TaskList; 