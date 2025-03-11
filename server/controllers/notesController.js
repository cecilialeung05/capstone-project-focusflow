import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

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

    const notesWithTags = await Promise.all(
      notes.map(async (note) => {
        const tags = await knex("tags")
          .select("tags.*")
          .join("note_tags", "tags.id", "note_tags.tag_id")
          .where("note_tags.note_id", note.id);

        console.log(`Tags for note ${note.id}:`, tags);

        return {
          ...note,
          tags: tags || []
        };
      })
    );

    console.log('Final notes with tags:', notesWithTags); 
    res.status(200).json(notesWithTags);
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ message: "Error retrieving notes", error: error.message });
  }
};

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

export const addNote = async (req, res) => {
  const { task_id, title, content, tags } = req.body;
  console.log('Received note data:', { task_id, title, content, tags });
  try {
    await knex.transaction(async (trx) => {
      const [noteId] = await trx("notes").insert({
        task_id: task_id || null,
        title,
        content,
      });
      console.log('Created note with ID:', noteId); 

      if (tags && Array.isArray(tags) && tags.length > 0) {
        console.log('Inserting tags for note:', tags); 
        const tagInserts = tags.map(tagId => ({
          note_id: noteId,
          tag_id: parseInt(tagId)
        }));
        await trx("note_tags").insert(tagInserts);
      }

      const note = await trx("notes").where({ id: noteId }).first();
      const noteTags = await trx("tags")
        .select("tags.*")
        .join("note_tags", "tags.id", "note_tags.tag_id")
        .where("note_tags.note_id", noteId);

      console.log('Final note with tags:', { ...note, tags: noteTags }); 

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

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { task_id, title, content, tags } = req.body;
  console.log('Updating note:', id, 'with data:', req.body); 

  try {
    await knex.transaction(async (trx) => {
      const noteExists = await trx("notes").where({ id }).first();
      if (!noteExists) {
        return res.status(404).json({ message: `Note with ID ${id} not found` });
      }

      await trx("notes").where({ id }).update({
        task_id: task_id || null,
        title,
        content,
      });

      await trx("note_tags").where({ note_id: id }).del();
      
      if (tags && Array.isArray(tags) && tags.length > 0) {
        const tagInserts = tags.map(tagId => ({
          note_id: id,
          tag_id: parseInt(tagId)
        }));
        await trx("note_tags").insert(tagInserts);
      }

      const updatedNote = await trx("notes").where({ id }).first();
      const noteTags = await trx("tags")
        .select("tags.*")
        .join("note_tags", "tags.id", "note_tags.tag_id")
        .where("note_tags.note_id", id);

      console.log('Updated note with tags:', { ...updatedNote, tags: noteTags }); 

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

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    await knex.transaction(async (trx) => {
      const noteExists = await trx("notes").where({ id }).first();
      if (!noteExists) {
        return res.status(404).json({ message: `Note with ID ${id} not found` });
      }
      await trx("note_tags").where({ note_id: id }).del();
      await trx("notes").where({ id }).del();
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};