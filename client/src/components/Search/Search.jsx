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
    <div className="search-container">
      <button 
        className="search-button"
        onClick={() => setIsOpen(true)}
      >
        <span>🔍</span>
        <span>Search (Ctrl + K)</span>
      </button>

      {isOpen && (
        <div className="search-modal">
          <div className="modal-overlay" onClick={() => setIsOpen(false)} />
          <div className="search-content">
            <div className="search-input">
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search tasks and notes..."
                autoFocus
              />
            </div>

            <div className="search-results">
              {results.length > 0 ? (
                <ul>
                  {results.map((result, index) => (
                    <li 
                      key={index}
                      onClick={() => {
                        navigate(result.type === 'task' 
                          ? `/tasks/${result.item.id}`
                          : `/notes/${result.item.id}`
                        );
                        setIsOpen(false);
                      }}
                    >
                      <span className="icon">
                        {result.type === 'task' ? '📋' : '📝'}
                      </span>
                      <span className="title">{result.item.title}</span>
                      <span className="type">{result.type}</span>
                    </li>
                  ))}
                </ul>
              ) : query ? (
                <div className="no-results">
                  No results found
                </div>
              ) : (
                <div className="search-hint">
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