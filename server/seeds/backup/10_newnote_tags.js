export async function seed(knex) {

    await knex('note_tags').del();
  
    await knex('notes').insert([
      { title: 'Meeting Notes: AI Project Planning', content: '1. Define the scope of AI automation.\n2. Establish data sources.\n3. Assign model training responsibilities.\n4. Prototype first MVP within 3 sprints.' },
      { title: 'JavaScript Async/Await Guide', content: 'Key takeaways:\n- Always use try/catch in async functions.\n- Avoid deep nesting with promise chaining.\n- Use async/await for cleaner code.\n- Fetch API works better with async/await than .then().' },
      { title: 'Book Summary: Deep Work by Cal Newport', content: 'Core ideas:\n1. High-quality work requires deep focus.\n2. Reduce distractions by setting strict work blocks.\n3. Train your brain to work longer without switching tasks.\n4. Social media can be harmful to productivity.' },
      { title: 'Weekly Review Template', content: '1. What went well this week?\n2. What needs improvement?\n3. What were my top 3 distractions?\n4. How did my energy levels fluctuate?\n5. What will I prioritize next week?' },
      { title: 'Morning Routine Checklist', content: 'Wake up at 7 AM\n10-minute meditation\n30-minute exercise\nRead for 15 minutes\nPlan top 3 priorities for the day' },
      { title: 'Pomodoro Productivity Log', content: 'Session 1: 25 min - Writing Report\nSession 2: 25 min - Reviewing PRs\nBreak: 5 min - Coffee & stretch\nSession 3: 25 min - Email replies (energy low)\nSession 4: 25 min - Deep Work (best focus)' },
      { title: 'Brainstorming: Future Business Ideas', content: '1. AI-powered focus tracker\n2. Gamified habit-building app\n3. Virtual coworking space\n4. Subscription-based life organization tool' },
      { title: 'Random Thoughts at Midnight', content: 'Why do we always get the best ideas when we’re supposed to be sleeping?' },
      { title: 'Mindfulness Reflections', content: 'Today, I felt present and engaged while working. Noticed my focus increased after deep breathing exercises.' }
    ]);
  
    const insertedNotes = await knex('notes').select('id', 'title');
  
    const tags = await knex('tags').select('id', 'name');
  
    const noteTagRelationships = [
      { noteTitle: 'Meeting Notes: AI Project Planning', tagName: 'Work' },
      { noteTitle: 'JavaScript Async/Await Guide', tagName: 'Study' },
      { noteTitle: 'Book Summary: Deep Work by Cal Newport', tagName: 'Deep Focus' },
  
      { noteTitle: 'Weekly Review Template', tagName: 'Work' },
      { noteTitle: 'Morning Routine Checklist', tagName: 'Personal' },
      { noteTitle: 'Pomodoro Productivity Log', tagName: 'Deep Focus' },
  
      { noteTitle: 'Brainstorming: Future Business Ideas', tagName: 'Project' },
      { noteTitle: 'Random Thoughts at Midnight', tagName: 'Personal' },
      { noteTitle: 'Mindfulness Reflections', tagName: 'Health' }
    ];
  
    const noteTags = noteTagRelationships.map(({ noteTitle, tagName }) => {
      const note = insertedNotes.find(n => n.title === noteTitle);
      const tag = tags.find(t => t.name === tagName);
      return note && tag ? { note_id: note.id, tag_id: tag.id } : null;
    }).filter(entry => entry !== null); 
  
    await knex('note_tags').insert(noteTags);
  }
  