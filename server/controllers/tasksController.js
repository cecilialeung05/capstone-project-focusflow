import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

export const getTasks = async (req, res) => {
  try {
    const tasks = await knex("tasks")
      .select("tasks.*")
      .orderBy("tasks.created_at", "desc");

    const tasksWithTags = await Promise.all(
      tasks.map(async (task) => {
        const tags = await knex("tags")
          .select("tags.*")
          .join("task_tags", "tags.id", "task_tags.tag_id")
          .where("task_tags.task_id", task.id);

        return {
          ...task,
          tags: tags || []
        };
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
    // Get the task
    const task = await knex("tasks").where({ id }).first();
    if (!task) {
      return res.status(404).json({ message: `Task with ID ${id} not found` });
    }

    const tags = await knex("tags")
      .select("tags.*")
      .join("task_tags", "tags.id", "task_tags.tag_id")
      .where("task_tags.task_id", id);

    // Get the task's notes
    const notes = await knex("notes")
      .select("notes.*")
      .where("task_id", id)
      .orderBy("created_at", "desc");

    // Get tags for each note
    const notesWithTags = await Promise.all(
      notes.map(async (note) => {
        const noteTags = await knex("tags")
          .select("tags.*")
          .join("note_tags", "tags.id", "note_tags.tag_id")
          .where("note_tags.note_id", note.id);

        return {
          ...note,
          tags: noteTags || []
        };
      })
    );

    // Return task with both tags and notes
    res.status(200).json({
      ...task,
      tags: tags || [],
      notes: notesWithTags
    });
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Error retrieving task", error: error.message });
  }
};

export const addTask = async (req, res) => {
  const { title, description, status, due_date, tags } = req.body;

  try {
    await knex.transaction(async (trx) => {

      const [taskId] = await trx("tasks").insert({
        title,
        description,
        status,
        due_date: due_date || null
      });


      if (tags && tags.length > 0) {
        const tagInserts = tags.map(tagId => ({
          task_id: taskId,
          tag_id: tagId
        }));
        await trx("task_tags").insert(tagInserts);
      }

      const task = await trx("tasks").where({ id: taskId }).first();
      const taskTags = await trx("tags")
        .select("tags.*")
        .join("task_tags", "tags.id", "task_tags.tag_id")
        .where("task_tags.task_id", taskId);

      res.status(201).json({
        ...task,
        tags: taskTags || []
      });
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, dueDate, tags } = req.body;

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

    await knex("task_tags").where({ task_id: id }).del();
    if (tags && tags.length > 0) {
      const inserts = tags.map(tagId => ({ task_id: id, tag_id: tagId }));
      await knex("task_tags").insert(inserts);
    }

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
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {  
            return res.status(400).json({ message: "Invalid task_id or tag_id.  Make sure they exist." });
        }
    return res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

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