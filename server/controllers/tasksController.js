import supabase from "../supabaseClient.js";

export const getTasks = async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const tasksWithTags = await Promise.all(
      tasks.map(async (task) => {
        const { data: tagLinks, error: tagLinkError } = await supabase
          .from("task_tags")
          .select("tag_id")
          .eq("task_id", task.id);

        if (tagLinkError) throw tagLinkError;

        const tagIds = tagLinks.map((link) => link.tag_id);

        let tags = [];
        if (tagIds.length > 0) {
          const { data: tagDetails, error: tagFetchError } = await supabase
            .from("tags")
            .select("*")
            .in("id", tagIds);

          if (tagFetchError) throw tagFetchError;
          tags = tagDetails;
        }

        return {
          ...task,
          tags,
        };
      })
    );

    res.status(200).json(tasksWithTags);
  } catch (error) {
    console.error("Error getting tasks:", error);
    res.status(500).json({ message: "Error retrieving tasks", error: error.message });
  }
};

export const getTask = async (req, res) => {
  const { id } = req.params;
  try {
    const { data: task, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !task) throw error;

    const { data: tagLinks, error: tagLinkError } = await supabase
      .from("task_tags")
      .select("tag_id")
      .eq("task_id", id);

    if (tagLinkError) throw tagLinkError;

    const tagIds = tagLinks.map((link) => link.tag_id);

    let tags = [];
    if (tagIds.length > 0) {
      const { data: tagDetails, error: tagFetchError } = await supabase
        .from("tags")
        .select("*")
        .in("id", tagIds);

      if (tagFetchError) throw tagFetchError;
      tags = tagDetails;
    }

    res.status(200).json({ ...task, tags });
  } catch (error) {
    console.error("Error getting task:", error);
    res.status(500).json({ message: "Error retrieving task", error: error.message });
  }
};

export const addTask = async (req, res) => {
  const { title, description, status, due_date, tags } = req.body;

  try {
    const { data: task, error: insertError } = await supabase
      .from("tasks")
      .insert([{ title, description, status, due_date }])
      .select()
      .single();

    if (insertError) throw insertError;

    if (tags?.length) {
      const tagLinks = tags.map(tag_id => ({ task_id: task.id, tag_id }));
      const { error: tagError } = await supabase.from("task_tags").insert(tagLinks);
      if (tagError) throw tagError;
    }

    res.status(201).json({ ...task, tags: tags || [] });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, due_date, tags } = req.body;

  try {
    const { error: updateError } = await supabase
      .from("tasks")
      .update({ title, description, status, due_date })
      .eq("id", id);

    if (updateError) throw updateError;

    await supabase.from("task_tags").delete().eq("task_id", id);

    if (tags?.length) {
      const tagLinks = tags.map(tag_id => ({ task_id: id, tag_id }));
      const { error: tagInsertError } = await supabase.from("task_tags").insert(tagLinks);
      if (tagInsertError) throw tagInsertError;
    }

    const { data: updatedTask, error: fetchError } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const { data: tagLinks, error: tagFetchError } = await supabase
      .from("task_tags")
      .select("tag_id")
      .eq("task_id", id);

    if (tagFetchError) throw tagFetchError;

    const tagIds = tagLinks.map(t => t.tag_id);

    res.status(200).json({ ...updatedTask, tags: tagIds });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await supabase.from("task_tags").delete().eq("task_id", id);
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) throw error;
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Error deleting task", error: error.message });
  }
};
