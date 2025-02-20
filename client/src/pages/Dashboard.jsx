import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ResizableBox } from 'react-resizable';
import AnimatedPage from '../components/AnimatedPage';
import './Dashboard.scss';
import 'react-resizable/css/styles.css';

function Dashboard({ tasks, notes, tags }) {
  const [selectedTag, setSelectedTag] = useState(null);
  const [components, setComponents] = useState([
    { id: 'tasks', title: 'Tasks Overview', width: 400, height: 300 },
    { id: 'notes', title: 'Notes', width: 400, height: 300 },
    { id: 'recent', title: 'Recent Items', width: 400, height: 300 }
  ]);

  const statistics = useMemo(() => {
    const taskStats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in progress').length,
      open: tasks.filter(task => task.status === 'open').length,
      blocked: tasks.filter(task => task.status === 'blocked').length
    };

    const noteStats = {
      total: notes.length,
      withTasks: notes.filter(note => note.task_id).length,
      withTags: notes.filter(note => note.tags?.length > 0).length
    };

    return { taskStats, noteStats };
  }, [tasks, notes]);

  const recentItems = useMemo(() => {
    const allItems = [
      ...tasks.map(task => ({
        ...task,
        type: 'task',
        date: new Date(task.created_at)
      })),
      ...notes.map(note => ({
        ...note,
        type: 'note',
        date: new Date(note.created_at)
      }))
    ];

    return allItems
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  }, [tasks, notes]);

  const filteredItems = useMemo(() => {
    if (!selectedTag) return { tasks, notes };

    return {
      tasks: tasks.filter(task => 
        task.tags?.some(tag => tag.id === selectedTag)
      ),
      notes: notes.filter(note => 
        note.tags?.some(tag => tag.id === selectedTag)
      )
    };
  }, [tasks, notes, selectedTag]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
  };

  const handleResize = (index, size) => {
    const newComponents = [...components];
    newComponents[index] = {
      ...newComponents[index],
      width: size.width,
      height: size.height
    };
    setComponents(newComponents);
  };

  const renderComponentContent = (componentId) => {
    switch (componentId) {
      case 'tasks':
        return (
          <div className="dashboard__tasks">
            <div className="dashboard__stats">
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">Total</span>
                <span className="dashboard__stat-value">{statistics.taskStats.total}</span>
              </div>
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">Completed</span>
                <span className="dashboard__stat-value">{statistics.taskStats.completed}</span>
              </div>
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">In Progress</span>
                <span className="dashboard__stat-value">{statistics.taskStats.inProgress}</span>
              </div>
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">Open</span>
                <span className="dashboard__stat-value">{statistics.taskStats.open}</span>
              </div>
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="dashboard__notes">
            <div className="dashboard__stats">
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">Total Notes</span>
                <span className="dashboard__stat-value">{statistics.noteStats.total}</span>
              </div>
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">With Tasks</span>
                <span className="dashboard__stat-value">{statistics.noteStats.withTasks}</span>
              </div>
              <div className="dashboard__stat">
                <span className="dashboard__stat-label">With Tags</span>
                <span className="dashboard__stat-value">{statistics.noteStats.withTags}</span>
              </div>
            </div>
          </div>
        );

      case 'recent':
        return (
          <div className="dashboard__recent">
            {recentItems.map(item => (
              <Link
                key={`${item.type}-${item.id}`}
                to={`/${item.type}s/${item.id}`}
                className="dashboard__recent-item"
              >
                <span className="dashboard__recent-icon">
                  {item.type === 'task' ? '📋' : '📝'}
                </span>
                <span className="dashboard__recent-title">{item.title}</span>
                <span className="dashboard__recent-date">
                  {formatDate(item.date)}
                </span>
              </Link>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatedPage>
      <div className="dashboard">
        <div className="dashboard__header">
          <h1 className="dashboard__title">Dashboard</h1>
        </div>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard">
            {(provided) => (
              <div 
                className="dashboard__grid"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {components.map((component, index) => (
                  <Draggable 
                    key={component.id} 
                    draggableId={component.id} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <ResizableBox
                          width={component.width}
                          height={component.height}
                          onResize={(e, data) => handleResize(index, data.size)}
                          minConstraints={[300, 200]}
                          maxConstraints={[800, 600]}
                        >
                          <div className="dashboard__card">
                            <div 
                              className="dashboard__card-header"
                              {...provided.dragHandleProps}
                            >
                              <h3>{component.title}</h3>
                            </div>
                            <div className="dashboard__card-content">
                              {renderComponentContent(component.id)}
                            </div>
                          </div>
                        </ResizableBox>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </AnimatedPage>
  );
}

export default Dashboard;
