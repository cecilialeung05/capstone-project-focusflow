export async function seed(knex) {
  await knex('note_tags').del();

  const notes = await knex('notes').select('id', 'title');
  const tags = await knex('tags').select('id', 'name');

  await knex('note_tags').insert([
    // 🔹 Notes for Deep Focus Sessions
    {
      note_id: notes.find(n => n.title === 'Code Review Takeaways')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Code Review Takeaways')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Good')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Report Drafting Insights')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Report Drafting Insights')?.id,
      tag_id: tags.find(tag => tag.name === 'Afternoon Session')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Interview Prep Notes')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Interview Prep Notes')?.id,
      tag_id: tags.find(tag => tag.name === 'Morning Session')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Meeting Preparation Notes')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Meeting Preparation Notes')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Tired')?.id
    },

    // 🔹 Notes for Light Work Sessions
    {
      note_id: notes.find(n => n.title === 'Email Drafting Strategy')?.id,
      tag_id: tags.find(tag => tag.name === 'Light Work')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Email Drafting Strategy')?.id,
      tag_id: tags.find(tag => tag.name === 'Morning Session')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Notes Organization Plan')?.id,
      tag_id: tags.find(tag => tag.name === 'Light Work')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Notes Organization Plan')?.id,
      tag_id: tags.find(tag => tag.name === 'Afternoon Session')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Weekly Review Checklist')?.id,
      tag_id: tags.find(tag => tag.name === 'Light Work')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Weekly Review Checklist')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Good')?.id
    },

    // 🔹 Notes for Brainstorming & Reflections
    {
      note_id: notes.find(n => n.title === 'Brainstorming: Startup Ideas')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Deep Work Key Takeaways')?.id,
      tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Deep Work Key Takeaways')?.id,
      tag_id: tags.find(tag => tag.name === 'Morning Session')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Why Do Ideas Hit at Night?')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Tired')?.id
    },
    {
      note_id: notes.find(n => n.title === 'Why Do Ideas Hit at Night?')?.id,
      tag_id: tags.find(tag => tag.name === 'Afternoon Session')?.id
    },

    {
      note_id: notes.find(n => n.title === 'Midnight Thought Log')?.id,
      tag_id: tags.find(tag => tag.name === 'Feeling Tired')?.id
    }
  ]);
}
