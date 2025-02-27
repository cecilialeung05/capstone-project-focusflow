export async function seed(knex) {
    await knex('notes').del();
  
    const tasks = await knex('tasks').select('id', 'title');
  
    await knex('notes').insert([
      {
        task_id: tasks.find(t => t.title === 'Study for the Important Interview')?.id || null,
        title: 'Interview Preparation Notes',
        content: 'Key areas to focus on: Behavioral questions, Technical concepts, Case study practice, STAR method.'
      },
      {
        task_id: tasks.find(t => t.title === 'Prepare for the Important Meeting with Management')?.id || null,
        title: 'Meeting Talking Points',
        content: 'Agenda: Key project updates, Roadblocks and dependencies, Next steps, Q&A session with executives.'
      },
      {
        task_id: tasks.find(t => t.title === 'Email Responses')?.id || null,
        title: 'Priority Emails to Respond To',
        content: 'Follow up with client, Confirm meeting schedule, Update manager on deliverables, Respond to invoice inquiry.'
      },
      {
        task_id: tasks.find(t => t.title === 'Organizing Notes')?.id || null,
        title: 'Structured Notes System',
        content: 'Plan for organizing notes: Create tags for priority levels, Use separate categories, Implement a review process.'
      },
      {
        task_id: null,
        title: 'Random Thoughts at Midnight',
        content: 'Why do we always get the best ideas when we’re supposed to be sleeping?'
      },
      {
        task_id: null,
        title: 'Mindfulness Reflections',
        content: 'Today, I felt present and engaged while working. My focus increased after deep breathing exercises.'
      }
    ]);
  }
  