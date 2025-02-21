export async function seed(knex) {
    // Clear existing data
    await knex('task_tags').del();
    await knex('note_tags').del();
    await knex('notes').del();
    await knex('tasks').del();
    await knex('tags').del();
  
    // Insert tags
    await knex('tags').insert([
      { id: 1, name: 'Urgent' },
      { id: 2, name: 'Work' },
      { id: 3, name: 'Personal' },
      { id: 4, name: 'Study' },
      { id: 5, name: 'Healthy' },
      { id: 6, name: 'Meeting' },
      { id: 7, name: 'Project' },
      { id: 8, name: 'Ideas' },
      { id: 9, name: 'Goals' },
      { id: 10, name: 'Shopping' },
      { id: 11, name: 'Travel' },
      { id: 12, name: 'Family' },
      { id: 13, name: 'React' },
      { id: 14, name: 'React Router DOM' },
      { id: 15, name: 'Axios' },
      { id: 16, name: 'Sass' },
      { id: 17, name: 'Node.js' },
      { id: 18, name: 'Express.js' },
      { id: 19, name: 'Knex.js' },
      { id: 20, name: 'MySQL' },
      { id: 21, name: 'dotenv' },
      { id: 22, name: 'CORS' },
      { id: 23, name: 'Framer Motion' },
      { id: 24, name: 'Recharts' },
      { id: 25, name: 'React-Beautiful-DND' }
    ]);
  
    // Insert tasks
    await knex('tasks').insert([
      { 
        id: 1,
        title: 'Plan Website Redesign',
        description: 'Outline the new design for the company website.',
        status: 'in progress',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 2,
        title: 'Research Competitor Pricing',
        description: 'Analyze pricing strategies of key competitors.',
        status: 'open',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 3,
        title: 'Prepare Presentation for Client',
        description: 'Create a compelling presentation for the potential client.',
        status: 'completed',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 4,
        title: 'Fix Bug in User Authentication',
        description: 'Resolve the reported issue in the user login process.',
        status: 'blocked',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 5,
        title: 'Write Blog Post About Productivity Tips',
        description: 'Compose an informative blog post for the company blog.',
        status: 'open',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 6,
        title: 'Review React core concepts',
        description: 'Focus on understanding hooks, context, and services.',
        status: 'open',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 7,
        title: 'Master React Hooks ⚛️',
        description: 'Finally understand `useEffect` instead of just referring to past projects.',
        status: 'in progress',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 8,
        title: 'Read That One Article You Saved',
        description: 'You bookmarked it 3 months ago. Time to read it.',
        status: 'open',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 9,
        title: 'Deploy an App Without Googling',
        description: 'Try deploying to Vercel *without* 1000 Chrome tabs open.',
        status: 'open',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      }
    ]);
  
    // Insert notes
    await knex('notes').insert([
      { 
        id: 1,
        task_id: 1,
        title: 'Updated Project Stack',
        content: 'Note content here', // You'll need to provide the actual content
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 2,
        task_id: 1,
        title: 'Color Palette',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 3,
        task_id: 2,
        title: 'Competitor A',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 4,
        task_id: 2,
        title: 'Competitor B',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 5,
        task_id: 3,
        title: 'Key Points',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 6,
        task_id: 4,
        title: 'Error Log',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 7,
        task_id: 4,
        title: 'Possible Solution',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 8,
        task_id: 5,
        title: 'Topic Ideas',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 9,
        task_id: 6,
        title: 'Understanding Knex Transactions',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 11,
        task_id: 4,
        title: 'Debugging User Authentication Issues',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 12,
        task_id: 4,
        title: 'Debugging User Authentication Issues',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 13,
        task_id: null,
        title: 'Nice to Haves for Capstone',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 14,
        task_id: null,
        title: 'Future Implementations',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 15,
        task_id: null,
        title: 'Week 2 Development Plan',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 16,
        task_id: null,
        title: 'Week 1 Development Plan',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 17,
        task_id: null,
        title: 'Week 1 Development Plan',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 18,
        task_id: null,
        title: 'Drag and Drop (react-beautiful-dnd)',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 19,
        task_id: null,
        title: 'Graph Visualization (react-force-graph)',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 20,
        task_id: null,
        title: 'Resizable Components (react-resizable-box)',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 21,
        task_id: null,
        title: 'Layout Folder Structure',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 22,
        task_id: null,
        title: 'Fuzzy Search (fuse.js)',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 23,
        task_id: null,
        title: 'Dark & Light Theme (React Context)',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      },
      { 
        id: 24,
        task_id: null,
        title: 'Weekly Tasks',
        content: 'Note content here',
        created_at: knex.fn.now(),
        updated_at: knex.fn.now()
      }
    ]);
  
    // Insert task_tags relationships
    await knex('task_tags').insert([
      { id: 5, task_id: 8, tag_id: 2 },
      { id: 8, task_id: 7, tag_id: 19 },
      { id: 9, task_id: 1, tag_id: 17 },
      { id: 10, task_id: 1, tag_id: 15 },
      { id: 11, task_id: 9, tag_id: 6 },
      { id: 12, task_id: 9, tag_id: 8 },
      { id: 13, task_id: 9, tag_id: 7 }
    ]);
  }