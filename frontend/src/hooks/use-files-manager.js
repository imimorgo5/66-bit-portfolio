import { useCallback } from 'react';

export function useFilesManager(editData, setEditData, { parentKey, childKey = null, maxItems }) {
    const triggerAdd = useCallback((parentIndex, fileList) => {
        setEditData(prev => {
            if (childKey !== null) {
                return {
                    ...prev, [parentKey]: prev[parentKey].map((parentItem, pi) => {
                        if (pi !== parentIndex) return parentItem;
                        return {
                            ...parentItem, [childKey]: [...parentItem[childKey],
                            ...Array.from(fileList).slice(0, maxItems - parentItem[childKey].length).map(file => ({ file, fileTitle: file.name, description: '' }))]
                        };
                    })
                };
            } else {
                return {
                    ...prev, [parentKey]: [...prev[parentKey],
                    ...Array.from(fileList).slice(0, maxItems - prev[parentKey].length).map(file => ({ file, fileTitle: file.name, description: '' }))]
                };
            }
        });
    }, [parentKey, childKey, maxItems, setEditData]);

    const triggerRemove = useCallback((parentIndex, fileIndex) => {
        setEditData(prev => {
            if (childKey !== null) {
                return {
                    ...prev,
                    [parentKey]: prev[parentKey].map((parentItem, pi) => {
                        if (pi !== parentIndex) return parentItem;
                        return { ...parentItem, [childKey]: parentItem[childKey].filter((_, fi) => fi !== fileIndex) };
                    })
                };
            } else {
                return { ...prev, [parentKey]: prev[parentKey].filter((_, fi) => fi !== fileIndex) };
            }
        });
    }, [parentKey, childKey, setEditData]);

    const triggerUpdateDesc = useCallback((parentIndex, fileIndex, desc) => {
        setEditData(prev => {
            if (childKey !== null) {
                return {
                    ...prev,
                    [parentKey]: prev[parentKey].map((parentItem, pi) => {
                        if (pi !== parentIndex) return parentItem;
                        return {
                            ...parentItem, [childKey]:
                                parentItem[childKey].map((fileItem, fi) => fi === fileIndex ? { ...fileItem, description: desc } : fileItem)
                        };
                    })
                };
            } else {
                return { ...prev, [parentKey]: prev[parentKey].map((fileItem, fi) => fi === fileIndex ? { ...fileItem, description: desc } : fileItem) };
            }
        });
    }, [parentKey, childKey, setEditData]);

    return { addFiles: triggerAdd, removeFile: triggerRemove, updateDescription: triggerUpdateDesc };
}
