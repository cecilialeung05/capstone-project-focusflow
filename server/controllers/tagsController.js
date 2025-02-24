import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);


export const getTags = async (req, res) => {
  try {
    console.log('Fetching tags and relationships...');
    const tags = await knex("tags").select("*");
    console.log('Tags fetched:', tags.length);

    const notesWithTags = await knex("notes")
      .select("notes.*", "note_tags.tag_id")
      .leftJoin("note_tags", "notes.id", "note_tags.note_id");
    console.log('Notes with tags fetched:', notesWithTags.length);

    const tasksWithTags = await knex("tasks")
      .select("tasks.*", "task_tags.tag_id")
      .leftJoin("task_tags", "tasks.id", "task_tags.task_id");
    console.log('Tasks with tags fetched:', tasksWithTags.length);

    // Group notes by ID with their tags
    const notes = notesWithTags.reduce((acc, note) => {
      if (!acc[note.id]) {
        acc[note.id] = {
          ...note,
          note_tags: []
        };
      }
      if (note.tag_id) {
        acc[note.id].note_tags.push({ tag_id: note.tag_id });
      }
      return acc;
    }, {});

    // Group tasks by ID with their tags
    const tasks = tasksWithTags.reduce((acc, task) => {
      if (!acc[task.id]) {
        acc[task.id] = {
          ...task,
          task_tags: []
        };
      }
      if (task.tag_id) {
        acc[task.id].task_tags.push({ tag_id: task.tag_id });
      }
      return acc;
    }, {});

    res.json({
      tags,
      notes: Object.values(notes),
      tasks: Object.values(tasks)
    });
  } catch (error) {
    console.error("Error getting tags:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the tag
    const tag = await knex("tags").where({ id }).first();
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Get all tasks with this tag
    const tasks = await knex("tasks")
      .join("task_tags", "tasks.id", "task_tags.task_id")
      .where("task_tags.tag_id", id)
      .select("tasks.*")
      .orderBy("tasks.created_at", "desc");

    // Get all notes with this tag
    const notes = await knex("notes")
      .join("note_tags", "notes.id", "note_tags.note_id")
      .where("note_tags.tag_id", id)
      .select("notes.*")
      .orderBy("notes.created_at", "desc");

    res.json({
      ...tag,
      tasks,
      notes
    });
  } catch (error) {
    console.error("Error getting tag items:", error);
    res.status(500).json({ error: error.message });
  }
};

export const addTag = async (req, res) => {
  try {
    const tags = Array.isArray(req.body) ? req.body : [req.body];

    if (!tags.every(tag => tag.name)) {
      return res.status(400).json({ message: "Tag name is required for all tags" });
    }
    const tagData = tags.map(tag => ({ name: tag.name }));
    const result = await knex("tags").insert(tagData);
    
    res.status(201).json({ 
      message: `Successfully created ${tags.length} tag(s)`,
      firstInsertId: result[0]
    });
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Error creating tag", error: error.message });
  }
};

export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const [updatedTag] = await knex("tags").where({ id }).update({ name }).returning("*");
    if (!updatedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.status(200).json({ message: "Tag updated successfully", tag: updatedTag });
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ message: "Error updating tag", error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  const { id } = req.params;
  try {
    const tagExists = await knex("tags").where({ id }).first();
    if (!tagExists) {
      return res.status(404).json({ message: "Tag not found" });
    }

    await knex("task_tags").where({ tag_id: id }).del();
    await knex("note_tags").where({ tag_id: id }).del();
    
    await knex("tags").where({ id }).del();
    
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Error deleting tag", error: error.message });
  }
};