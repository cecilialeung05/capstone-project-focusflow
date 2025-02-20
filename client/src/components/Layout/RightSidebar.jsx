import React, { useState } from 'react';
import WeatherWidget from '../Widgets/WeatherWidget';
import TimerWidget from '../Widgets/TimerWidget';
import PinnedItemsWidget from '../Widgets/PinnedItemsWidget';
import './RightSidebar.scss';

function RightSidebar({ pinnedItems, updateTask, updateNote }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`right-sidebar ${isCollapsed ? 'right-sidebar--collapsed' : ''}`}>
      <button 
        className="right-sidebar__toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      <div className="right-sidebar__content">
        <div className="right-sidebar__widget">
          <WeatherWidget />
        </div>

        <div className="right-sidebar__widget">
          <TimerWidget />
        </div>

        <div className="right-sidebar__widget">
          <PinnedItemsWidget 
            items={pinnedItems}
            updateTask={updateTask}
            updateNote={updateNote}
          />
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;
