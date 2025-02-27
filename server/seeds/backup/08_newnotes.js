export async function seed(knex) {

    await knex('notes').del();
  
    await knex('notes').insert([
      {
        title: 'Meeting Notes: Client Kickoff',
        content: 'Discussed project roadmap and key deliverables.'
      },
      {
        title: 'Brainstorm: Marketing Ideas',
        content: '1. Webinars\n2. Social Media Ads\n3. Influencer Collaborations'
      },
      {
        title: 'Personal Goals for This Month',
        content: '1. Read 3 books\n2. Exercise 4x per week\n3. Improve React skills'
      }
    ]);
  }
  