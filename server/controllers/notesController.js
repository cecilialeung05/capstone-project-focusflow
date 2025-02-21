import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);


export const getNotes = async (req, res) => {
  try {
    let query = knex("notes").select("*")
    if (req.query.tagId) {
      query = query.join("note_tags", "notes.id", "note_tags.note_id")
        .where("note_tags.tag_id", req.query.tagId)
        .orderBy("notes.created_at", "desc");
    } else {
      query = query.orderBy("notes.created_at", "desc");
    }

    const notes = await query;

    // Fetch tags for each note (using a loop, but it's clearer)
    const notesWithTags = await Promise.all(
      notes.map(async (note) => {
        const tags = await knex("tags")
          .select("tags.*")
          .join("note_tags", "tags.id", "note_tags.tag_id")
          .where("note_tags.note_id", note.id);
        return { ...note, tags };
      })
    );

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
        .join("note_tags", "tags.id", "note_tags.tag_id")
        .where("note_tags.note_id", id)
        .select("tags.id", "tags.name");

    res.status(200).json({ ...note, tags });
  } catch (error) {
    console.error("Error getting note:", error);
    res.status(500).json({ message: "Error retrieving note", error: error.message });
  }
};

export const addNote = async (req, res) => {
  const { task_id = null, title, content, tags } = req.body;

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ 
      message: "Title and content are required" 
    });
  }

  try {
    // Insert the note
    const [noteId] = await knex("notes")
      .insert({ 
        task_id,
        title, 
        content: Array.isArray(content) ? content.join('\n') : content
      });

    // Add tags if provided
    if (tags?.length) {
      const tagRows = tags.map(tag_id => ({ note_id: noteId, tag_id }));
      await knex("note_tags").insert(tagRows);
    }

    // Get the complete note with tags
    const note = await knex("notes").where({ id: noteId }).first();
    const noteTags = tags?.length ? await knex("tags")
      .join("note_tags", "tags.id", "note_tags.tag_id")
      .where("note_tags.note_id", noteId)
      .select("tags.id", "tags.name") : [];

    res.status(201).json({ ...note, tags: noteTags });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { task_id, title, content, tags } = req.body;

  try {
    // Check if note exists
    const noteExists = await knex("notes").where({ id }).first();
    if (!noteExists) {
        return res.status(404).json({ message: "Note not found" });
    }

    // Update note
    await knex("notes")
        .where({ id })
        .update({ 
          task_id, 
          title, 
          content: Array.isArray(content) ? content.join('\n') : content 
        });

    // Get updated note
    const updatedNote = await knex("notes").where({ id }).first();

    // Update tags if provided
    if (tags) {
      await knex("note_tags").where({ note_id: id }).del();
      if (tags.length > 0) {
        const tagRows = tags.map(tag_id => ({ note_id: id, tag_id }));
        await knex("note_tags").insert(tagRows);
      }
    }

  const updatedTags = await knex("tags")
      .join("note_tags", "tags.id", "note_tags.tag_id")
      .where("note_tags.note_id", id)
      .select("tags.id", "tags.name");

    res.status(200).json({ ...updatedNote, tags: updatedTags || [] });
  } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Error updating note", error: error.message });
  }
};


export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await knex("notes").where({ id }).del();

        if (deleted === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        console.error("Error deleting note:", error);
        res.status(500).json({ message: "Error deleting note", error: error.message });
    }
};