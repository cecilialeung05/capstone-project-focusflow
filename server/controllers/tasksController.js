import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);


export const getTasks = async (req, res) => {
  try {
    let query = knex("tasks").select("*")
    if (req.query.tagId) {
      query = query.join("task_tags", "tasks.id", "task_tags.task_id")
        .where("task_tags.tag_id", req.query.tagId)
        .orderBy("tasks.created_at", "desc");
    } else {
      query = query.orderBy("tasks.created_at", "desc");
    }

    const tasks = await query;

    // Fetch tags for each task (using a loop, but it's clearer)
    const tasksWithTags = await Promise.all(
      tasks.map(async (task) => {
        const tags = await knex("tags")
          .select("tags.*")
          .join("task_tags", "tags.id", "task_tags.tag_id")
          .where("task_tags.task_id", task.id);
        return { ...task, tags };
      })
    );

    res.status(200).json(tasksWithTags);
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
};

export const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await knex("tasks").where({ id }).first();
    if (!task) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }

    const tags = await knex("tags")
      .select("tags.*")
      .join("task_tags", "tags.id", "task_tags.tag_id")
      .where("task_tags.task_id", id);

    res.status(200).json({
      ...task,
      tags: tags || []
    });
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Error retrieving task", error: error.message });
  }
};


export const addTask = async (req, res) => {
  const { title, description, status, due_date, tags } = req.body;

  try {
    // Insert task
    const [result] = await knex("tasks")
      .insert({ title, description, status, due_date });
    
    const taskId = result;

    // Add tags if provided
    if (tags?.length) {
      const tagRows = tags.map(tag_id => ({ task_id: taskId, tag_id }));
      await knex("task_tags").insert(tagRows);
    }

    res.status(201).json({ id: taskId, title, description, status, due_date, tags });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task" });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date, tags } = req.body;

  try {
    // Format the date properly for MySQL if it exists
    const updateData = {
      title,
      description,
      status,
      due_date: due_date ? new Date(due_date).toISOString().slice(0, 10) : due_date
    };

    // Update task
    await knex("tasks")
      .where({ id })
      .update(updateData);

    // Update tags if provided
    if (tags !== undefined) {
      await knex("task_tags").where({ task_id: id }).del();
      if (tags.length > 0) {
        const tagRows = tags.map(tag_id => ({ task_id: id, tag_id }));
        await knex("task_tags").insert(tagRows);
      }
    }

    // Get updated task with tags
    const updatedTask = await knex("tasks").where({ id }).first();
    const updatedTags = await knex("tags")
      .select("tags.*")
      .join("task_tags", "tags.id", "task_tags.tag_id")
      .where("task_tags.task_id", id);

    res.status(200).json({
      ...updatedTask,
      tags: updatedTags
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const taskExists = await knex("tasks").where({ id }).first();
    if (!taskExists) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }

    await knex("task_tags").where({ task_id: id }).del();
    await knex("notes").where({ task_id: id }).del();
    

    await knex("tasks").where({ id }).del();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};