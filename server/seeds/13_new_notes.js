export async function seed(knex) {

  // Fetch existing tasks to ensure notes link correctly
  const tasks = await knex('tasks').select('id', 'title');

  await knex('notes').insert([
    // Notes for Focus Sessions
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Project Review')?.id,
      title: 'Code Review Takeaways',
      content: 'Noticed common patterns in code reviews. I should write a style guide for the team.'
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Writing Report')?.id,
      title: 'Report Drafting Insights',
      content: 'The first half went smoothly, but I got distracted midway. Next time, I’ll outline more clearly.'
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Study for that Important Interview')?.id,
      title: 'Interview Prep Notes',
      content: 'Reviewed key technical concepts. Focused best in the morning.'
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Prepare for that nerve-wracking meeting with Management')?.id,
      title: 'Meeting Preparation Notes',
      content: 'Compiled main discussion points. Could benefit from extra preparation time next time.'
    },

    // Notes for Light Work Sessions
    {
      task_id: tasks.find(t => t.title === 'Light Work: Craft up those Email Responses')?.id,
      title: 'Email Drafting Strategy',
      content: 'Prioritized urgent emails first. Found it effective in the morning session.'
    },
    {
      task_id: tasks.find(t => t.title === 'Light Work: Organizing Notes')?.id,
      title: 'Notes Organization Plan',
      content: 'Sorted meeting notes into categories. Helped with future retrieval.'
    },
    {
      task_id: tasks.find(t => t.title === 'Light Work: Weekly Review & Planning')?.id,
      title: 'Weekly Review Checklist',
      content: 'Biggest distractions: Social media & meetings. Most productive time: Morning before 11 AM.'
    },

    // General Brainstorming & Reflections
    {
      task_id: tasks.find(t => t.title === 'Brainstorming: Future Business Ideas')?.id,
      title: 'Brainstorming: Startup Ideas',
      content: 'Jotted down new app concepts. Need to refine them further.'
    },
    {
      task_id: tasks.find(t => t.title === 'Book Summary: Deep Work by Cal Newport')?.id,
      title: 'Deep Work Key Takeaways',
      content: 'Eliminating distractions improves focus. Implementing strict deep work blocks is key.'
    },
    {
      task_id: tasks.find(t => t.title === 'Random Thought at Midnight')?.id,
      title: 'Why Do Ideas Hit at Night?',
      content: 'Is it because the mind is more relaxed? Less external stimulation? Might be worth exploring.'
    }, 
    {
      task_id: tasks.find(t => t.title === 'Random Thought at Midnight')?.id,
      title: 'Midnight Thought Log',
      content: 'Best ideas come when I should be sleeping. Why is that?'
    },
    {
      title: 'Mindfulness Reflections',
      content: 'Today, I felt present while working. Noticed my focus increased after deep breathing exercises.'
    }, 
    {
      title: 'Morning Routine Checklist',
      content: 'Wake up at 7 AM... maybe? 30-minute exercise - we will see..! Plan top 3 priorities for the day - I should atleast try to do that.'
    },
    {
      title: 'Weekly Review Template - save this copy',
      content: '1. What went well this week? 2. What needs improvement? - 3. What were my top 3 distractions? - 4. How did my energy levels fluctuate?'
    },
  ]);
}
