import React, { useState } from 'react';

function useNoteForm(initialNote) {
  const [formData, setFormData] = useState({
    title: initialNote?.title || '',
    content: initialNote?.content || '',
    task_id: initialNote?.task_id || '',
    tags: initialNote?.tags?.map(tag => tag.id) || []
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return { formData, handleChange };
}

export default useNoteForm; 