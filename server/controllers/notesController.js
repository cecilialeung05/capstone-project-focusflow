import supabase from "../supabaseClient.js";

export const getNotes = async (req, res) => {
  const { taskId } = req.query;

  try {
    let query = supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (taskId) {
      query = query.eq("task_id", taskId);
    }

    const { data: notes, error } = await query;
    if (error) throw error;

    const notesWithTags = await Promise.all(
      notes.map(async (note) => {
        const { data: tagLinks, error: tagLinkError } = await supabase
          .from("note_tags")
          .select("tag_id")
          .eq("note_id", note.id);

        if (tagLinkError) throw tagLinkError;

        const tagIds = tagLinks.map((t) => t.tag_id);

        let tags = [];
        if (tagIds.length) {
          const { data: tagDetails, error: tagFetchError } = await supabase
            .from("tags")
            .select("*")
            .in("id", tagIds);

          if (tagFetchError) throw tagFetchError;
          tags = tagDetails;
        }

        return { ...note, tags };
      })
    );

    res.status(200).json(notesWithTags);
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({
      message: "Error retrieving notes",
      error: error.message || error,
    });
  }
};

export const getNote = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: note, error } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !note) {
      return res
        .status(404)
        .json({ message: `Note with ID ${id} not found` });
    }

    const { data: tagLinks, error: tagLinkError } = await supabase
      .from("note_tags")
      .select("tag_id")
      .eq("note_id", id);

    if (tagLinkError) throw tagLinkError;

    const tagIds = tagLinks.map((t) => t.tag_id);

    let tags = [];
    if (tagIds.length) {
      const { data: tagDetails, error: tagFetchError } = await supabase
        .from("tags")
        .select("*")
        .in("id", tagIds);

      if (tagFetchError) throw tagFetchError;
      tags = tagDetails;
    }

    res.status(200).json({ ...note, tags });
  } catch (error) {
    console.error("Error getting note:", error);
    res.status(500).json({ message: "Error retrieving note", error: error.message });
  }
};

export const addNote = async (req, res) => {
  const { task_id, title, content, tags } = req.body;

  try {
    const { data: note, error } = await supabase
      .from("notes")
      .insert([{ task_id, title, content }])
      .select()
      .single();

    if (error) throw error;

    if (tags?.length) {
      const tagLinks = tags.map((tagId) => ({
        note_id: note.id,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabase
        .from("note_tags")
        .insert(tagLinks);

      if (tagError) throw tagError;
    }

    res.status(201).json({ ...note, tags: tags || [] });
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).json({ message: "Error creating note", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { id } = req.params;
  const { task_id, title, content, tags } = req.body;

  try {
    const { error: updateError } = await supabase
      .from("notes")
      .update({ task_id, title, content })
      .eq("id", id);

    if (updateError) throw updateError;

    await supabase.from("note_tags").delete().eq("note_id", id);

    if (tags?.length) {
      const tagLinks = tags.map((tagId) => ({
        note_id: id,
        tag_id: tagId,
      }));

      const { error: tagInsertError } = await supabase
        .from("note_tags")
        .insert(tagLinks);

      if (tagInsertError) throw tagInsertError;
    }

    const { data: updatedNote, error: fetchError } = await supabase
      .from("notes")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data: tagLinks, error: tagFetchError } = await supabase
      .from("note_tags")
      .select("tag_id")
      .eq("note_id", id);

    if (tagFetchError) throw tagFetchError;

    const tagIds = tagLinks.map((t) => t.tag_id);

    res.status(200).json({ ...updatedNote, tags: tagIds });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ message: "Error updating note", error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    await supabase.from("note_tags").delete().eq("note_id", id);
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) throw error;
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
};
