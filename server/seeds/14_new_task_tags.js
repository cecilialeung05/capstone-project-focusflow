export async function seed(knex) {
  await knex('task_tags').del();

  // Fetch tasks & tags to correctly link them
  const tasks = await knex('tasks').select('id', 'title');
  const tags = await knex('tags').select('id', 'name');

  await knex('task_tags').insert([
    // 🔹 Deep Focus Tasks (25min - High Energy, Morning Session)
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Project Review')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Writing Report')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Study for that Important Interview')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Prepare for that nerve-wracking meeting with Management')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },

    // 🔹 Light Work Tasks (25min - Lighter Energy)
    {
      task_id: tasks.find(t => t.title === 'Light Work: Craft up those Email Responses')?.id,
      tag_id: tags.find(tag => tag.name === 'Light Work')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Light Work: Organizing Notes')?.id,
      tag_id: tags.find(tag => tag.name === 'Light Work')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Light Work: Weekly Review & Planning')?.id,
      tag_id: tags.find(tag => tag.name === 'Light Work')?.id
    },

    // 🔹 Time of Day Categorization
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Project Review')?.id,
      tag_id: tags.find(tag => tag.name === 'Morning Session')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Writing Report')?.id,
      tag_id: tags.find(tag => tag.name === 'Afternoon Session')?.id
    },

    // 🔹 Energy Level Categorization
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Project Review')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Good')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Focus Session: Writing Report')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Tired')?.id
    },

    // 🔹 Random Tasks / Personal Reflections
    {
      task_id: tasks.find(t => t.title === 'Brainstorming: Future Business Ideas')?.id,
      tag_id: tags.find(tag => tag.name === 'Morning Session')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Book Summary: Deep Work by Cal Newport')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      task_id: tasks.find(t => t.title === 'Random Thought at Midnight')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Tired')?.id
    }
  ]);
}
