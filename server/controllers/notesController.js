// controllers/notesController.js
import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);


// Get all notes
export const getNotes = async (req, res) => {
  const { taskId } = req.query;

  try {
    let notesQuery = knex("notes")
      .select("notes.*")
      .orderBy("notes.created_at", "desc");

    if (taskId) {
      notesQuery = notesQuery.where({ task_id: taskId });
    }

    const notes = await notesQuery;
    console.log('Retrieved notes:', notes); // Debug log

    // For each note, get its tags
    const notesWithTags = await Promise.all(
      notes.map(async (note) => {
        const tags = await knex("tags")
          .select("tags.*")
          .join("note_tags", "tags.id", "note_tags.tag_id")
          .where("note_tags.note_id", note.id);

        console.log(`Tags for note ${note.id}:`, tags); // Debug log

        return {
          ...note,
          tags: tags || []
        };
      })
    );

    console.log('Final notes with tags:', notesWithTags); // Debug log
    res.status(200).json(notesWithTags);
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ message: "Error retrieving notes", error: error.message });
  }
};

// Get a specific note
export const getNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await knex("notes").where({ id }).first();
    if (!note) {
      return res.status(404).json({ message: `Note with ID ${id} not found` });
    }

    const tags = await knex("tags")
      .select("tags.*")
      .join("note_tags", "tags.id", "note_tags.tag_id")
      .where("note_tags.note_id", id);

    res.status(200).json({
      ...note,
      tags: tags || []
    });
  } catch (error) {
    console.error("Error getting note:", error);
    res.status(500).json({ message: "Error retrieving note", error: error.message });
  }
};

// Add a new note
export const addNote = async (req, res) => {
  const { task_id, title, content, tags } = req.body;
  console.log('Received note data:', req.body); // Debug log

  try {
    await knex.transaction(async (trx) => {
      // 1. Insert note
      const [noteId] = await trx("notes").insert({
        task_id: task_id || null,
        title,
        content,
      });
      console.log('Created note with ID:', noteId); // Debug log

      // 2. Insert tag associations if any
      if (tags && Array.isArray(tags) && tags.length > 0) {
        console.log('Inserting tags for note:', tags); // Debug log
        const tagInserts = tags.map(tagId => ({
          note_id: noteId,
          tag_id: parseInt(tagId)
        }));
        await trx("note_tags").insert(tagInserts);
      }

      // 3. Fetch the complete note with tags
      const note = await trx("notes").where({ id: noteId }).first();
      const noteTags = await trx("tags")
        .select("tags.*")
        .join("note_tags", "tags.id", "note_tags.tag_id")
        .where("note_tags.note_id", noteId);

      console.log('Final note with tags:', { ...note, tags: noteTags }); // Debug log

      res.status(201).json({
        ...note,
        tags: noteTags || []
      });
    });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

// Update an existing note
export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { task_id, title, content, tags } = req.body;
  console.log('Updating note:', id, 'with data:', req.body); // Debug log

  try {
    await knex.transaction(async (trx) => {
      // 1. Check if note exists
      const noteExists = await trx("notes").where({ id }).first();
      if (!noteExists) {
        return res.status(404).json({ message: `Note with ID ${id} not found` });
      }

      // 2. Update note
      await trx("notes").where({ id }).update({
        task_id: task_id || null,
        title,
        content,
      });

      // 3. Update tags
      // First delete existing associations
      await trx("note_tags").where({ note_id: id }).del();
      
      // Then insert new ones if any
      if (tags && Array.isArray(tags) && tags.length > 0) {
        console.log('Updating tags for note:', tags); // Debug log
        const tagInserts = tags.map(tagId => ({
          note_id: id,
          tag_id: parseInt(tagId)
        }));
        await trx("note_tags").insert(tagInserts);
      }

      // 4. Fetch updated note with tags
      const updatedNote = await trx("notes").where({ id }).first();
      const noteTags = await trx("tags")
        .select("tags.*")
        .join("note_tags", "tags.id", "note_tags.tag_id")
        .where("note_tags.note_id", id);

      console.log('Updated note with tags:', { ...updatedNote, tags: noteTags }); // Debug log

      res.status(200).json({
        ...updatedNote,
        tags: noteTags || []
      });
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};

// Delete a note
export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    await knex.transaction(async (trx) => {
      const noteExists = await trx("notes").where({ id }).first();
      if (!noteExists) {
        return res.status(404).json({ message: `Note with ID ${id} not found` });
      }

      // Delete tag associations first
      await trx("note_tags").where({ note_id: id }).del();
      // Then delete the note
      await trx("notes").where({ id }).del();
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};