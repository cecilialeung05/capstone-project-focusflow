export async function seed(knex) {
    await knex('note_tags').del();
  
    const notes = await knex('notes').select('id', 'title');
    const tags = await knex('tags').select('id', 'name');
  
    await knex('note_tags').insert([
  
      { note_id: notes.find(n => n.title === 'Interview Preparation Notes')?.id, tag_id: tags.find(tag => tag.name === 'Deep Focus')?.id },
  
   
      { note_id: notes.find(n => n.title === 'Meeting Talking Points')?.id, tag_id: tags.find(tag => tag.name === 'Light Work')?.id },
  

      { note_id: notes.find(n => n.title === 'Priority Emails to Respond To')?.id, tag_id: tags.find(tag => tag.name === 'Afternoon Session')?.id },
  
    
      { note_id: notes.find(n => n.title === 'Structured Notes System')?.id, tag_id: tags.find(tag => tag.name === 'Morning Session')?.id },
  

      { note_id: notes.find(n => n.title === 'Random Thoughts at Midnight')?.id, tag_id: tags.find(tag => tag.name === 'Feeling Tired')?.id },
      { note_id: notes.find(n => n.title === 'Mindfulness Reflections')?.id, tag_id: tags.find(tag => tag.name === 'Feeling Good')?.id }
    ]);
  }
  