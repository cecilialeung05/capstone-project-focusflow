export const normalizeData = (data, isDevMode) => {
  if (isDevMode) {
    // If in dev mode, data is already in the correct format
    return data;
  }

  // If not in dev mode, transform the data from DB format if needed
  return {
    ...data,
    notes: data.notes.map(note => ({
      ...note,
      note_tags: note.tags?.map(tagId => ({ tag_id: tagId })) || []
    })),
    tasks: data.tasks.map(task => ({
      ...task,
      task_tags: task.tags?.map(tagId => ({ tag_id: tagId })) || []
    }))
  };
}; 