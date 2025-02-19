export const formatDate = (dateString) => {
  if (!dateString) return 'No date set';
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) return 'Invalid date';

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return date.toLocaleDateString('en-US', options);
}; 