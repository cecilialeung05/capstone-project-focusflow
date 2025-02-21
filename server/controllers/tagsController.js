import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);


export const getTags = async (req, res) => {
  try {
    const tags = await knex("tags").select("*");
    res.json(tags);
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