import React, { useContext, useState, useEffect, useRef  } from 'react';
import { useLocation, useParams, useNavigate, NavLink, Link } from 'react-router-dom';
import Header from '../components/header';
import '../css/project-detail.css';
import { AuthContext } from '../context/AuthContext';
import defaultPreview from '../img/defaultPreview.png';
import linkIcon from '../img/link_icon.svg';
import folderIcon from '../img/folder_icon.png';
import fileIcon from '../img/file_icon.svg';
import { getProjectById, updateProject, deleteProject } from '../services/project-service.js';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const backTo = params.get('from');
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [linkInput, setLinkInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foldersFilesLoaded, setFoldersFilesLoaded] = useState(false);

  const photoInputRef = useRef(null);

  useEffect(() => {
    getProjectById(id)
      .then((fetchedProject) => {
        setProject(fetchedProject);
      })
      .catch((error) => console.error('Ошибка получения проекта:', error))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (
      isEditing &&
      !foldersFilesLoaded &&
      editData &&
      editData.folders &&
      editData.folders.some(folder =>
        folder.files && folder.files.some(f => !f.file)
      )
    ) {
      Promise.all(
        editData.folders.map(async (folder) => {
          if (!folder.files) return folder;
          const filesWithData = await Promise.all(
            folder.files.map(async (f) => {
              if (f.file) return f;
              try {
                const resp = await fetch(
                  `http://localhost:8080/uploads/${f.fileTitle}`,
                  { credentials: 'include' }
                );
                if (!resp.ok) {
                  console.error(`Ошибка получения файла ${f.fileTitle}: ${resp.status}`);
                  return f;
                }
                const blob = await resp.blob();
                const fetchedFile = new File([blob], f.fileTitle, { type: blob.type });
                return { ...f, file: fetchedFile };
              } catch (err) {
                console.error('Ошибка при получении файла для редактирования:', err);
                return f;
              }
            })
          );
          return { ...folder, files: filesWithData };
        })
      )
      .then((foldersWithFiles) => {
        setEditData(prev => ({ ...prev, folders: foldersWithFiles }));
        setFoldersFilesLoaded(true);
      })
      .catch(err => {
        console.error('Ошибка загрузки файлов папок для редактирования:', err);
      });  }
  }, [isEditing, foldersFilesLoaded, editData]);

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

  const handleEditClick = () => {
    setFoldersFilesLoaded(false);
    setEditData({
      title: project.title || '',
      description: project.description || '',
      projectLinks: project.projectLinks ? [...project.projectLinks] : [],
      folders: project.folders
        ? project.folders.map(f => ({
            title: f.title,
            files: f.files ? [...f.files] : [],
          }))
        : [],
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

  const handleLinkDescriptionChange = (index, value) => {
    setEditData(prev => {
      const updatedLinks = prev.projectLinks.map((link, i) => 
        i === index ? { ...link, description: value } : link
      );
      return { ...prev, projectLinks: updatedLinks };
    });
  }

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed !== '') {
      const newLink = { link: trimmed, description: '' };
      setEditData(prev => ({
        ...prev,
        projectLinks: prev.projectLinks ? [...prev.projectLinks, newLink] : [newLink]
      }));
      setLinkInput('');
    }
  };

  const removeLink = (index) => {
    setEditData(prev => ({
      ...prev,
      projectLinks: prev.projectLinks.filter((_, i) => i !== index)
    }));
  };
  
  const handleFolderNameChange = (index, newName) => {
    setEditData(prev => {
      const updatedFolders = [...prev.folders];
      updatedFolders[index] = { ...updatedFolders[index], title: newName };
      return { ...prev, folders: updatedFolders };
    });
  };
  
  const addFolder = () => {
    if (editData.folders.length >= 4) return;
    setEditData(prev => ({
      ...prev,
      folders: [...prev.folders, { title: 'Новая папка', files: [] }],
    }));
  };
  
  const removeFolder = (index) => {
    setEditData(prev => ({
      ...prev,
      folders: prev.folders.filter((_, i) => i !== index)
    }));
  };

  const removeFile = (folderIdx, fileIdx) => {
    setEditData(prev => {
      const folders = prev.folders.map((f, i) => {
        if (i !== folderIdx) return f;
        return { ...f, files: f.files.filter((_, j) => j !== fileIdx) };
      });
      return { ...prev, folders };
    });
  };

  const handleAddFilesToFolder = (folderIdx, fileList) => {
  const files = Array.from(fileList);
  setEditData(prev => {
    const folders = prev.folders.map((f, i) => {
      if (i !== folderIdx) return f;
      const existing = f.files || [];
      const slots = 5 - existing.length;
      const toAdd = files.slice(0, slots).map(file => ({
        file,
        fileTitle: file.name,
        description: ''
      }));
      return {
        ...f,
        files: [...existing, ...toAdd]
      };
    });
    return { ...prev, folders };
  });
};

  const handleFileDescriptionChange = (folderIdx, fileIdx, newDesc) => {
  setEditData(prev => {
    const folders = prev.folders.map((f, i) => {
      if (i !== folderIdx) return f;
      const files = f.files.map((file, j) => 
        j === fileIdx
          ? { ...file, description: newDesc }
          : file
      );
      return { ...f, files };
    });
    return { ...prev, folders };
  });
};

  if (loading || authLoading) return <div className='loading-container'>Загрузка...</div>;
  if (!project || authError) return <div className='error-container'>Ошибка получения данных...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="project-detail-page">
      <Header />
      <div className="project-detail-content">
        {isEditing ? (
          <div className='project-detail-container'>
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
              <div className="edit-project-links">
                <h3 className='project-links-title'>Ссылки:</h3>
                {editData.projectLinks && editData.projectLinks.length > 0 ? (
                    <ul className="project-links-list">
                      {editData.projectLinks.map((link, index) => (
                        <li key={index} className="edit-project-link-item">
                          <button type="button" onClick={() => removeLink(index)} className="remove-project-link-button">×</button>
                          <div className='edit-project-link-item-container'>
                            <Link to={link.link} target="_blank" rel="noopener noreferrer" className="edit-project-link-title">
                              {link.link.length > 30 ? link.link.slice(0, 27) + '...' : link.link}</Link>
                            <input
                              type="text"
                              value={link.description}
                              maxLength={38}
                              onChange={(e) => handleLinkDescriptionChange(index, e.target.value)}
                              placeholder="Описание ссылки"
                              className="project-link-description-input"
                            />
                          </div>
                        </li>))}
                    </ul>) : <p className='project-empty-list'>Не указано</p>}
                <div className="project-link-input-group">
                    <input
                      type="text"
                      value={linkInput}
                      maxLength={200}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="Введите ссылку"
                      className="project-link-input"
                    />
                    <button type="button" onClick={addLink} className="add-project-link-button">Добавить</button>
                </div>
            </div>
            </div>
            <div className='edit-project-description-container'>
              <input
                type="text"
                name="title"
                value={editData.title}
                maxLength={24}
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
              <div className='edit-project-folders-container'>
                <h3>Папки:</h3>
                {editData.folders && editData.folders.length > 0 ? (
                  <ul className="edit-project-folders-list">
                    {editData.folders.map((folder, index) => (
                      <li key={index} className="edit-project-folder-item">
                        <div className='folder-name-input-container'>
                          <button type="button" className="remove-folder-button" onClick={() => removeFolder(index)}>×</button>
                          <input
                            type="text"
                            className="folder-name-input"
                            value={folder.title}
                            maxLength={40}
                            onChange={(e) => handleFolderNameChange(index, e.target.value)}
                            placeholder="Название папки"
                          />
                        </div>
                        {folder.files && folder.files.length > 0 && (
                          <ul className="edit-folder-files-list">
                            {folder.files.map((f, fj) => (
                              <li key={fj} className="edit-folder-file-item">
                                <button
                                  type="button"
                                  className="remove-folder-file-button"
                                  onClick={() => removeFile(index, fj)}
                                >
                                  ×
                                </button>
                                <div className='edit-folder-file-item-container'>
                                  <h4 className='edit-folder-file-title'>{f.fileTitle.split('_').at(-1).slice(0, 28)}</h4>
                                    <input
                                      type="text"
                                      placeholder="Описание файла"
                                      value={f.description || ''}
                                      maxLength={38}
                                      onChange={e => 
                                        handleFileDescriptionChange(index, fj, e.target.value)
                                      }
                                      className="folder-file-description-input"
                                    />
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                        <input
                          type="file"
                          multiple
                          style={{ display: 'none' }}
                          id={`file-input-${index}`}
                          onChange={e => {
                            handleAddFilesToFolder(index, e.target.files);
                            e.target.value = '';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`file-input-${index}`).click()}
                          disabled={folder.files.length >= 5}
                          className="add-folder-files-button"
                        >
                          Добавить файлы
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='project-empty-list'>Не создано ни одной папки</p>
                )}
                <button type="button" className="add-folder-button" onClick={addFolder} disabled={editData.folders.length >= 4}>Создать папку</button>
              </div>
              <div className="edit-project-detail-actions">
                <button type="button" className="project-save-button" onClick={handleSaveEdit}>Сохранить</button>
                <button type="button" className="project-cancel-button" onClick={handleCancelEdit}>Отменить</button>
              </div>
            </div>
          </div>
        ) : (
          <div className='project-detail-container'>
            <div className='project-appendices-container'>
              <NavLink to={backTo} className='back-to-project'><span>←</span> Назад</NavLink>
              <div className='project-image-container'>
                <img 
                  src={project.imageName
                    ? `http://localhost:8080/uploads/${project.imageName}` 
                    : defaultPreview}
                  className='project-preview-img' 
                  alt="Фото проекта"
                />
              </div>
              <div className="project-links">
                <h3 className='project-links-title'>Ссылки:</h3>
                {project.projectLinks && project.projectLinks.length > 0 ? (
                  <ul className="project-links-list">
                    {project.projectLinks.map((link, index) => (
                      <li key={index} className='project-links-item'>
                        <Link to={link.link} target="_blank" rel="noopener noreferrer" className="project-link-title">
                          {link.description ? link.description : link.link.length > 30 ? link.link.slice(0, 27) + '...' : link.link}
                        </Link>
                        <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                      </li>
                    ))}
                  </ul>
                ) : <p className='project-empty-list'>Не указано</p>}
              </div>
            </div>
            <div className='project-description-container'>
              <h2>{project.title}</h2>
              <label>Описание проекта:</label>
              <p className='project-description'>{project.description}</p>
            </div>
            <div className='project-appendices-container'>
              <div className='project-folders-container'>
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
                <div className='modal-folder-header'>
                   <h3>{project.folders[selectedFolder].title}</h3>
                   <button className="modal-folder-close-btn" onClick={() => setIsModalOpen(false)}>×</button>
                </div>
                <div className="modal-folder-content">
                  {project.folders[selectedFolder].files.length > 0 ? (
                    <ul className="modal-folder-files-list">
                      {project.folders[selectedFolder].files.map((file, fi) => (
                        <li key={fi} className="modal-folder-file-item">
                          <img src={fileIcon} className='file-icon' alt='Иконка файла'></img>
                          <h4 className="folder-file-title" onClick={() => handleFileClick(file)}>{file.description ? file.description : file.fileTitle.split('_').at(-1).slice(0, 28)}</h4>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='project-empty-list'>В этой папке нет файлов</p>
                  )}
                </div>
              </div>
            )}
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
