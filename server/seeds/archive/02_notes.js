/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {

  await knex.raw('ALTER TABLE notes AUTO_INCREMENT = 1');

  await knex('notes').del();

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

  await knex('notes_tags').del();
  await knex('notes_tags').insert([
      { note_id: 22, tag_id: 13 }, 
      { note_id: 23, tag_id: 13 }, 
      { note_id: 24, tag_id: 17 }, 
      { note_id: 24, tag_id: 18 }, 
      { note_id: 24, tag_id: 19 }  
  ]);
}
