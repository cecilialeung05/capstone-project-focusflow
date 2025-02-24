import React from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import './TagGraph.scss';

function TagGraph({ tags = [], notes = [], tasks = [], onTagClick }) {
  // Log incoming data
  console.log('Tags:', tags);
  console.log('Notes:', notes);
  console.log('Tasks:', tasks);

  const graphData = {
    nodes: [
      // Tags as primary nodes
      ...tags.map(tag => ({
        id: `tag-${tag.id}`,
        name: tag.name,
        type: 'tag',
        val: 2,
        color: tag.color || '#1976d2'
      })),
      // Notes with tags
      ...notes.filter(note => note.note_tags?.length > 0).map(note => ({
        id: `note-${note.id}`,
        name: note.title,
        type: 'note',
        val: 1
      })),
      // Tasks with tags
      ...tasks.filter(task => task.task_tags?.length > 0).map(task => ({
        id: `task-${task.id}`,
        name: task.title,
        type: 'task',
        status: task.status,
        val: 1
      }))
    ],
    links: [
      // Note-Tag relationships
      ...notes.flatMap(note => 
        (note.note_tags || []).map(noteTag => ({
          source: `tag-${noteTag.tag_id}`,
          target: `note-${note.id}`,
          type: 'note-tag'
        }))
      ),
      // Task-Tag relationships
      ...tasks.flatMap(task => 
        (task.task_tags || []).map(taskTag => ({
          source: `tag-${taskTag.tag_id}`,
          target: `task-${task.id}`,
          type: 'task-tag'
        }))
      )
    ]
  };

  console.log('Graph Data:', graphData);

  return (
    <div className="tag-graph">
      <ForceGraph2D
        graphData={graphData}
        nodeColor={node => {
          if (node.type === 'tag') return node.color;
          if (node.type === 'task') {
            switch(node.status) {
              case 'open': return 'rgba(33, 150, 243, 0.8)';
              case 'in-progress': return 'rgba(76, 175, 80, 0.8)';
              case 'completed': return 'rgba(156, 39, 176, 0.8)';
              default: return '#999';
            }
          }
          return node.type === 'note' ? '#4CAF50' : '#999';
        }}
        nodeLabel={node => `${node.type}: ${node.name}`}
        linkColor={link => link.type === 'note-tag' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(33, 150, 243, 0.2)'}
        linkWidth={1}
        nodeRelSize={8}
        width={800}
        height={600}
        d3Force={{
          charge: -300,
          link: { distance: 50 }
        }}
        onNodeClick={node => {
          // Navigate to the item when clicked
          const [type, id] = node.id.split('-');
          if (type === 'note') {
            window.location.href = `/notes/${id}`;
          } else if (type === 'task') {
            window.location.href = `/tasks/${id}`;
          } else if (type === 'tag') {
            // Find the tag in the list and select it
            const tag = tags.find(t => t.id === parseInt(id));
            if (tag) {
              onTagClick?.(tag);
            }
          }
        }}
      />
    </div>
  );
}

export default TagGraph; 