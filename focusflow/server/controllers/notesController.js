// controllers/notesController.js
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);


// Get all notes
export const getNotes = async (req, res) => {
  const { taskId, tagId } = req.query;

  try {
    let query = knex("notes")
    .select(
      "notes.*",
      knex.raw('GROUP_CONCAT(tags.name) as tags')
    )
    .leftJoin("note_tags", "notes.id", "note_tags.note_id")
    .leftJoin("tags", "note_tags.tag_id", "tags.id")
    .groupBy("notes.id");

    if (taskId) {
      query = knex("notes")
        .select(
          "notes.*",
          knex.raw('GROUP_CONCAT(tags.name) as tags')
        )
        .leftJoin("note_tags", "notes.id", "note_tags.note_id")
        .leftJoin("tags", "note_tags.tag_id", "tags.id")
        .where({ task_id: taskId })
        .groupBy("notes.id");
    }

    if (tagId) {
      query = knex("notes")
      .select(
        "notes.*",
        knex.raw('GROUP_CONCAT(tags.name) as tags')
      )
      .leftJoin("note_tags", "notes.id", "note_tags.note_id")
      .leftJoin("tags", "note_tags.tag_id", "tags.id")
      .where("note_tags.tag_id", tagId)
      .groupBy("notes.id");
  }

    const notes = await query;

    // Convert comma separated string to array
    const formattedNotes = notes.map(note => {
      if (note.tags) {
        note.tags = note.tags.split(',');
      } else {
        note.tags = [];
      }
      return note;
    });

    res.status(200).json(formattedNotes);
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ message: "Error retrieving notes", error: error.message });
  }
};

// Get a specific note by ID
export const getNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await knex("notes")
      .select("notes.*", knex.raw('GROUP_CONCAT(tags.name) as tags'))
      .leftJoin("note_tags", "notes.id", "note_tags.note_id")
      .leftJoin("tags", "note_tags.tag_id", "tags.id")
      .where("notes.id", id)
      .groupBy("notes.id")
      .first();
    if (!note) {
      return res.status(404).json({ message: `Note with ID ${id} not found` });
    }
    if (note.tags) {
      note.tags = note.tags.split(',');
    } else {
      note.tags = [];
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("Error getting note:", error);
    res.status(500).json({ message: "Error retrieving note", error: error.message });
  }
};

// Add a new note
export const addNote = async (req, res) => {
  const { task_id, title, content, tags } = req.body;

  try {
    const [noteId] = await knex("notes").insert({
      task_id: task_id || null,
      title,
      content,
    });
    // Associate tags with the new note
    if (tags && tags.length > 0) {
      const inserts = tags.map(tagId => ({ note_id: noteId, tag_id: tagId }));
      await knex("note_tags").insert(inserts);
    }

      const newNote = await knex("notes")
      .select("notes.*", knex.raw('GROUP_CONCAT(tags.name) as tags'))
      .leftJoin("note_tags", "notes.id", "note_tags.note_id")
      .leftJoin("tags", "note_tags.tag_id", "tags.id")
      .where("notes.id", noteId)
      .groupBy("notes.id")
      .first();

       if (newNote.tags) {
        newNote.tags = newNote.tags.split(',');
      } else {
        newNote.tags = [];
      }

    res.status(201).json(newNote);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { task_id, title, content, tags } = req.body;

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
     // 2. Update the note_tags table:
    // a. Delete existing tag associations:
    await knex("note_tags").where({ note_id: id }).del();

    // b. Insert new tag associations:
    if (tags && tags.length > 0) {
      const inserts = tags.map(tagId => ({ note_id: id, tag_id: tagId }));
      await knex("note_tags").insert(inserts);
    }

     // 3. Fetch the updated note with its tags:
    const updatedNote = await knex("notes")
      .select("notes.*", knex.raw('GROUP_CONCAT(tags.name) as tags'))
      .leftJoin("note_tags", "notes.id", "note_tags.note_id")
      .leftJoin("tags", "note_tags.tag_id", "tags.id")
      .where("notes.id", id)
      .groupBy("notes.id")
      .first();

     if (updatedNote.tags) {
        updatedNote.tags = updatedNote.tags.split(',');
      } else {
        updatedNote.tags = [];
      }

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