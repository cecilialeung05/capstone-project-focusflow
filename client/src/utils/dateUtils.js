export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

export const formatRelativeDate = (dateString) => {
  if (!dateString) return 'No due date';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Format the actual date
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
  });
  
  // Get relative time
  let relativeTime;
  if (diffDays === 0) relativeTime = 'due today';
  else if (diffDays === 1) relativeTime = 'due tomorrow';
  else if (diffDays === -1) relativeTime = 'due yesterday';
  else if (diffDays > 1 && diffDays <= 7) relativeTime = `due in ${diffDays} days`;
  else if (diffDays < -1 && diffDays >= -7) relativeTime = `due ${Math.abs(diffDays)} days ago`;
  else if (diffDays > 7 && diffDays <= 14) relativeTime = 'due next week';
  else if (diffDays < -7 && diffDays >= -14) relativeTime = 'due last week';
  else relativeTime = diffDays > 0 ? 'upcoming' : 'overdue';
  
  return `${formattedDate} (${relativeTime})`;
}; 