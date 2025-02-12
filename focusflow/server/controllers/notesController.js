// controllers/notesController.js
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Get all notes
export const getNotes = async (req, res) => {
  const { taskId, tagId } = req.query;

  try {
    let query = knex("notes").select("*");

    if (taskId) {
      query = query.where({ task_id: taskId });
    }

    if (tagId) {
      query = knex("notes")
        .select("notes.*")
        .leftJoin("note_tags", "notes.id", "note_tags.note_id")
        .where("note_tags.tag_id", tagId)
        .groupBy("notes.id");
    }

    const notes = await query;
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ message: "Error retrieving notes", error: error.message });
  }
};

// Get a specific note by ID
export const getNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await knex("notes").where({ id }).first();
    if (!note) {
      return res.status(404).json({ message: `Note with ID ${id} not found` });
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("Error getting note:", error);
    res.status(500).json({ message: "Error retrieving note", error: error.message });
  }
};

// Add a new note
export const addNote = async (req, res) => {
  const { task_id, title, content } = req.body;

  try {
    const [noteId] = await knex("notes").insert({
      task_id: task_id || null,
      title,
      content,
    });
    const newNote = await knex("notes").where({ id: noteId }).first();
    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { task_id, title, content } = req.body;

  try {
    const noteExists = await knex("notes").where({ id }).first();
    if (!noteExists) {
      return res.status(404).json({ message: `Note with ID ${id} not found` });
    }

    await knex("notes").where({ id }).update({
      task_id: task_id || null,
      title,
      content,
    });
    const updatedNote = await knex("notes").where({ id }).first();
    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const noteExists = await knex("notes").where({ id }).first();
    if (!noteExists) {
      return res.status(404).json({ message: `Note with ID ${id} not found` });
    }

    await knex("notes").where({ id }).del();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};