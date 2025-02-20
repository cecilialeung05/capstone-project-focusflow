import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import WeatherWidget from '../Widgets/WeatherWidget';
import TimerWidget from '../Widgets/TimerWidget';
import PinnedItemsWidget from '../Widgets/PinnedItemsWidget';
import Greeting from '../Greeting/Greeting';
import './RightSidebar.scss';

function RightSidebar({ pinnedItems, updateTask, updateNote }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [widgets, setWidgets] = useState([
    { id: 'greeting', component: Greeting },
    { id: 'weather', component: WeatherWidget },
    { id: 'timer', component: TimerWidget },
    { id: 'pinned', component: PinnedItemsWidget }
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  return (
    <aside className={`right-sidebar ${isCollapsed ? 'right-sidebar--collapsed' : ''}`}>
      <button 
        className="right-sidebar__toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
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
                      className="right-sidebar__widget"
                    >
                      <div 
                        className="right-sidebar__widget-handle"
                        {...provided.dragHandleProps}
                      >
                        ⋮
                      </div>
                      {widget.id === 'pinned' ? (
                        <PinnedItemsWidget 
                          items={pinnedItems}
                          updateTask={updateTask}
                          updateNote={updateNote}
                        />
                      ) : (
                        <widget.component />
                      )}
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
