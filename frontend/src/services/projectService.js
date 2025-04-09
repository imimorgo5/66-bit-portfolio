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
  
export const createProject = (projectData) => {
    const formData = new FormData();
    formData.append('title', projectData.title);
    formData.append('description', projectData.description);
    if (projectData.image) {
        formData.append('imageFile', projectData.image);
    }

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
  