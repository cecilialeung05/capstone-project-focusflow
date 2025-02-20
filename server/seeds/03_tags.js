export async function seed(knex) {
    // Delete existing entries
    await knex('tags').del();
    
    // Insert seed entries
    await knex('tags').insert([
      { id: 1, name: 'Urgent' },
      { id: 2, name: 'Work' },
      { id: 3, name: 'Personal' },
      { id: 4, name: 'Study' },
      { id: 5, name: 'Health' },
      { id: 6, name: 'Meeting' },
      { id: 7, name: 'Project' },
      { id: 8, name: 'Ideas' },
      { id: 9, name: 'Goals' },
      { id: 10, name: 'Shopping' },
      { id: 11, name: 'Travel' },
      { id: 12, name: 'Family' }
    ]);
  }