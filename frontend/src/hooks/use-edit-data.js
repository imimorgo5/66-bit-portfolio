import { useState, useEffect } from 'react';

export function useEditData({ entity, isEditing, mapEntityToEdit, fileKeys = [] }) {
  const [editData, setEditData] = useState(null);
  
  useEffect(() => {
    if (isEditing && entity) {
      setEditData(mapEntityToEdit(entity));
    }
  }, [isEditing, entity, mapEntityToEdit]);

  return { editData, setEditData };
}
