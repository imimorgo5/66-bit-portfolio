export const createPersonProject = async (projectData) => {
    const formData = new FormData();
    formData.append('title', projectData.title);

    const res = await fetch('/projects/create-by-person', {
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

export const getPersonProjects = async () => {
  const res = await fetch('/projects/show-by-person', { credentials: 'include' });

  if (!res.ok) {
    throw new Error('Ошибка при получении проектов');
  }
  
  const data = await res.json();
  return data.projects || [];
};

export const createTeamProject = async (projectData) => {
    const formData = new FormData();
    formData.append('teamId', projectData.teamId);
    formData.append('title', projectData.title);

    const res = await fetch('/projects/create-by-team', {
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

export const getTeamProjects = async (teamId) => {
  const res = await fetch(`/projects/show-by-team/${teamId}`, { credentials: 'include' });

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

export const updateProject = async (id, projectData) => {
  const formData = new FormData();
  formData.append('title', projectData.title);
  
  if (projectData.description) {
    formData.append('description', projectData.description);
  }
  
  if (projectData.imageFile) {
    formData.append('imageFile', projectData.imageFile);
  }

  if (Array.isArray(projectData.projectLinks)) {
    projectData.projectLinks.forEach((link, index) => {
        formData.append(`projectLinks[${index}].link`, link.link);
        formData.append(`projectLinks[${index}].description`, link.description);
    });
  }
  if (Array.isArray(projectData.folders)) {
    projectData.folders.forEach((folder, folderIndex) => {
      formData.append(`folders[${folderIndex}].title`, folder.title || '');
      if (folder.files && Array.isArray(folder.files)) {
        folder.files.forEach((file, fileIndex) => {
          formData.append(`folders[${folderIndex}].files[${fileIndex}].fileTitle`, file.fileTitle);
          formData.append(`folders[${folderIndex}].files[${fileIndex}].description`, file.description);
          if (file.file instanceof File) {
            formData.append(`folders[${folderIndex}].files[${fileIndex}].file`, file.file);
          } else {
            formData.append(`folders[${folderIndex}].files[${fileIndex}].file`, new Blob([], { type: 'application/octet-stream' }), file.fileTitle);
          }
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