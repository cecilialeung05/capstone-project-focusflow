/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {

    await knex('tasks').del();
    await knex('tasks').insert([
      {
        id: 1,
        title: 'Plan Website Redesign',
        description: 'Outline the new design for the company website.',
        status: 'in progress',
        due_date: '2024-01-15',
      },
      {
        id: 2,
        title: 'Research Competitor Pricing',
        description: 'Analyze pricing strategies of key competitors.',
        status: 'open',
        due_date: '2023-12-20',
      },
      {
        id: 3,
        title: 'Prepare Presentation for Client',
        description: 'Create a compelling presentation for the potential client.',
        status: 'completed',
        due_date: '2023-11-10',
      },
      {
        id: 4,
        title: 'Fix Bug in User Authentication',
        description: 'Resolve the reported issue in the user login process.',
        status: 'blocked',
        due_date: null, 
      },
      {
        id: 5,
        title: 'Write Blog Post About Productivity Tips',
        description: 'Compose an informative blog post for the company blog.',
        status: 'open',
        due_date: '2023-12-31',
      },
    ]);
  }