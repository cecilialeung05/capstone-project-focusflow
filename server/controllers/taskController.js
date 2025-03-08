import { db } from '../config/database';

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status = 'todo',
      due_date,
      priority = 'medium',
      recurring_type = 'none',
      recurring_interval,
      recurring_unit,
      parent_task_id
    } = req.body;

    const [taskId] = await db('tasks').insert({
      title,
      description,
      status,
      due_date,
      priority,
      recurring_type,
      recurring_interval,
      recurring_unit,
      parent_task_id
    });

    // If this is a recurring task and it's completed, create the next occurrence
    if (status === 'done' && recurring_type !== 'none') {
      const nextDueDate = calculateNextDueDate(due_date, recurring_type, recurring_interval, recurring_unit);
      if (nextDueDate) {
        await db('tasks').insert({
          title,
          description,
          status: 'todo',
          due_date: nextDueDate,
          priority,
          recurring_type,
          recurring_interval,
          recurring_unit,
          parent_task_id
        });
      }
    }

    res.status(201).json({ id: taskId, message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      due_date,
      priority,
      recurring_type,
      recurring_interval,
      recurring_unit,
      parent_task_id
    } = req.body;

    await db('tasks')
      .where({ id })
      .update({
        title,
        description,
        status,
        due_date,
        priority,
        recurring_type,
        recurring_interval,
        recurring_unit,
        parent_task_id,
        updated_at: db.fn.now()
      });

    // Handle recurring task completion
    if (status === 'done' && recurring_type !== 'none') {
      const nextDueDate = calculateNextDueDate(due_date, recurring_type, recurring_interval, recurring_unit);
      if (nextDueDate) {
        await db('tasks').insert({
          title,
          description,
          status: 'todo',
          due_date: nextDueDate,
          priority,
          recurring_type,
          recurring_interval,
          recurring_unit,
          parent_task_id
        });
      }
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const getTasks = async (req, res) => {
  try {
    const { status, priority, search, parent_task_id } = req.query;
    
    let query = db('tasks').select('*');

    if (status) {
      query = query.where({ status });
    }

    if (priority) {
      query = query.where({ priority });
    }

    if (parent_task_id) {
      query = query.where({ parent_task_id });
    }

    if (search) {
      query = query.where(builder => {
        builder.where('title', 'like', `%${search}%`)
          .orWhere('description', 'like', `%${search}%`);
      });
    }

    const tasks = await query
      .orderBy('due_date', 'asc')
      .orderBy('created_at', 'desc');

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Helper function to calculate next due date for recurring tasks
const calculateNextDueDate = (currentDate, type, interval = 1, unit = 'days') => {
  if (!currentDate || type === 'none') return null;

  const date = new Date(currentDate);

  switch (type) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'custom':
      switch (unit) {
        case 'days':
          date.setDate(date.getDate() + interval);
          break;
        case 'weeks':
          date.setDate(date.getDate() + (interval * 7));
          break;
        case 'months':
          date.setMonth(date.getMonth() + interval);
          break;
      }
      break;
  }

  return date;
};

export {
  createTask,
  updateTask,
  getTasks
}; 