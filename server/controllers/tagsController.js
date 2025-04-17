import supabase from "../supabaseClient.js";

export const getTags = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
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

    const { data: tasks } = await supabase
      .from("task_tags")
      .select("tasks(*)")
      .eq("tag_id", id);

    const { data: notes } = await supabase
      .from("note_tags")
      .select("notes(*)")
      .eq("tag_id", id);

    res.status(200).json({
      ...tag,
      tasks: tasks?.map(t => t.tasks) || [],
      notes: notes?.map(n => n.notes) || []
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
    const { error: deleteTaskTagsError } = await supabase
      .from("task_tags")
      .delete()
      .eq("tag_id", id);

    const { error: deleteNoteTagsError } = await supabase
      .from("note_tags")
      .delete()
      .eq("tag_id", id);

    const { error: deleteTagError } = await supabase
      .from("tags")
      .delete()
      .eq("id", id);

    if (deleteTaskTagsError || deleteNoteTagsError || deleteTagError) {
      throw deleteTaskTagsError || deleteNoteTagsError || deleteTagError;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ message: "Error deleting tag", error: error.message });
  }
};
