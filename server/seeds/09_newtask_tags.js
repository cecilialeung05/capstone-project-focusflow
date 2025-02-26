export async function seed(knex) {
    // Clear existing entries
    await knex('task_tags').del();
  
    // Get references
    const tasks = await knex('tasks').select('id', 'title');
    const tags = await knex('tags').select('id', 'name');
  
    // Insert task-tag relationships
    await knex('task_tags').insert([
      // Focus Session: Code Review
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Code Review').id,
        tag_id: tags.find(tag => tag.name === 'Duration: 25min').id
      },
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Code Review').id,
        tag_id: tags.find(tag => tag.name === 'Energy: 8').id
      },
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Code Review').id,
        tag_id: tags.find(tag => tag.name === 'Morning Session').id
      },
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Code Review').id,
        tag_id: tags.find(tag => tag.name === 'Deep Work').id
      },
  
      // Focus Session: Deep Work on Client Report
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Deep Work on Client Report').id,
        tag_id: tags.find(tag => tag.name === 'Duration: 50min').id
      },
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Deep Work on Client Report').id,
        tag_id: tags.find(tag => tag.name === 'Energy: 5').id
      },
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Deep Work on Client Report').id,
        tag_id: tags.find(tag => tag.name === 'Afternoon Session').id
      },
      {
        task_id: tasks.find(t => t.title === 'Focus Session: Deep Work on Client Report').id,
        tag_id: tags.find(tag => tag.name === 'Deep Work').id
      }
    ]);
  }
  