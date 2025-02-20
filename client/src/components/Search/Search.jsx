import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import './Search.scss';

function Search({ tasks, notes }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const options = {
    keys: ['title', 'description', 'content'],
    threshold: 0.4,
    includeScore: true
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    
    if (!searchQuery) {
      setResults([]);
      return;
    }

    const taskFuse = new Fuse(tasks, options);
    const noteFuse = new Fuse(notes, options);

    const taskResults = taskFuse.search(searchQuery).map(result => ({
      ...result,
      type: 'task'
    }));

    const noteResults = noteFuse.search(searchQuery).map(result => ({
      ...result,
      type: 'note'
    }));

    setResults([...taskResults, ...noteResults]
      .sort((a, b) => a.score - b.score)
      .slice(0, 8));
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="search">
      <button 
        className="search__button"
        onClick={() => setIsOpen(true)}
      >
        <span className="search__button-icon">🔍</span>
        <span className="search__button-text">Search (Ctrl + K)</span>
      </button>

      {isOpen && (
        <div className="search__modal">
          <div className="search__overlay" onClick={() => setIsOpen(false)} />
          <div className="search__content">
            <div className="search__input-wrapper">
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search tasks and notes..."
                className="search__input"
                autoFocus
              />
            </div>

            <div className="search__results">
              {results.length > 0 ? (
                <ul className="search__list">
                  {results.map((result, index) => (
                    <li 
                      key={index}
                      className="search__item"
                      onClick={() => {
                        navigate(result.type === 'task' 
                          ? `/tasks/${result.item.id}`
                          : `/notes/${result.item.id}`
                        );
                        setIsOpen(false);
                      }}
                    >
                      <span className="search__item-icon">
                        {result.type === 'task' ? '📋' : '📝'}
                      </span>
                      <span className="search__item-title">{result.item.title}</span>
                      <span className="search__item-type">{result.type}</span>
                    </li>
                  ))}
                </ul>
              ) : query ? (
                <div className="search__empty">
                  No results found
                </div>
              ) : (
                <div className="search__hint">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search; 