/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex('tags').del(); 
  await knex.raw('ALTER TABLE tags AUTO_INCREMENT = 1'); 

  await knex('tags').insert([
    { name: 'Urgent' },
    { name: 'Work' },
    { name: 'Personal' },
    { name: 'Study' },
    { name: 'Healthy' },
    { name: 'Meeting' },
    { name: 'Project' },
    { name: 'Ideas' },
    { name: 'Goals' },
    { name: 'Shopping' },
    { name: 'Travel' },
    { name: 'Family' },
    { name: 'React' },
    { name: 'React Router DOM' },
    { name: 'Axios' },
    { name: 'Sass' },
    { name: 'Node.js' },
    { name: 'Express.js' },
    { name: 'Knex.js' },
    { name: 'MySQL' },
    { name: 'dotenv' },
    { name: 'CORS' },
    { name: 'Framer Motion' },
    { name: 'Recharts' },
    { name: 'React-Beautiful-DND' }
  ]);
}
