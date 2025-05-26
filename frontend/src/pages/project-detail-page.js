import React, { useContext, useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate, NavLink, Link } from 'react-router-dom';
import Header from '../components/header-component.js';
import ErrorComponent from '../components/error-component.js';
import LoadingComponent from '../components/loading-component.js';
import { AuthContext } from '../context/AuthContext';
import { getProjectById, updateProject, deleteProject } from '../services/project-service.js';
import { getPublicProject } from '../services/public-service.js';
import { getTeamById } from '../services/team-service.js';
import { normalizeUrl } from '../utils/utils.js';
import { PageMode } from '../consts.js';
import defaultPreview from '../img/defaultPreview.png';
import linkIcon from '../img/link_icon.svg';
import folderIcon from '../img/folder_icon.png';
import fileIcon from '../img/file_icon.svg';
import '../css/project-detail.css';

export default function ProjectDetailPage({ pageMode }) {
  const { identifier } = useParams();
  const { user, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const backTo = params.get('from');
  const [project, setProject] = useState(null);
  const [team, setTeam] = useState(null);
  const [projectLoading, setProjectLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [isTeamProject, setIsTeamProject] = useState(false);
  const [isEditing, setIsEditing] = useState(location.state?.isEdit);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    projectLinks: [],
    folders: [],
    imageName: '',
    imagePreviewUrl: '',
  });
  const [linkInput, setLinkInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foldersFilesLoaded, setFoldersFilesLoaded] = useState(false);
  const photoInputRef = useRef(null);
  const isPublicProject = pageMode === PageMode.PUBLIC;

  useEffect(() => {
    async function init() {
      try {
        if (isPublicProject) {
          await getPublicProject(identifier).then(data => setProject(data.project));
        } else if (pageMode === PageMode.PRIVATE) {
          await getProjectById(identifier)
            .then((fetchedProject) => {
              setProject(fetchedProject);
              setIsTeamProject(Boolean(fetchedProject.teamId));
            });
        } else {
          throw new Error();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProjectLoading(false);
      }
    }
    init();
  }, [identifier, pageMode, isPublicProject]);

  useEffect(() => {
    async function init() {
      if (!projectLoading && project && isTeamProject) {
        await getTeamById(project.teamId).then(setTeam).catch(console.error).finally(() => setTeamLoading(false));
      }
    }
    init();
  }, [projectLoading, isTeamProject, project])

  useEffect(() => {
    if (project && (!isTeamProject || team) && isEditing) {
      setFoldersFilesLoaded(false);
      setEditData({
        ...project,
        folders: project.folders ? project.folders.map(f => ({ title: f.title, files: f.files ? [...f.files] : [] })) : [],
        imagePreviewUrl: project.imagePreviewUrl || ''
      });
    }
  }, [isEditing, project, isTeamProject, team]);

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
        });
    }
  }, [isEditing, foldersFilesLoaded, editData]);

  const handleEditClick = () => setIsEditing(true);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSaveEdit = async () => {
    await updateProject(project.id, editData)
      .then(() => getProjectById(project.id))
      .then((updatedProject) => {
        setProject(updatedProject);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleDelete = async () => await deleteProject(project.id).then(() => navigate(backTo)).catch(console.error);

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
    if (editData.projectLinks >= 8) {
      return;
    }

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

  if (projectLoading || (!isPublicProject && (authLoading || (isTeamProject && teamLoading)))) return <LoadingComponent />;
  if (!project || (!isPublicProject && (authError || (isTeamProject && !team)))) return <ErrorComponent />;
  if (!isPublicProject && !user) {
    navigate('/login');
    return null;
  }

  return (
    <div className={`project-detail-page ${pageMode}`}>
      {!isPublicProject && <Header />}
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
                <button type="button" onClick={triggerPhotoInput} className="button add-submit-button change-project-photo-button">Изменить фото</button>
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
                {editData.projectLinks.length > 0 ? (
                  <ul className="project-links-list">
                    {editData.projectLinks.map((link, index) => (
                      <li key={index} className="edit-project-link-item">
                        <button type="button" onClick={() => removeLink(index)} className="remove-button">×</button>
                        <div className='edit-project-link-item-container'>
                          <Link to={normalizeUrl(link.link)} target="_blank" rel="noopener noreferrer" className="link edit-project-link-title">
                            {link.link.length > 30 ? link.link.slice(0, 27) + '...' : link.link}</Link>
                          <input
                            type="text"
                            value={link.description}
                            maxLength={38}
                            onChange={(e) => handleLinkDescriptionChange(index, e.target.value)}
                            placeholder="Описание ссылки"
                            className="text-input project-link-description-input"
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
                    placeholder={editData.projectLinks.length >= 8 ? 'Достигнут максимум ссылок' : 'Введите ссылку'}
                    className="text-input project-link-input"
                    disabled={editData.projectLinks.length >= 8}
                  />
                  <button type="button" onClick={addLink} disabled={editData.projectLinks.length >= 8} className="button add-submit-button add-project-link-button">Добавить</button>
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
                className="text-input edit-project-title"
              />
              <label>Описание проекта:</label>
              <textarea
                name="description"
                value={editData.description}
                placeholder='Введите описание проекта'
                maxLength={2000}
                onChange={handleChange}
                className="text-input edit-project-description"
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
                          <button type="button" className="remove-button" onClick={() => removeFolder(index)}>×</button>
                          <input
                            type="text"
                            className="text-input folder-name-input"
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
                                <button type="button" className="remove-button" onClick={() => removeFile(index, fj)}>×</button>
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
                                    className="text-input folder-file-description-input"
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
                          className="button add-submit-button add-folder-files-button"
                        >
                          Добавить файлы
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='project-empty-list'>Не создано ни одной папки</p>
                )}
                <button type="button" className="button add-submit-button add-folder-button" onClick={addFolder} disabled={editData.folders.length >= 4}>Создать папку</button>
              </div>
              <div className="edit-project-detail-actions">
                <button type="button" className="button add-submit-button project-save-button" onClick={handleSaveEdit}>Сохранить</button>
                <button type="button" className="button cancel-delete-button project-cancel-button" onClick={handleCancelEdit}>Отменить</button>
              </div>
            </div>
          </div>
        ) : (
          <div className='project-detail-container'>
            <div className='project-appendices-container'>
              {!isPublicProject && <NavLink to={backTo} className='link back-to project-link'><span>←</span> Назад</NavLink>}
              <div className='project-image-container'>
                <img
                  src={project.imageName ? `http://localhost:8080/uploads/${project.imageName}` : defaultPreview}
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
                        <Link to={normalizeUrl(link.link)} target="_blank" rel="noopener noreferrer" className="link project-link-title">
                          {link.description || (link.link.length > 30 ? link.link.slice(0, 27) + '...' : link.link)}
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
              <p className='project-description'>{project.description ? project.description : 'Описание не добавлено'}</p>
            </div>
            <div className='project-appendices-container'>
              <div className={'project-folders-container' + (isTeamProject && team.adminId !== user.id ? ' not-admin' : '')}>
                <h3>Папки:</h3>
                {project.folders && project.folders.length > 0 ? (
                  <ul className="project-folders-list">
                    {project.folders.map((folder, index) => (
                      <li key={index} className="project-folder-item" onClick={() => {
                        setSelectedFolder(index);
                        setIsModalOpen(true);
                      }}>
                        <img className='folder-icon' src={folderIcon} alt='Иконка папки'></img>
                        <h4 className="link folder-title">{folder.title}</h4>
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
                    <button className="remove-button" onClick={() => setIsModalOpen(false)}>×</button>
                  </div>
                  <div className="modal-folder-content">
                    {project.folders[selectedFolder].files.length > 0 ? (
                      <ul className="modal-folder-files-list">
                        {project.folders[selectedFolder].files.map((file, fi) => (
                          <li key={fi} className="modal-folder-file-item">
                            <img src={fileIcon} className='file-icon' alt='Иконка файла'></img>
                            <h4 className="link folder-file-title" onClick={() => handleFileClick(file)}>{file.description ? file.description : file.fileTitle.split('_').at(-1).slice(0, 28)}</h4>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className='project-empty-list'>В этой папке нет файлов</p>
                    )}
                  </div>
                </div>
              )}
              {(!isPublicProject && (!isTeamProject || team.adminId === user.id)) &&
                <div className="project-detail-actions">
                  <button type="button" className="button edit-button project-edit-button" onClick={handleEditClick}>Изменить</button>
                  <button type="button" className="button cancel-delete-button project-delete-button" onClick={handleDelete}>Удалить</button>
                </div>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
