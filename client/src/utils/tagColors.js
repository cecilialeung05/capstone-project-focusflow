// Create a mapping of tag categories to colors
export const tagColorMap = {
  // Technical Stack
  'React': '#61dafb',
  'React Router DOM': '#ca4245',
  'Axios': '#5a29e4',
  'Sass': '#cc6699',
  'Node.js': '#339933',
  'Express.js': '#000000',
  'Knex.js': '#e16426',
  'MySQL': '#4479a1',
  
  // Project Features
  'Authentication': '#ff6b6b',
  'UI/UX': '#845ef7',
  'API': '#20c997',
  'Database': '#4dabf7',
  
  // Development Process
  'Planning': '#ff922b',
  'Bug': '#ff0000',
  'Feature': '#51cf66',
  'Testing': '#cc0000',
  
  // Libraries & Tools
  'dotenv': '#efd81d',
  'CORS': '#7952b3',
  'Framer Motion': '#ff0055',
  'Recharts': '#22b5bf',
  'React-Beautiful-DND': '#ff4154',
  
  // Project Management
  'Documentation': '#868e96',
  'Research': '#adb5bd',
  'Progress': '#51cf66',
  'Priority': '#ff6b6b'
};

// Helper function to get color for a tag
export const getTagColor = (tagName) => {
  return tagColorMap[tagName] || '#666666'; // Default gray if no color mapping exists
}; 