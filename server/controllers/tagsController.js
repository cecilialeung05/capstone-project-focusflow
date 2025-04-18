import supabase from "../supabaseClient.js";

export const getTags = async (req, res) => {
  try {
    const { data: tags, error } = await supabase
      .from("tags")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    res.status(200).json(tags);
  } catch (error) {
    console.error("Error getting tags:", error);
    res.status(500).json({ message: "Error retrieving tags", error: error.message });
  }
};

export const getTag = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: tag, error: tagError } = await supabase
      .from("tags")
      .select("*")
      .eq("id", id)
      .single();

    if (tagError) throw tagError;
    if (!tag) return res.status(404).json({ message: `Tag with ID ${id} not found` });

    const { data: taskLinks, error: taskLinkError } = await supabase
      .from("task_tags")
      .select("task_id")
      .eq("tag_id", id);

    if (taskLinkError) throw taskLinkError;

    const taskIds = taskLinks.map(t => t.task_id);
    let tasks = [];
    if (taskIds.length) {
      const { data: fetchedTasks, error: taskFetchError } = await supabase
        .from("tasks")
        .select("*")
        .in("id", taskIds);
      if (taskFetchError) throw taskFetchError;
      tasks = fetchedTasks;
    }

    const { data: noteLinks, error: noteLinkError } = await supabase
      .from("note_tags")
      .select("note_id")
      .eq("tag_id", id);

    if (noteLinkError) throw noteLinkError;

    const noteIds = noteLinks.map(n => n.note_id);
    let notes = [];
    if (noteIds.length) {
      const { data: fetchedNotes, error: noteFetchError } = await supabase
        .from("notes")
        .select("*")
        .in("id", noteIds);
      if (noteFetchError) throw noteFetchError;
      notes = fetchedNotes;
    }

    res.status(200).json({
      ...tag,
      tasks,
      notes,
    });
  } catch (error) {
    console.error("Error getting tag:", error);
    res.status(500).json({ message: "Error retrieving tag", error: error.message });
  }
};

export const addTag = async (req, res) => {
  const { name } = req.body;

  try {
    const { data, error } = await supabase
      .from("tags")
      .insert({ name })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ message: "Error creating tag", error: error.message });
  }
};

export const updateTag = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const { data, error } = await supabase
      .from("tags")
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Error updating tag:", error);
    res.status(500).json({ message: "Error updating tag", error: error.message });
  }
};

export const deleteTag = async (req, res) => {
  const { id } = req.params;

  try {
    const { error: taskTagError } = await supabase
      .from("task_tags")
      .delete()
      .eq("tag_id", id);

    const { error: noteTagError } = await supabase
      .from("note_tags")
      .delete()
      .eq("tag_id", id);

    if (taskTagError || noteTagError) {
      throw taskTagError || noteTagError;
    }

    const { error: deleteError } = await supabase
      .from("tags")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Error deleting tag", error: error.message });
  }
};
