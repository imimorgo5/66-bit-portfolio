export const getProjects = () => {
    return fetch('/projects/show', { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при получении проектов');
        }
        return res.json();
      })
      .then((data) => data.projects || []);
};

export const getProjectById = (id) => {
  return fetch(`/projects/project/${id}`, { credentials: 'include' })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Ошибка при получении проекта');
      }
      return res.json();
    })
    .then((data) => data.project);
};
  
export const createProject = (projectData) => {
    const formData = new FormData();
    formData.append('title', projectData.title);

    return fetch('/projects/create', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
        .then((res) => {
        if (!res.ok) {
            throw new Error('Ошибка при создании проекта');
        }
        return res.json();
        })
        .then((data) => data.project);
};

export const updateProject = (id, projectData) => {
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

  return fetch(`/projects/update/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
  })
  .then((res) => {
      if (!res.ok) {
          throw new Error('Ошибка при обновлении проекта');
      }
      return res.json();
  })
  .then((data) => data.project);
};

export const deleteProject = (id) => {
  return fetch(`/projects/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
  })
  .then((res) => {
      if (!res.ok) {
          throw new Error('Ошибка при удалении проекта');
      }
      return res;
  });
};