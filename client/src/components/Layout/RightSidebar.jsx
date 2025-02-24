import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import WeatherWidget from '../Widgets/WeatherWidget';
import TimerWidget from '../Widgets/TimerWidget';
import PinnedItemsWidget from '../Widgets/PinnedItemsWidget';
import Greeting from '../Widgets/Greeting/Greeting';
import { FaEllipsisH } from 'react-icons/fa';
import { WiDaySunny } from 'react-icons/wi';
import './RightSidebar.scss';

function RightSidebar({ tasks = [], notes = [], updateTask, updateNote, isAuthenticated }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedTask, setSelectedTask] = useState(null);
  const [widgets, setWidgets] = useState([
    { id: 'greeting', title: 'Welcome', component: Greeting, isExpanded: true },
    { id: 'weather', title: 'Weather', icon: <WiDaySunny size={16} />, component: WeatherWidget, isExpanded: true },
    { id: 'timer', title: 'Timer', component: () => (
      <TimerWidget 
        selectedTask={selectedTask} 
        onTimerComplete={handleTimerComplete}
        onTaskDeselect={() => setSelectedTask(null)}
      />
    ), isExpanded: true },
    { id: 'pinned', title: 'Pinned Items', component: PinnedItemsWidget, isExpanded: true }
  ]);

  // Get pinned items d
  const pinnedItems = {
    tasks: tasks.filter(task => task.isPinned),
    notes: notes.filter(note => note.isPinned)
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setWidgets(items);
  };

  const toggleWidget = (widgetId) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId 
        ? { ...widget, isExpanded: !widget.isExpanded }
        : widget
    ));
  };

  const handleTaskSelect = (task) => {
    console.log('Task selected:', task); // Debug log
    if (selectedTask?.id === task.id) {
      setSelectedTask(null);
    } else {
      setSelectedTask(task);
      // Scroll to timer widget
      document.getElementById('timer-widget')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTimerComplete = (taskId, duration) => {
    // Update task when timer completes
    updateTask(taskId, { 
      status: 'completed',
      duration: duration 
    });
    setSelectedTask(null); // Clear selected task
  };

  return (
    <aside className={`right-sidebar ${isCollapsed ? 'right-sidebar--collapsed' : ''}`}>
      <button 
        className="right-sidebar__toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isMobile 
          ? (isCollapsed ? '↑' : '↓')
          : (isCollapsed ? '←' : '→')
        }
      </button>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <div 
              className="right-sidebar__content"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {widgets.map((widget, index) => (
                <Draggable 
                  key={widget.id} 
                  draggableId={widget.id} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`right-sidebar__widget ${!widget.isExpanded ? 'right-sidebar__widget--collapsed' : ''}`}
                    >
                      <div className="right-sidebar__widget-header">
                        <div 
                          {...provided.dragHandleProps}
                          className="right-sidebar__widget-drag"
                        >
                          <FaEllipsisH />
                        </div>
                        <h3 className="right-sidebar__widget-title">
                          {widget.icon && <span className="right-sidebar__widget-icon">{widget.icon}</span>}
                          {widget.title}
                        </h3>
                        <button
                          className="right-sidebar__widget-toggle"
                          onClick={() => toggleWidget(widget.id)}
                          aria-label={widget.isExpanded ? 'Collapse widget' : 'Expand widget'}
                        >
                          {widget.isExpanded ? '-' : '+'}
                        </button>
                      </div>
                      <div className="right-sidebar__widget-content">
                        {widget.id === 'pinned' ? (
                          <PinnedItemsWidget 
                            pinnedTasks={pinnedItems.tasks}
                            pinnedNotes={pinnedItems.notes}
                            updateTask={updateTask}
                            updateNote={updateNote}
                            isAuthenticated={isAuthenticated}
                          />
                        ) : (
                          <widget.component />
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </aside>
  );
}

export default RightSidebar;
