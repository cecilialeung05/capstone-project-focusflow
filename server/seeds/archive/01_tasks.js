/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {

  await knex.raw('ALTER TABLE tasks AUTO_INCREMENT = 1');

  // Clear existing tasks before inserting
  await knex('tasks').del();

  // Insert new tasks with due_date
  await knex('tasks').insert([
      {
          id: 1,
          title: 'Plan Website Redesign',
          description: 'Outline the new design for the company website.',
          status: 'in_progress',
          priority: 'high',
          due_date: '2025-01-15',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 2,
          title: 'Market Research',
          description: 'Analyze competitors and evaluate pricing strategies.',
          status: 'completed',
          priority: 'medium',
          due_date: '2025-01-10',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 3,
          title: 'Brand Positioning',
          description: 'Determine unique selling points and key messaging for the project.',
          status: 'in_progress',
          priority: 'high',
          due_date: '2025-01-20',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 4,
          title: 'Authentication System',
          description: 'Implement user authentication with JWT and session management.',
          status: 'pending',
          priority: 'high',
          due_date: '2025-01-25',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 5,
          title: 'Content Strategy',
          description: 'Plan and organize content for marketing and outreach.',
          status: 'pending',
          priority: 'low',
          due_date: '2025-02-01',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 6,
          title: 'Database Transactions',
          description: 'Implement and optimize database transactions using Knex.js.',
          status: 'completed',
          priority: 'medium',
          due_date: '2025-02-05',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 7,
          title: 'API Development',
          description: 'Create RESTful API endpoints for tasks, notes, and users.',
          status: 'in_progress',
          priority: 'high',
          due_date: '2025-02-10',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 8,
          title: 'Frontend Component Structure',
          description: 'Set up reusable React components and layout structure.',
          status: 'in_progress',
          priority: 'medium',
          due_date: '2025-02-12',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 9,
          title: 'Theme Implementation',
          description: 'Add light/dark mode with React Context API.',
          status: 'completed',
          priority: 'low',
          due_date: '2025-02-14',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 10,
          title: 'Fuzzy Search Implementation',
          description: 'Integrate Fuse.js for fast and flexible search capabilities.',
          status: 'pending',
          priority: 'medium',
          due_date: '2025-02-18',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 11,
          title: 'Task Filtering and Tagging',
          description: 'Implement filtering options based on task priority, status, and tags.',
          status: 'pending',
          priority: 'high',
          due_date: '2025-02-20',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 12,
          title: 'Drag and Drop Functionality',
          description: 'Enable users to reorder tasks and move notes between tasks.',
          status: 'in_progress',
          priority: 'high',
          due_date: '2025-02-22',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 13,
          title: 'Graph Visualization',
          description: 'Display task relationships using react-force-graph and Recharts.',
          status: 'pending',
          priority: 'medium',
          due_date: '2025-02-24',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 14,
          title: 'Final Testing and Debugging',
          description: 'Conduct thorough testing and fix major bugs before deployment.',
          status: 'pending',
          priority: 'high',
          due_date: '2025-02-26',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 15,
          title: 'Deployment',
          description: 'Deploy the application and set up continuous integration (CI/CD).',
          status: 'pending',
          priority: 'high',
          due_date: '2025-02-28',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 16,
          title: 'Weekly Tasks',
          description: 'Plan and organize weekly development tasks for the project.',
          status: 'in_progress',
          priority: 'high',
          due_date: '2025-03-01',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 17,
          title: 'Dark & Light Theme (React Context)',
          description: 'Implement a theme toggle using React Context API.',
          status: 'completed',
          priority: 'medium',
          due_date: '2025-02-22',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 18,
          title: 'Fuzzy Search (fuse.js)',
          description: 'Add a fast search for tasks and notes using Fuse.js.',
          status: 'pending',
          priority: 'medium',
          due_date: '2025-02-25',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 19,
          title: 'Layout Folder Structure',
          description: 'Refactor UI components into a structured layout directory.',
          status: 'completed',
          priority: 'medium',
          due_date: '2025-02-19',
          created_at: new Date(),
          updated_at: new Date()
      },
      {
          id: 20,
          title: 'Resizable Components (react-resizable-box)',
          description: 'Allow users to resize UI components dynamically.',
          status: 'pending',
          priority: 'medium',
          due_date: '2025-02-28',
          created_at: new Date(),
          updated_at: new Date()
      }
  ]);
}
