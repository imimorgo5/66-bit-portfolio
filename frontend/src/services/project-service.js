export const getProjects = async () => {
  const res = await fetch('/projects/show', { credentials: 'include' });

  if (!res.ok) {
    throw new Error('Ошибка при получении проектов');
  }
  
  const data = await res.json();
  return data.projects || [];
};

export const getProjectById = async (id) => {
  const res = await fetch(`/projects/project/${id}`, { credentials: 'include' });

  if (!res.ok) {
    throw new Error('Ошибка при получении проекта');
  }
  
  const data = await res.json();
  return data.project;
};
  
export const createProject = async (projectData) => {
    const formData = new FormData();
    formData.append('title', projectData.title);

    const res = await fetch('/projects/create', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

  if (!res.ok) {
    throw new Error('Ошибка при создании проекта');
  }

  const data = await res.json();
  return data.project;
};

export const updateProject = async (id, projectData) => {
  const formData = new FormData();
  formData.append('title', projectData.title);
  
  if (projectData.description) {
    formData.append('description', projectData.description);
  }
  
  if (projectData.image) {
    formData.append('imageFile', projectData.image);
  }

  if (projectData.projectLinks && Array.isArray(projectData.projectLinks)) {
    projectData.projectLinks.forEach((link, index) => {
        formData.append(`projectLinks[${index}].link`, link.link || '');
        formData.append(`projectLinks[${index}].description`, link.description || '');
    });
  }

  if (projectData.folders && Array.isArray(projectData.folders)) {
    projectData.folders.forEach((folder, folderIndex) => {
      formData.append(`folders[${folderIndex}].title`, folder.title || '');
      if (folder.files && Array.isArray(folder.files)) {
        folder.files.forEach((file, fileIndex) => {
          formData.append(`folders[${folderIndex}].files[${fileIndex}].fileTitle`, file.title || '');
          formData.append(`folders[${folderIndex}].files[${fileIndex}].description`, file.description || '');
          formData.append(`folders[${folderIndex}].files[${fileIndex}].file`, file.file || '');
        });
      }
    });
  }

  const res = await fetch(`/projects/update/${id}`, {
    method: 'PUT',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    throw new Error('Ошибка при обновлении проекта');
  }
  const data = await res.json();
  return data.project;
};

export const deleteProject = async (id) => {
  const res = await fetch(`/projects/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error('Ошибка при удалении проекта');
  }
  
  return res;
};