export async function seed(knex) {
    await knex('task_tags').del();
  
    const tasks = await knex('tasks').select('id', 'title');
    const tags = await knex('tags').select('id', 'name');
  
    await knex('task_tags').insert([

      { task_id: tasks.find(t => t.title === 'Study for the Important Interview')?.id, tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id },
      { task_id: tasks.find(t => t.title === 'Study for the Important Interview')?.id, tag_id: tags.find(tag => tag.name === 'Morning Session')?.id },
      { task_id: tasks.find(t => t.title === 'Study for the Important Interview')?.id, tag_id: tags.find(tag => tag.name === 'Feeling Good')?.id },
      { task_id: tasks.find(t => t.title === 'Study for the Important Interview')?.id, tag_id: tags.find(tag => tag.name === '25min')?.id },
  

      { task_id: tasks.find(t => t.title === 'Prepare for the Important Meeting with Management')?.id, tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id },
      { task_id: tasks.find(t => t.title === 'Prepare for the Important Meeting with Management')?.id, tag_id: tags.find(tag => tag.name === 'Morning Session')?.id },
      { task_id: tasks.find(t => t.title === 'Prepare for the Important Meeting with Management')?.id, tag_id: tags.find(tag => tag.name === 'Feeling Good')?.id },
      { task_id: tasks.find(t => t.title === 'Prepare for the Important Meeting with Management')?.id, tag_id: tags.find(tag => tag.name === '50min')?.id },
  

      { task_id: tasks.find(t => t.title === 'Email Responses')?.id, tag_id: tags.find(tag => tag.name === 'Light Work')?.id },
      { task_id: tasks.find(t => t.title === 'Email Responses')?.id, tag_id: tags.find(tag => tag.name === 'Afternoon Session')?.id },
      { task_id: tasks.find(t => t.title === 'Email Responses')?.id, tag_id: tags.find(tag => tag.name === 'Feeling Tired')?.id },
      { task_id: tasks.find(t => t.title === 'Email Responses')?.id, tag_id: tags.find(tag => tag.name === '25min')?.id },
  

      { task_id: tasks.find(t => t.title === 'Organizing Notes')?.id, tag_id: tags.find(tag => tag.name === 'Light Work')?.id },
      { task_id: tasks.find(t => t.title === 'Organizing Notes')?.id, tag_id: tags.find(tag => tag.name === 'Afternoon Session')?.id },
      { task_id: tasks.find(t => t.title === 'Organizing Notes')?.id, tag_id: tags.find(tag => tag.name === 'Feeling Good')?.id },
      { task_id: tasks.find(t => t.title === 'Organizing Notes')?.id, tag_id: tags.find(tag => tag.name === '50min')?.id }
    ]);
  }
  