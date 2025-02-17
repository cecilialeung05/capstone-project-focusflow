import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all tags
export const getTags = async (req, res) => {
  try {
    const tags = await knex("tags").select("*");
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error getting tags:", error);
    res.status(500).json({ message: "Error retrieving tags", error: error.message });
  }
};

// Get a specific tag by ID
export const getTag = async (req, res) => {
  const { id } = req.params;

  try {
    const tag = await knex("tags").where({ id }).first();
    if (!tag) {
      return res.status(404).json({ message: `Tag with ID ${id} not found` });
    }
    res.status(200).json(tag);
  } catch (error) {
    console.error("Error getting tag:", error);
    res.status(500).json({ message: "Error retrieving tag", error: error.message });
  }
};

// Add a new tag
export const addTag = async (req, res) => {
  const { name } = req.body;

  try {
    const [tagId] = await knex("tags").insert({ name });
    const newTag = await knex("tags").where({ id: tagId }).first();
    res.status(201).json(newTag);
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Tag name already exists." });
    }
    res.status(500).json({ message: "Error creating tag", error: error.message });
  }
};

// Update an existing tag
export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const tagExists = await knex("tags").where({ id }).first();
    if (!tagExists) {
      return res.status(404).json({ message: `Tag with ID ${id} not found` });
    }

    await knex("tags").where({ id }).update({ name });
    const updatedTag = await knex("tags").where({ id }).first();
    res.status(200).json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: "Tag name already exists." });
    }
    res.status(500).json({ message: "Error updating tag", error: error.message });
  }
};

// Delete a tag
export const deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    // Delete tag associations in task_tags
    await knex("task_tags").where({ tag_id: id }).del();

    // Delete tag associations in note_tags
    await knex("note_tags").where({ tag_id: id }).del();

    const tagExists = await knex("tags").where({ id }).first();
    if (!tagExists) {
      return res.status(404).json({ message: `Tag with ID ${id} not found` });
    }

    await knex("tags").where({ id }).del();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Error deleting tag", error: error.message });
  }
};