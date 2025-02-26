export async function seed(knex) {
    // Clear existing entries
    await knex('tasks').del();
  
    // Insert tasks (traditional tasks & focus sessions)
    await knex('tasks').insert([
      // Normal Tasks
      {
        title: 'Complete Project Proposal',
        description: 'Draft and finalize the Q2 project proposal for client review.',
        status: 'in progress',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        title: 'Daily Meditation Session',
        description: 'Practice mindfulness meditation for 20 minutes.',
        status: 'open',
        due_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
      },
      {
        title: 'Weekly Review',
        description: 'Review weekly goals and plan next week.',
        status: 'open',
        due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
      },
      
      // Focus Sessions
      {
        title: 'Focus Session: Code Review',
        description: 'Felt very productive. Completed 3 PR reviews efficiently.',
        status: 'completed',
        due_date: new Date() // today
      },
      {
        title: 'Focus Session: Deep Work on Client Report',
        description: 'Struggled with concentration in the second half. Will try a break next time.',
        status: 'completed',
        due_date: new Date() // today
      }
    ]);
  }
  