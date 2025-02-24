export const TASK_STATUSES = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in progress',
  BLOCKED: 'blocked',
  OPEN: 'open'
};

export const STATUS_COLORS = {
  [TASK_STATUSES.COMPLETED]: 'var(--success-color)',
  [TASK_STATUSES.IN_PROGRESS]: 'var(--info-color)',
  [TASK_STATUSES.BLOCKED]: 'var(--danger-color)',
  [TASK_STATUSES.OPEN]: 'var(--text-secondary)'
}; 