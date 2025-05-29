export function mapProjectToEditData(project) {
  return {
    id: project.id,
    title: project.title || '',
    description: project.description || '',
    imageName: project.imageName || '',
    imagePreviewUrl: project.imagePreviewUrl || '',
    projectLinks: Array.isArray(project.projectLinks)
      ? project.projectLinks.map(link => ({
          link: link.link,
          description: link.description || ''
        }))
      : [],
    folders: Array.isArray(project.folders)
      ? project.folders.map(folder => ({
          title: folder.title || '',
          files: Array.isArray(folder.files)
            ? folder.files.map(f => ({
                file: null,
                fileTitle: f.fileTitle,
                description: f.description || ''
              }))
            : []
        }))
      : []
  };
}

export function mapCardToEditData(card) {
  return {
    id: card.id,
    title: card.title || '',
    description: card.description || '',
    projects: Array.isArray(card.projects)
      ? card.projects.map(p => p.id)
      : [],
    cardFiles: Array.isArray(card.cardFiles)
      ? card.cardFiles.map(f => ({
          file: null,
          fileTitle: f.fileTitle,
          description: f.description || ''
        }))
      : []
  };
}
