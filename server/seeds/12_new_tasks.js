export async function seed(knex) {
    await knex('tasks').del();
  
    await knex('tasks').insert([
      {
        title: 'Study for the Important Interview',
        description: 'Reviewed key concepts and solved practice questions. Felt focused and productive.',
        status: 'completed',
        due_date: new Date() 
      },
      {
        title: 'Prepare for the Important Meeting with Management',
        description: 'Prepared slides and notes. Stayed engaged throughout. Could have used an extra break.',
        status: 'completed',
        due_date: new Date()
      },
      {
        title: 'Email Responses',
        description: 'Cleared inbox and followed up on pending messages. Energy dipped after 20 minutes.',
        status: 'completed',
        due_date: new Date()
      },
      {
        title: 'Organizing Notes',
        description: 'Reorganized project notes and created summaries. Was a bit distracted but got it done.',
        status: 'completed',
        due_date: new Date()
      }
    ]);
  }
  