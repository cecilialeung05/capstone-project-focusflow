export async function seed(knex) {

  await knex('task_tags').del();
  await knex('note_tags').del();
  await knex('notes').del();
  await knex('tasks').del();
  await knex('tags').del();

  await knex.raw('ALTER TABLE tasks AUTO_INCREMENT = 1');
  await knex.raw('ALTER TABLE notes AUTO_INCREMENT = 1');

  await knex('tags').insert([
    { id: 1, name: 'Urgent' },
    { id: 2, name: 'Work' },
    { id: 3, name: 'Personal' },
    { id: 4, name: 'Study' },
    { id: 5, name: 'Healthy' },
    { id: 6, name: 'Meeting' },
    { id: 7, name: 'Project' },
    { id: 8, name: 'Ideas' },
    { id: 9, name: 'Goals' },
    { id: 10, name: 'Shopping' },
    { id: 11, name: 'Travel' },
    { id: 12, name: 'Family' },
    { id: 13, name: 'React' },
    { id: 14, name: 'React Router DOM' },
    { id: 15, name: 'Axios' },
    { id: 16, name: 'Sass' },
    { id: 17, name: 'Node.js' },
    { id: 18, name: 'Express.js' },
    { id: 19, name: 'Knex.js' },
    { id: 20, name: 'MySQL' },
    { id: 21, name: 'dotenv' },
    { id: 22, name: 'CORS' },
    { id: 23, name: 'Framer Motion' },
    { id: 24, name: 'Recharts' },
    { id: 25, name: 'React-Beautiful-DND' }
  ]);

  // Insert tasks
  await knex('tasks').insert([
    {
      id: 1,
      title: 'Plan Website Redesign',
      description: 'Outline the new design for the company website.',
      status: 'in progress',
      due_date: '2025-01-15',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      title: 'Market Research',
      description: 'Analyze competitors and evaluate pricing strategies.',
      status: 'completed',
      due_date: '2025-01-10',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      title: 'Brand Positioning',
      description: 'Determine unique selling points and key messaging for the project.',
      status: 'in progress',
      due_date: '2025-01-20',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      title: 'Authentication System',
      description: 'Implement user authentication with JWT and session management.',
      status: 'open',
      due_date: '2025-01-25',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      title: 'Content Strategy',
      description: 'Plan and organize content for marketing and outreach.',
      status: 'open',
      due_date: '2025-02-01',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 6,
      title: 'Database Transactions',
      description: 'Implement and optimize database transactions using Knex.js.',
      status: 'completed',
      due_date: '2025-02-05',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 7,
      title: 'API Development',
      description: 'Create RESTful API endpoints for tasks, notes, and users.',
      status: 'in progress',
      due_date: '2025-02-10',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 8,
      title: 'Frontend Component Structure',
      description: 'Set up reusable React components and layout structure.',
      status: 'in progress',
      due_date: '2025-02-12',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 9,
      title: 'Theme Implementation',
      description: 'Add light/dark mode with React Context API.',
      status: 'completed',
      due_date: '2025-02-14',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 10,
      title: 'Fuzzy Search Implementation',
      description: 'Integrate Fuse.js for fast and flexible search capabilities.',
      status: 'open',
      due_date: '2025-02-18',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 11,
      title: 'Task Filtering and Tagging',
      description: 'Implement filtering options based on task status and tags.',
      status: 'open',
      due_date: '2025-02-20',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 12,
      title: 'Drag and Drop Functionality',
      description: 'Enable users to reorder tasks and move notes between tasks.',
      status: 'in progress',
      due_date: '2025-02-22',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 13,
      title: 'Graph Visualization',
      description: 'Display task relationships using react-force-graph and Recharts.',
      status: 'open',
      due_date: '2025-02-24',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 14,
      title: 'Final Testing and Debugging',
      description: 'Conduct thorough testing and fix major bugs before deployment.',
      status: 'open',
      due_date: '2025-02-26',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 15,
      title: 'Deployment',
      description: 'Deploy the application to production environment.',
      status: 'open',
      due_date: '2025-02-28',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 16,
      title: 'Weekly Tasks',
      description: 'Plan and organize weekly development tasks for the project.',
      status: 'in progress',
      due_date: '2025-03-01',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 17,
      title: 'Dark & Light Theme (React Context)',
      description: 'Implement a theme toggle using React Context API.',
      status: 'completed',
      due_date: '2025-02-22',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 18,
      title: 'Fuzzy Search (fuse.js)',
      description: 'Add a fast search for tasks and notes using Fuse.js.',
      status: 'open',
      due_date: '2025-02-25',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 19,
      title: 'Layout Folder Structure',
      description: 'Refactor UI components into a structured layout directory.',
      status: 'completed',
      due_date: '2025-02-19',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 20,
      title: 'Resizable Components (react-resizable-box)',
      description: 'Allow users to resize UI components dynamically.',
      status: 'open',
      due_date: '2025-02-28',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  await knex('notes').insert([
    {
      id: 1,
      task_id: 1,
      title: 'Initial Ideas',
      content: 'Brainstorming session notes: focus on a modern, clean design with improved user experience.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      task_id: 1,
      title: 'Color Palette',
      content: 'Proposed color scheme: shades of blue and gray with a vibrant accent color.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      task_id: 2,
      title: 'Competitor A',
      content: 'Competitor A charges $99/month for their basic plan.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 4,
      task_id: 2,
      title: 'Competitor B',
      content: 'Competitor B offers a free trial for 14 days.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 5,
      task_id: 3,
      title: 'Key Points',
      content: 'Highlight our unique selling points and the value we provide.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 6,
      task_id: 4,
      title: 'Error Log',
      content: 'Error message: "Invalid username or password."',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 7,
      task_id: 4,
      title: 'Possible Solution',
      content: 'Check the user authentication logic and database connection.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 8,
      task_id: 5,
      title: 'Topic Ideas',
      content: 'Time management techniques, prioritizing tasks, and avoiding distractions.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 9,
      task_id: 6,
      title: 'Understanding Knex Transactions',
      content: 'knex.transaction(): This is the Knex method that creates a new database transaction.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 22,
      task_id: null,
      title: 'Fuzzy Search (fuse.js)',
      content: 'Implemented fast search for notes and tasks.\n\nSteps:\n- Installed: npm install fuse.js\n- Configured Fuse.js to search titles, content, and tags.\n- Added a global search bar and CTRL+K command palette for quick navigation.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 23,
      task_id: null,
      title: 'Dark & Light Theme (React Context)',
      content: 'Used React Context API for theme state management.\n\nSteps:\n- Created ThemeProvider to manage theme state.\n- Wrapped app in ThemeProvider for persistence.\n- Added toggle switch for dynamic theme switching.',
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 24,
      task_id: null,
      title: 'Weekly Tasks',
      content: 'Monday:\n- Set up project structure\n- Initialize Git repo\n\nTuesday:\n- Create database schema\n- Set up Express routes\n\nWednesday:\n- Implement authentication\n- Add basic CRUD operations',
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  await knex('task_tags').insert([
    { id: 1, task_id: 1, tag_id: 7 },
    { id: 2, task_id: 1, tag_id: 2 },
    { id: 3, task_id: 4, tag_id: 17 },
    { id: 4, task_id: 4, tag_id: 18 },
    { id: 5, task_id: 6, tag_id: 19 },
    { id: 6, task_id: 6, tag_id: 20 },
    { id: 7, task_id: 8, tag_id: 13 },
    { id: 8, task_id: 9, tag_id: 13 },
    { id: 9, task_id: 10, tag_id: 13 },
    { id: 10, task_id: 12, tag_id: 25 },
    { id: 11, task_id: 13, tag_id: 24 },
    { id: 12, task_id: 16, tag_id: 7 },
    { id: 13, task_id: 17, tag_id: 13 },
    { id: 14, task_id: 18, tag_id: 13 },
    { id: 15, task_id: 20, tag_id: 13 }
  ]);

  await knex('note_tags').insert([
    { id: 1, note_id: 22, tag_id: 13 },
    { id: 2, note_id: 23, tag_id: 13 },
    { id: 3, note_id: 24, tag_id: 17 },
    { id: 4, note_id: 24, tag_id: 18 },
    { id: 5, note_id: 24, tag_id: 19 }
  ]);
}