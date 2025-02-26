export async function seed(knex) {

  await knex('task_tags').del();


  const tasks = await knex('tasks').select('id', 'title');
  const tags = await knex('tags').select('id', 'name');


  await knex('task_tags').insert([
    {
      task_id: tasks.find(t => t.title === 'Complete Project Proposal').id,
      tag_id: tags.find(tag => tag.name === 'High Priority').id
    },
    {
      task_id: tasks.find(t => t.title === 'Complete Project Proposal').id,
      tag_id: tags.find(tag => tag.name === 'Work').id
    },
    {
      task_id: tasks.find(t => t.title === 'Daily Meditation Session').id,
      tag_id: tags.find(tag => tag.name === 'Personal').id
    },
    {
      task_id: tasks.find(t => t.title === 'Daily Meditation Session').id,
      tag_id: tags.find(tag => tag.name === 'Health').id
    },
    {
      task_id: tasks.find(t => t.title === 'JavaScript Advanced Concepts').id,
      tag_id: tags.find(tag => tag.name === 'Study').id
    },
    {
      task_id: tasks.find(t => t.title === 'JavaScript Advanced Concepts').id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus').id
    }
  ]);
}