export async function seed(knex) {
  // Clear existing entries
  await knex('note_tags').del();

  // Get references
  const notes = await knex('notes').select('id', 'title');
  const tags = await knex('tags').select('id', 'name');

  // Insert note-tag relationships
  await knex('note_tags').insert([
    {
      note_id: notes.find(n => n.title === 'Project Requirements').id,
      tag_id: tags.find(tag => tag.name === 'Project').id
    },
    {
      note_id: notes.find(n => n.title === 'Learning Resources').id,
      tag_id: tags.find(tag => tag.name === 'Study').id
    },
    {
      note_id: notes.find(n => n.title === 'Review Template').id,
      tag_id: tags.find(tag => tag.name === 'Work').id
    }
  ]);
}