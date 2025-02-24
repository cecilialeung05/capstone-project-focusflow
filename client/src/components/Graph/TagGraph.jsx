import React, { useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './TagGraph.scss';

function TagGraph({ tags = [], notes = [], tasks = [], selectedTagId, onTagSelect }) {
  const [filters, setFilters] = useState({
    showNotes: true,
    showTasks: true,
    showIsolated: false,
    searchTerm: ''
  });

  // Filter nodes based on search and connection status
  const getFilteredNodes = () => {
    let baseNodes = [
      // Tags with emoji indicators
      ...tags.map(tag => ({
        id: `tag-${tag.id}`,
        name: `🏷️ ${tag.name}`,
        type: 'tag',
        val: 3,
        color: tag.color || '#1976d2',
        selected: tag.id === selectedTagId
      })),
      // Notes with emoji
      ...(filters.showNotes ? notes
        .filter(note => note.note_tags?.length > 0)
        .map(note => ({
          id: `note-${note.id}`,
          name: `📝 ${note.title}`,
          type: 'note',
          val: 2
        })) : []),
      // Tasks with status emoji
      ...(filters.showTasks ? tasks
        .filter(task => task.task_tags?.length > 0)
        .map(task => ({
          id: `task-${task.id}`,
          name: `${getTaskEmoji(task.status)} ${task.title}`,
          type: 'task',
          status: task.status,
          val: 2
        })) : [])
    ];

    // Filter by search term
    if (filters.searchTerm) {
      baseNodes = baseNodes.filter(node => 
        node.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    return baseNodes;
  };

  const getTaskEmoji = (status) => {
    switch(status) {
      case 'open': return '⭕';
      case 'in-progress': return '⏳';
      case 'completed': return '✅';
      default: return '📋';
    }
  };

  const nodes = getFilteredNodes();
  const links = [
    ...notes.flatMap(note => 
      (note.note_tags || []).map(noteTag => ({
        source: `tag-${noteTag.tag_id}`,
        target: `note-${note.id}`,
        type: 'note-link'
      }))
    ),
    ...tasks.flatMap(task => 
      (task.task_tags || []).map(taskTag => ({
        source: `tag-${taskTag.tag_id}`,
        target: `task-${task.id}`,
        type: 'task-link'
      }))
    )
  ];

  return (
    <div className="tag-graph">
      <div className="tag-graph__controls">
        <input
          type="text"
          placeholder="Search nodes..."
          value={filters.searchTerm}
          onChange={e => setFilters(f => ({ ...f, searchTerm: e.target.value }))}
          className="tag-graph__search"
        />
        <div className="tag-graph__filters">
          <label>
            <input
              type="checkbox"
              checked={filters.showNotes}
              onChange={e => setFilters(f => ({ ...f, showNotes: e.target.checked }))}
            /> Show Notes
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.showTasks}
              onChange={e => setFilters(f => ({ ...f, showTasks: e.target.checked }))}
            /> Show Tasks
          </label>
          <label>
            <input
              type="checkbox"
              checked={filters.showIsolated}
              onChange={e => setFilters(f => ({ ...f, showIsolated: e.target.checked }))}
            /> Show Isolated Nodes
          </label>
        </div>
      </div>

      <ForceGraph2D
        graphData={{ nodes, links }}
        nodeLabel={node => node.name}
        nodeColor={node => {
          if (node.selected) return 'rgba(255, 107, 107, 0.8)';
          if (node.type === 'tag') {
            const color = node.color || '#1976d2';
            return color.startsWith('rgba') ? color : `${color}cc`;
          }
          if (node.type === 'task') {
            switch(node.status) {
              case 'open': return 'rgba(33, 150, 243, 0.7)';
              case 'in-progress': return 'rgba(76, 175, 80, 0.7)';
              case 'completed': return 'rgba(156, 39, 176, 0.7)';
              default: return 'rgba(153, 153, 153, 0.7)';
            }
          }
          return 'rgba(76, 175, 80, 0.7)';
        }}
        linkColor={link => link.type === 'note-link' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(33, 150, 243, 0.2)'}
        linkDirectional={true}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkWidth={1}
        nodeRelSize={8}
        d3Force={{
          charge: -300,
          link: { distance: 60 }
        }}
        onNodeClick={node => {
          const [type, id] = node.id.split('-');
          if (type === 'tag') {
            onTagSelect(tags.find(t => t.id === parseInt(id)));
          } else if (type === 'note') {
            window.location.href = `/notes/${id}`;
          } else if (type === 'task') {
            window.location.href = `/tasks/${id}`;
          }
        }}
      />

      <div className="tag-graph__legend">
        <div className="tag-graph__legend-item">
          <span className="dot tag">●</span> Tags 🏷️
        </div>
        <div className="tag-graph__legend-item">
          <span className="dot note">●</span> Notes 📝
        </div>
        <div className="tag-graph__legend-item">
          <span className="dot task">●</span> Tasks (⭕ ⏳ ✅)
        </div>
      </div>
    </div>
  );
}

export default TagGraph; 