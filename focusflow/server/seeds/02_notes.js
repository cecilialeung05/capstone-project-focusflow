/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex('notes').del();
    await knex('notes').insert([
      {
        id: 1,
        task_id: 1,
        title: 'Initial Ideas',
        content: 'Brainstorming session notes: focus on a modern, clean design with improved user experience.',
      },
      {
        id: 2,
        task_id: 1,
        title: 'Color Palette',
        content: 'Proposed color scheme: shades of blue and gray with a vibrant accent color.',
      },
      {
        id: 3,
        task_id: 2,
        title: 'Competitor A',
        content: 'Competitor A charges $99/month for their basic plan.',
      },
      {
        id: 4,
        task_id: 2,
        title: 'Competitor B',
        content: 'Competitor B offers a free trial for 14 days.',
      },
      {
        id: 5,
        task_id: 3,
        title: 'Key Points',
        content: 'Highlight our unique selling points and the value we provide.',
      },
      {
        id: 6,
        task_id: 4,
        title: 'Error Log',
        content: 'Error message: "Invalid username or password."',
      },
       {
        id: 7,
        task_id: 4,
        title: 'Possible Solution',
        content: 'Check the user authentication logic and database connection.',
      },
      {
        id: 8,
        task_id: 5,
        title: 'Topic Ideas',
        content: 'Time management techniques, prioritizing tasks, and avoiding distractions.',
      },
    ]);
  }