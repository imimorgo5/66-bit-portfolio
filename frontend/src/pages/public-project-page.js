import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicProject } from '../services/public-service.js';
import '../css/project-detail.css';
import defaultPreview from '../img/defaultPreview.png';
import linkIcon from '../img/link_icon.svg';
import folderIcon from '../img/folder_icon.png';
import fileIcon from '../img/file_icon.svg';

export default function PublicProjectPage() {
  const { token } = useParams();
  const [project, setProject] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getPublicProject(token)
      .then(data => setProject(data.project))
      .catch(() => setProject(undefined));
  }, [token]);

  const handleFileClick = async (file) => {
    try {
      const response = await fetch(`http://localhost:8080/uploads/${file.fileTitle}`, {
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка при скачивании файла: ${response.status}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);  
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileTitle;
      document.body.appendChild(link);
      link.click();
  
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    }
  };

  if (project === null) return <p>Загрузка…</p>;
  if (project === undefined) return <p>Проект не найден или ссылка просрочена.</p>;

  return (
    <div className="project-detail-content">
        <div className='project-detail-container'>
            <div className='project-appendices-container'>
                <div className='project-image-container'>
                    <img 
                        src={project.imageName
                        ? `http://localhost:8080/uploads/${project.imageName}` 
                        : defaultPreview}
                        className='project-preview-img' 
                        alt="Фото проекта"
                    />
                </div>
                <div className="project-links public-project-links">
                    <h3 className='project-links-title'>Ссылки:</h3>
                    {project.projectLinks && project.projectLinks.length > 0 ? (
                        <ul className="project-links-list">
                            {project.projectLinks.map((link, index) => (
                                <li key={index} className='project-links-item'>
                                <a
                                    className="project-link-title"
                                    href={link.link}
                                >
                                    {link.description || link.link}
                                </a>
                                <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                                </li>
                            ))}
                        </ul>
                    ) : <p className='project-empty-list'>Не указано</p>}
                </div>
            </div>
            <div className='project-description-container public-project-description-container'>
                <h2>{project.title}</h2>
                <label>Описание проекта:</label>
                <p className='project-description'>{project.description}</p>
            </div>
            <div className='project-appendices-container'>
                <div className='project-folders-container public-project-folders-container'>
                    <h3>Папки:</h3>
                    {project.folders && project.folders.length > 0 ? (
                        <ul className="project-folders-list">
                            {project.folders.map((folder, index) => (
                            <li key={index} className="project-folder-item"onClick={() => {
                                setSelectedFolder(index);
                                setIsModalOpen(true);
                                }}>
                                <img className='folder-icon' src={folderIcon} alt='Иконка папки'></img>
                                <h4 className="folder-title">{folder.title}</h4>
                            </li>
                            ))}
                        </ul>
                        ) : (
                    <p className="project-empty-list">Не создано ни одной папки</p>
                    )}
                </div>
                {isModalOpen && selectedFolder !== null && (
                    <div className="modal-folder-overlay">
                        <button className="modal-folder-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                        <div className="modal-folder-content">
                            <h3>{project.folders[selectedFolder].title}</h3>
                            {project.folders[selectedFolder].files.length > 0 ? (
                            <ul className="modal-folder-files-list">
                                {project.folders[selectedFolder].files.map((file, fi) => (
                                <li key={fi} className="modal-folder-file-item">
                                    <img src={fileIcon} className='file-icon' alt='Иконка файла'></img>
                                    <h4 className="folder-file-title" onClick={() => handleFileClick(file)}>{file.description ? file.description : file.fileTitle.split('_').at(-1).split(0, 28)}</h4>
                                </li>
                                ))}
                            </ul>
                            ) : (
                            <p className='project-empty-list'>В этой папке нет файлов</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
