export async function seed(knex) {
  // Clear existing entries
  await knex('tags').del();

  // Insert tags
  await knex('tags').insert([
    { name: 'High Priority'},
    { name: 'Medium Priority'},
    { name: 'Low Priority'},
    { name: 'Work'},
    { name: 'Personal'},
    { name: 'Study'},
    { name: 'Health'},
    { name: 'Quick Win'},
    { name: 'Deep Focus'},
    { name: 'Project'}
  ]);
}