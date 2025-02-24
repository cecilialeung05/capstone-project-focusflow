export async function seed(knex) {

  await knex('task_tags').del();
  await knex('note_tags').del();
  await knex('notes').del();
  await knex('tasks').del();
  await knex('tags').del();

  // MySQL version of resetting auto-increment
  await knex.raw('ALTER TABLE tasks AUTO_INCREMENT = 1');
  await knex.raw('ALTER TABLE notes AUTO_INCREMENT = 1');
  await knex.raw('ALTER TABLE tags AUTO_INCREMENT = 1');

  // Tags grouped by themes for better visualization
  await knex('tags').insert([
    // Project Management Tags
    { id: 1, name: 'Urgent', color: '#ff4444' },
    { id: 2, name: 'Work', color: '#2196f3' },
    { id: 3, name: 'Personal', color: '#4caf50' },
    { id: 4, name: 'Study', color: '#9c27b0' },
    
    // Development Stack Tags
    { id: 5, name: 'Frontend', color: '#e91e63' },
    { id: 6, name: 'Backend', color: '#673ab7' },
    { id: 7, name: 'Database', color: '#3f51b5' },
    { id: 8, name: 'API', color: '#00bcd4' },
    
    // Technology Tags
    { id: 9, name: 'React', color: '#61dafb' },
    { id: 10, name: 'Node.js', color: '#68a063' },
    { id: 11, name: 'Express', color: '#000000' },
    { id: 12, name: 'MySQL', color: '#00758f' },
    
    // Feature Tags
    { id: 13, name: 'Authentication', color: '#ff9800' },
    { id: 14, name: 'Data Visualization', color: '#795548' },
    { id: 15, name: 'UI/UX', color: '#607d8b' },
    
    // Learning Path Tags
    { id: 16, name: 'Fundamentals', color: '#2196f3' },
    { id: 17, name: 'Advanced', color: '#673ab7' },
    { id: 18, name: 'Interview Prep', color: '#ff4444' },
    { id: 19, name: 'Best Practices', color: '#4caf50' },
    
    // React Ecosystem
    { id: 20, name: 'React Hooks', color: '#61dafb' },
    { id: 21, name: 'State Management', color: '#764abc' },
    { id: 22, name: 'React Router', color: '#ca4245' },
    { id: 23, name: 'Component Patterns', color: '#00bcd4' },
    
    // Full Stack Concepts
    { id: 24, name: 'RESTful API', color: '#ff9800' },
    { id: 25, name: 'CRUD Operations', color: '#795548' },
    { id: 26, name: 'Authentication', color: '#607d8b' },
    { id: 27, name: 'Database Design', color: '#3f51b5' }
  ]);

  // Tasks with clear relationships
  await knex('tasks').insert([
    {
      id: 1,
      title: 'Implement Force Graph',
      description: 'Create interactive force-directed graph for tag visualization',
      status: 'in-progress',
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-02-01')
    },
    {
      id: 2,
      title: 'User Authentication System',
      description: 'Set up JWT authentication with secure token handling',
      status: 'completed',
      created_at: new Date('2024-02-02'),
      updated_at: new Date('2024-02-02')
    },
    {
      id: 3,
      title: 'Database Schema Design',
      description: 'Design relational database schema for tasks, notes, and tags',
      status: 'completed',
      created_at: new Date('2024-02-03'),
      updated_at: new Date('2024-02-03')
    },
    {
      id: 21,
      title: 'Master React Hooks',
      description: 'Deep dive into useState, useEffect, useContext, and custom hooks',
      status: 'in-progress',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 22,
      title: 'Build Portfolio Projects',
      description: 'Create 3 full-stack applications showcasing different skills',
      status: 'in-progress',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 23,
      title: 'System Design Practice',
      description: 'Study and practice system design concepts for interviews',
      status: 'open',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Notes with meaningful connections
  await knex('notes').insert([
    {
      id: 1,
      title: 'Force Graph Research',
      content: `# Force Graph Implementation Notes
- Use react-force-graph for visualization
- Nodes: Tags, Tasks, Notes
- Links: Relationships between items
- Color coding by type and status
- Interactive zoom and drag`,
      created_at: new Date('2024-02-01'),
      updated_at: new Date('2024-02-01')
    },
    {
      id: 2,
      title: 'Authentication Flow',
      content: `# Auth System Design
- JWT token implementation
- Secure password hashing
- Token refresh mechanism
- Protected routes setup`,
      created_at: new Date('2024-02-02'),
      updated_at: new Date('2024-02-02')
    },
    {
      id: 25,
      title: 'React Hooks Deep Dive',
      content: `# Understanding React Hooks

## useState
- State management in functional components
- Batch updates and state scheduling
- Best practices for complex state

## useEffect
- Dependency array optimization
- Cleanup functions
- Common pitfalls to avoid

## Custom Hooks
- Extracting reusable logic
- Building composable hooks
- Testing custom hooks`,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 26,
      title: 'Interview Preparation Notes',
      content: `# Technical Interview Prep

## React Topics
- Virtual DOM and reconciliation
- Component lifecycle
- Performance optimization

## System Design
- Scalability considerations
- Database choices
- Caching strategies

## Common Questions
- State management solutions
- Authentication methods
- API design patterns`,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Create rich relationships
  await knex('task_tags').insert([
    // Force Graph Task relationships
    { task_id: 1, tag_id: 5 },  // Frontend
    { task_id: 1, tag_id: 9 },  // React
    { task_id: 1, tag_id: 14 }, // Data Visualization
    { task_id: 1, tag_id: 15 }, // UI/UX
    
    // Auth System relationships
    { task_id: 2, tag_id: 6 },  // Backend
    { task_id: 2, tag_id: 10 }, // Node.js
    { task_id: 2, tag_id: 13 }, // Authentication
    
    // Database Task relationships
    { task_id: 3, tag_id: 7 },  // Database
    { task_id: 3, tag_id: 12 }, // MySQL
    
    // Learning-focused Task relationships
    { task_id: 21, tag_id: 20 }, // React Hooks
    { task_id: 22, tag_id: 24 }, // RESTful API
    { task_id: 23, tag_id: 27 }  // Database Design
  ]);

  await knex('note_tags').insert([
    // Force Graph Note relationships
    { note_id: 1, tag_id: 5 },  // Frontend
    { note_id: 1, tag_id: 9 },  // React
    { note_id: 1, tag_id: 14 }, // Data Visualization
    
    // Auth Note relationships
    { note_id: 2, tag_id: 6 },  // Backend
    { note_id: 2, tag_id: 13 }, // Authentication
    
    // Learning-focused Note relationships
    { note_id: 25, tag_id: 20 }, // React Hooks
    { note_id: 26, tag_id: 18 }  // Interview Prep
  ]);
}