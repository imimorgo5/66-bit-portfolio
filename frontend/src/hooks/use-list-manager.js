import { useCallback } from 'react';

export function useListManager(key, setEditData, maxItems = Infinity) {
  const addItem = useCallback(item => {
    setEditData(prev => {
      if (prev[key].length >= maxItems) {
        return prev;
      }
      return { ...prev, [key]: [...prev[key], item] };
    });
  }, [key, setEditData, maxItems]);

  const removeItem = useCallback(index => setEditData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) })), [key, setEditData]);

  const updateItem = useCallback((index, newItem) => 
    setEditData(prev => ({...prev, [key]: prev[key].map((item, i) => i === index ? newItem : item)})), [key, setEditData]);

  return { addItem, removeItem, updateItem };
}
