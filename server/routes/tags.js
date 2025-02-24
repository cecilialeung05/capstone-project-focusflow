router.get('/all', async (req, res) => {
  try {
    const tags = await knex('tags').select('*');
    const notes = await knex('notes').select('*');
    const tasks = await knex('tasks').select('*');
    
    // Get relationships
    const note_tags = await knex('note_tags').select('*');
    const task_tags = await knex('task_tags').select('*');

    // Add relationships to the objects
    const notesWithTags = notes.map(note => ({
      ...note,
      note_tags: note_tags.filter(nt => nt.note_id === note.id)
    }));

    const tasksWithTags = tasks.map(task => ({
      ...task,
      task_tags: task_tags.filter(tt => tt.task_id === task.id)
    }));

    console.log('Sending data:', { // Debug log
      tags,
      notes: notesWithTags,
      tasks: tasksWithTags
    });

    res.json({
      tags,
      notes: notesWithTags,
      tasks: tasksWithTags
    });
  } catch (error) {
    console.error('Error fetching all data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}); 