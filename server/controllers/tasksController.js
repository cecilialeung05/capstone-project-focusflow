import supabase from "../supabaseClient.js";

export const getTasks = async (req, res) => {
  try {
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select("*, task_tags(tag_id), tags:task_tags(tag_id -> tags(*))")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formatted = tasks.map(task => ({
      ...task,
      tags: task.tags.map(t => t.tag_id)
    }));

    res.status(200).json(formatted);
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
      .select("*, task_tags(tag_id), tags:task_tags(tag_id -> tags(*))")
      .eq("id", id)
      .single();

    if (error) throw error;

    res.status(200).json({
      ...task,
      tags: task.tags.map(t => t.tag_id)
    });
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
      await supabase.from("task_tags").insert(tagLinks);
    }

    const { data: updated, error: fetchError } = await supabase
      .from("tasks")
      .select("*, task_tags(tag_id), tags:task_tags(tag_id -> tags(*))")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    res.status(200).json({
      ...updated,
      tags: updated.tags.map(t => t.tag_id)
    });
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
