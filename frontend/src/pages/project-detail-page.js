import React, { useState, useEffect, useRef  } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Header from '../components/header';
import '../css/project-detail.css';
import defaultPreview from '../img/defaultPreview.png';
import linkIcon from '../img/link_icon.svg';
import folderIcon from '../img/folder_icon.svg';
import { getProjectById, updateProject, deleteProject } from '../services/projectService.js';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const photoInputRef = useRef(null);

  useEffect(() => {
    getProjectById(id)
      .then((fetchedProject) => {
        setProject(fetchedProject);
      })
      .catch((error) => console.error('Ошибка получения проекта:', error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEditClick = () => {
    setEditData({
      title: project.title || '',
      description: project.description || '',
      projectLinks: project.projectLinks ? [...project.projectLinks] : [],
      folders: project.folders ? [...project.folders] : [],
      imageName: project.imageName,
      imagePreviewUrl: project.imagePreviewUrl || ''
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSaveEdit = () => {
    updateProject(project.id, editData)
      .then(() => getProjectById(project.id))
      .then((updatedProject) => {
        setProject(updatedProject);
        setIsEditing(false);
      })
      .catch((error) => console.error('Ошибка при обновлении проекта:', error));
  };

  const handleDelete = () => {
    deleteProject(project.id)
      .then(() => navigate(-1))
      .catch((error) => console.error('Ошибка при удалении проекта:', error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData(prev => ({ ...prev, image: file, imagePreviewUrl: url }));
    }
  };

  const triggerPhotoInput = () => {
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
      photoInputRef.current.click();
    }
  };

  const handleLinkChange = (e) => {
    const newLink = { link: e.target.value };
      setEditData(prev => ({
        ...prev,
        projectLinks: [newLink]
      }));
  };
  
  const handleFolderNameChange = (index, newName) => {
    setEditData(prev => {
      const updatedFolders = [...prev.folders];
      updatedFolders[index] = { ...updatedFolders[index], name: newName };
      return { ...prev, folders: updatedFolders };
    });
  };
  
  const addFolder = () => {
    setEditData(prev => ({ ...prev, folders: [...prev.folders, { name: '' }] }));
  };
  
  const removeFolder = (index) => {
    setEditData(prev => ({
      ...prev,
      folders: prev.folders.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div>Загрузка...</div>;
  if (!project) return <div>Проект не найден</div>;

  return (
    <div className="project-detail-page">
      <Header />
      <div className="project-detail-content">
        {isEditing ? (
          <div className='project-detail-container'>
            <div className='edit-project-description-container'>
              <input
                type="text"
                name="title"
                value={editData.title}
                maxLength={25}
                onChange={handleChange}
                className="edit-project-title"
              />
              <label>Описание проекта:</label>
              <textarea
                name="description"
                value={editData.description}
                placeholder='Введите описание проекта'
                maxLength={2000}
                onChange={handleChange}
                className="edit-project-description"
              />
            </div>
            <div className='edit-project-appendices-container'>
              <div className='edit-project-image-container'>
                <img 
                  src={
                    editData.imagePreviewUrl
                      ? editData.imagePreviewUrl
                      : (project.imageName
                        ? `http://localhost:8080/uploads/${project.imageName}` 
                        : defaultPreview)
                  }
                  className="edit-project-preview-img"
                  alt="Фото проекта"
                />
                <button type="button" onClick={triggerPhotoInput} className="change-project-photo-button">Изменить фото</button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  ref={photoInputRef}
                  style={{ display: 'none' }}
                />
              </div>
              <div className='edit-project-link-container'>
                <input
                  type="text"
                  id="project-link-input"
                  className="project-link-input"
                  value={editData.projectLinks && editData.projectLinks.length > 0 ? editData.projectLinks[0].link : ''}
                  maxLength={200}
                  onChange={handleLinkChange}
                  placeholder="Введите ссылку на проект"
                />
              </div>
              <div className='edit-project-files-container'>
                <h3>Папки:</h3>
                {editData.folders && editData.folders.length > 0 ? (
                  <ul className="edit-project-folders-list">
                    {editData.folders.map((folder, index) => (
                      <li key={index} className="edit-project-folder-item">
                        <button type="button" className="remove-folder-button" onClick={() => removeFolder(index)}>×</button>
                        <input
                          type="text"
                          className="folder-name-input"
                          value={folder.name}
                          maxLength={40}
                          onChange={(e) => handleFolderNameChange(index, e.target.value)}
                          placeholder="Название папки"
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='project-empty-list'>Не создано ни одной папки</p>
                )}
                <button type="button" className="add-folder-button" onClick={addFolder}>Добавить папку</button>
              </div>
              <div className="edit-project-detail-actions">
                <button type="button" className="project-save-button" onClick={handleSaveEdit}>Сохранить</button>
                <button type="button" className="project-cancel-button" onClick={handleCancelEdit}>Отменить</button>
              </div>
            </div>
          </div>
        ) : (
          <div className='project-detail-container'>
            <div className='back-to-project-container'>
              <NavLink to='/'><span>←</span> Назад к проектам</NavLink>
            </div>
            <div className='project-description-container'>
              <h2>{project.title}</h2>
              <label>Описание проекта:</label>
              <p className='project-description'>{project.description}</p>
            </div>
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
              <div className='project-link-container'>
                {project.projectLinks && project.projectLinks.length > 0 ? (
                  <div className='project-link-item'>
                    <a href={project.projectLinks[0].link} className="project-link">{project.projectLinks[0].link}</a>
                    <img className='link-icon' src={linkIcon} alt='Иконка ссылки'></img>
                  </div>
                ) : <p className='project-empty-list'>Ссылка не добавлена</p>}
              </div>
              <div className='project-files-container'>
                <h3>Папки:</h3>
                {project.folders && project.folders.length > 0 ? (
                  <ul className="project-folders-list">
                      {project.folders.map((folder, index) => (
                        <li key={index} className="project-folder-item">
                          <img className='folder-icon' src={folderIcon} alt='Иконка папки'></img>
                          <h4 className="folder-title">{folder.name}</h4>
                        </li>
                      ))}
                    </ul>
                  ) : <p className='project-empty-list'>Не создано ни одной папки</p>}
              </div>
              <div className="project-detail-actions">
                <button type="button" className="project-edit-button" onClick={handleEditClick}>Изменить</button>
                <button type="button" className="project-delete-button" onClick={handleDelete}>Удалить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
