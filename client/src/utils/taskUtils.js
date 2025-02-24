export const STATUS_COLORS = {
  completed: {
    background: 'var(--success-color)',
    text: 'white',
    light: 'rgba(76, 175, 80, 0.1)'
  },
  'in progress': {
    background: 'var(--info-color)',
    text: 'white',
    light: 'rgba(33, 150, 243, 0.1)'
  },
  blocked: {
    background: 'var(--danger-color)', 
    text: 'white',
    light: 'rgba(244, 67, 54, 0.1)'
  },
  open: {
    background: 'var(--text-secondary)',
    text: 'white',
    light: 'rgba(158, 158, 158, 0.1)'
  }
};

export const getStatusColor = (status, type = 'background') => {
  const statusKey = status?.toLowerCase() || 'open';
  return STATUS_COLORS[statusKey]?.[type] || STATUS_COLORS.open[type];
}; 