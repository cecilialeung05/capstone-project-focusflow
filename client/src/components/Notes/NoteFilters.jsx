// New component for filters
function NoteFilters({ searchTerm, filterTask, sortBy, onFilterChange }) {
  return (
    <div className="note-filters">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        placeholder="Search notes..."
      />
      <select 
        value={filterTask}
        onChange={(e) => onFilterChange('filterTask', e.target.value)}
      >
        {/* task options */}
      </select>
      <select
        value={sortBy}
        onChange={(e) => onFilterChange('sortBy', e.target.value)}
      >
        {/* sort options */}
      </select>
    </div>
  );
} 