export async function seed(knex) {

  await knex('notes').del();


  const tasks = await knex('tasks').select('id', 'title');
  

  await knex('notes').insert([
    {
      task_id: tasks.find(t => t.title === 'Complete Project Proposal').id,
      title: 'Project Requirements',
      content: 'Key requirements:\n- User authentication\n- Dashboard analytics\n- Export functionality\n- Mobile responsive design'
    },
    {
      task_id: tasks.find(t => t.title === 'JavaScript Advanced Concepts').id,
      title: 'Learning Resources',
      content: 'Useful links:\n- MDN Documentation\n- JavaScript.info\n- Udemy Course Section 5'
    },
    {
      task_id: tasks.find(t => t.title === 'Weekly Review').id,
      title: 'Review Template',
      content: 'Weekly Review Checklist:\n1. Review completed tasks\n2. Update project status\n3. Plan next week priorities\n4. Check upcoming deadlines'
    }
  ]);
}