export async function seed(knex) {

    await knex('tags').del();
  
    await knex('tags').insert([
      { name: 'High Priority' },
      { name: 'Medium Priority' },
      { name: 'Low Priority' },
      { name: 'Work' },
      { name: 'Personal' },
      { name: 'Study' },
      { name: 'Health' },
      { name: 'Quick Win' },
      { name: 'Deep Focus' },
      { name: 'Project' },
      { name: 'Energy: 8' },
      { name: 'Energy: 5' },
      { name: 'Energy: 3' },
      { name: 'Duration: 25min' },
      { name: 'Duration: 50min' },
      { name: 'Morning Session' },
      { name: 'Afternoon Session' },
      { name: 'Evening Session' },
      { name: 'Deep Work' },
      { name: 'Admin Work' }
    ]);
  }
  