// controllers/tasksController.js
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

// Get all tasks
export const getTasks = async (req, res) => {
  const { tagId } = req.query;

  try {
    let query = knex("tasks").select("*");

    if (tagId) {
      query = knex("tasks")
        .select("tasks.*")
        .leftJoin("task_tags", "tasks.id", "task_tags.task_id")
        .where("task_tags.tag_id", tagId)
        .groupBy("tasks.id");
    }

    const tasks = await query;
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
    const task = await knex("tasks").where({ id }).first();
    if (!task) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Error retrieving task", error: error.message });
  }
};

// Add a new task
export const addTask = async (req, res) => {
  const { title, description, status, dueDate } = req.body;

  try {
    const [taskId] = await knex("tasks").insert({
      title,
      description,
      status,
      due_date: dueDate || null,
    });
    const newTask = await knex("tasks").where({ id: taskId }).first();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

// Update an existing task
export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate } = req.body;

  try {
    const taskExists = await knex("tasks").where({ id }).first();
    if (!taskExists) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }

    await knex("tasks").where({ id }).update({
      title,
      description,
      status,
      due_date: dueDate || null,
    });
    const updatedTask = await knex("tasks").where({ id }).first();
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