export async function seed(knex) {
    await knex('tags').del();
  
    await knex('tags').insert([
      { name: 'Deep Focus' }, 
      { name: 'Light Work' }, 
      { name: 'Feeling Good' }, 
      { name: 'Feeling Tired' }, 
      { name: 'Morning Session' }, 
      { name: 'Afternoon Session' }, 
      { name: '25min' }, 
      { name: '50min' } 
    ]);
  }
  