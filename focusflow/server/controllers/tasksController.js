// controllers/tasksController.js
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all tasks
export const getTasks = async (req, res) => {
  const { tagId } = req.query;

  try {
    let query = knex("tasks")
      .select(
        "tasks.*",
        knex.raw('GROUP_CONCAT(tags.name) as tags') // Add this
      )
      .leftJoin("task_tags", "tasks.id", "task_tags.task_id")
      .leftJoin("tags", "task_tags.tag_id", "tags.id")
      .groupBy("tasks.id");

    if (tagId) {
      query = knex("tasks")
        .select("tasks.*", knex.raw('GROUP_CONCAT(tags.name) as tags'))  // Add this also to the tagId query
        .leftJoin("task_tags", "tasks.id", "task_tags.task_id")
        .leftJoin("tags", "task_tags.tag_id", "tags.id")
        .where("task_tags.tag_id", tagId)
        .groupBy("tasks.id");
    }

    const tasks = await query;

    // Convert comma separated string to array
    const formattedTasks = tasks.map(task => {
      if (task.tags) {
        task.tags = task.tags.split(',');
      } else {
        task.tags = [];
      }
      return task;
    });
    
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
};

// Get a specific task by ID
export const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await knex("tasks")
    .select("tasks.*", knex.raw('GROUP_CONCAT(tags.name) as tags'))
    .leftJoin("task_tags", "tasks.id", "task_tags.task_id")
    .leftJoin("tags", "task_tags.tag_id", "tags.id")
    .where("tasks.id", id)
    .groupBy("tasks.id")
    .first();

    if (!task) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }
    //Convert comma separated string to array
    if (task.tags) {
      task.tags = task.tags.split(',');
    } else {
      task.tags = [];
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Error retrieving task", error: error.message });
  }
};

// Add a new task
export const addTask = async (req, res) => {
  const { title, description, status, dueDate, tags } = req.body;

  try {
    const [taskId] = await knex("tasks").insert({
      title,
      description,
      status,
      due_date: dueDate || null,
    });

    // Associate tags with the new task
    if (tags && tags.length > 0) {
      const inserts = tags.map(tagId => ({ task_id: taskId, tag_id: tagId }));
      await knex("task_tags").insert(inserts);
    }

    // Fetch the newly created task with its tags
    const newTask = await knex("tasks")
    .select("tasks.*", knex.raw('GROUP_CONCAT(tags.name) as tags'))
    .leftJoin("task_tags", "tasks.id", "task_tags.task_id")
    .leftJoin("tags", "task_tags.tag_id", "tags.id")
    .where("tasks.id", taskId)
    .groupBy("tasks.id")
    .first();

    if (newTask.tags) {
      newTask.tags = newTask.tags.split(',');
    } else {
      newTask.tags = [];
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// Update an existing task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, tags } = req.body;

  try {
    const taskExists = await knex("tasks").where({ id }).first();
    if (!taskExists) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }

    // 1. Update the task itself:
    await knex("tasks").where({ id }).update({
      title,
      description,
      status,
      due_date: dueDate || null,
    });

    // 2. Update the task_tags table:
    // a. Delete existing tag associations:
    await knex("task_tags").where({ task_id: id }).del();

    // b. Insert new tag associations:
    if (tags && tags.length > 0) {
      const inserts = tags.map(tagId => ({ task_id: id, tag_id: tagId }));
      await knex("task_tags").insert(inserts);
    }

    // 3. Fetch the updated task with its tags:
    const updatedTask = await knex("tasks")
      .select("tasks.*", knex.raw('GROUP_CONCAT(tags.name) as tags'))
      .leftJoin("task_tags", "tasks.id", "task_tags.task_id")
      .leftJoin("tags", "task_tags.tag_id", "tags.id")
      .where("tasks.id", id)
      .groupBy("tasks.id")
      .first();

      if (updatedTask.tags) {
        updatedTask.tags = updatedTask.tags.split(',');
      } else {
        updatedTask.tags = [];
      }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const taskExists = await knex("tasks").where({ id }).first();
    if (!taskExists) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }

    await knex("tasks").where({ id }).del();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};