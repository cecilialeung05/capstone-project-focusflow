export async function seed(knex) {
  
    await knex('tasks').insert([
      {
        title: 'Focus Session: Project Review',
        description: 'Completed 3 PR reviews with good focus.',
        status: 'completed',
        due_date: new Date(),
      },
      {
        title: 'Focus Session: Writing Report',
        description: 'Struggled with focus in the second half.',
        status: 'open',
        due_date: new Date(),
      },
      {
        title: 'Focus Session: Study for that Important Interview',
        description: 'Reviewed key concepts and solved practice questions. Felt focused and productive.',
        status: 'open',
        due_date: new Date() 
      },
      {
        title: 'Focus Session: Prepare for that nerve-wracking meeting with Management',
        description: 'Prepared slides and notes. Stayed engaged throughout. Could have used an extra break.',
        status: 'completed',
        due_date: new Date()
      },
      {
        title: 'Light Work: Craft up those Email Responses',
        description: 'Cleared inbox and followed up on pending messages. Energy dipped after 20 minutes.',
        status: 'open',
        due_date: new Date()
      },
      {
        title: 'Light Work: Organizing Notes',
        description: 'Reorganized project notes and created summaries. Was a bit distracted but got it done.',
        status: 'completed',
        due_date: new Date()
      },
      {
        title: 'Light Work: Weekly Review & Planning',
        description: 'Review goals, analyze distractions, and plan next steps.',
        status: 'open',
        due_date: new Date(),
      },
      { title: 'Brainstorming: Future Business Ideas', description: 'Jot down potential startup ideas and side projects.', status: 'open', due_date: new Date() },
      { title: 'Book Summary: Deep Work by Cal Newport', description: 'Summarize key takeaways from the book Deep Work.', status: 'open', due_date: new Date() },
      { title: 'Random Thought at Midnight', description: 'Why do the best ideas come when I should be sleeping?', status: 'open', due_date: new Date() },
    ]);
  }
  