export async function seed(knex) {
  // Clear existing entries
  await knex('tasks').del();

  // Insert tasks
  await knex('tasks').insert([
    {
      title: 'Complete Project Proposal',
      description: 'Draft and finalize the Q2 project proposal for client review',
      status: 'in progress',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    {
      title: 'Daily Meditation Session',
      description: 'Practice mindfulness meditation for 20 minutes',
      status: 'open',
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000) // tomorrow
    },
    {
      title: 'JavaScript Advanced Concepts',
      description: 'Study async/await, promises, and error handling',
      status: 'in progress',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    {
      title: 'Weekly Review',
      description: 'Review weekly goals and plan next week',
      status: 'open',
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    },
    {
      title: 'Gym Workout',
      description: 'Complete strength training routine',
      status: 'completed',
      due_date: new Date() // today
    }
  ]);
}