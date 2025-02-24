import { useMemo } from 'react';

// Move task organization logic from Dashboard
export function useTaskOrganization(tasks) {
  return useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    return {
      overdue: tasks.filter(task => {
        const dueDate = new Date(task.due_date);
        return dueDate < today && task.status !== 'completed';
      }),
      today: tasks.filter(task => {
        const dueDate = new Date(task.due_date);
        return dueDate >= today && dueDate < tomorrow;
      }),
      // ... other categorizations
    };
  }, [tasks]);
} 