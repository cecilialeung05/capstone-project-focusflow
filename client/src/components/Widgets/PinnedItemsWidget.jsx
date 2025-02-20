import React from 'react';
import { Link } from 'react-router-dom';
// import './PinnedItemsWidget.scss';

function PinnedItemsWidget({ items, updateTask, updateNote }) {
  const handleUnpin = (item) => {
    const updateFn = item.type === 'task' ? updateTask : updateNote;
    updateFn(item.id, { ...item, isPinned: false });
  };

  return (
    <div className="pinned-items-widget">
      <h3 className="pinned-items-widget__title">Pinned Items</h3>
      <div className="pinned-items-widget__content">
        {items.length > 0 ? (
          <ul className="pinned-items-widget__list">
            {items.map(item => (
              <li key={item.id} className="pinned-items-widget__item">
                <Link 
                  to={`/${item.type}s/${item.id}`}
                  className="pinned-items-widget__link"
                >
                  <span className="pinned-items-widget__icon">
                    {item.type === 'task' ? '📋' : '📝'}
                  </span>
                  <span className="pinned-items-widget__text">{item.title}</span>
                </Link>
                <button
                  className="pinned-items-widget__unpin"
                  onClick={() => handleUnpin(item)}
                  aria-label="Unpin item"
                >
                  📌
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pinned-items-widget__empty">No pinned items</p>
        )}
      </div>
    </div>
  );
}

export default PinnedItemsWidget; 