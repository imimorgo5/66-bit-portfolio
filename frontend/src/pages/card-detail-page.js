import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, NavLink, Link  } from 'react-router-dom';
import Header from '../components/header';
import '../css/card-detail.css';
import { AuthContext } from '../context/AuthContext';
import { getCardById, updateCard, deleteCard } from '../services/card-service.js';
import { getProjects } from '../services/project-service.js';
import userIcon from '../img/user-icon.svg';
import fileIcon from '../img/file_icon.svg';
import linkIcon from '../img/link_icon.svg';

export default function CardDetailPage() {
  const { id } = useParams();
  const { user, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filesLoaded, setFilesLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [showProjectsList, setShowProjectsList] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = React.useRef(null);
  const projectsListRef = useRef(null);
  const projectsButtonRef = useRef(null);

  useEffect(() => {
    getCardById(id)
      .then((fetchedCard) => {
        setCard(fetchedCard);
      })
      .catch((error) => {
        console.error('Ошибка получения карточки:', error);
      })
      .finally(() => setLoading(false));
  }, [id, authLoading]);

  useEffect(() => {
    if (isEditing) {
      getProjects()
        .then(data => setProjects(data))
        .catch(err => console.error(err));
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && !filesLoaded && editData && editData.cardFiles && editData.cardFiles.some(file => !file.file)) {
      Promise.all(
        editData.cardFiles.map(async (file) => {
          if (file.file) return file;
          try {
            const response = await fetch(`http://localhost:8080/uploads/${file.fileTitle}`, { credentials: 'include' });
            if (!response.ok) {
              console.error(`Ошибка получения файла ${file.fileTitle}: ${response.status}`);
              return file;
            }
            const blob = await response.blob();
            const fetchedFile = new File([blob], file.fileTitle, { type: blob.type });
            return { ...file, file: fetchedFile };
          } catch (err) {
            console.error('Ошибка при получении файла для редактирования:', err);
            return file;
          }
        })
      )
      .then((filesWithData) => {
        setEditData(prev => ({ ...prev, cardFiles: filesWithData }));
        setFilesLoaded(true);
      })
      .catch((error) => {
        console.error('Ошибка загрузки файлов для редактирования:', error);
      });
    }
  }, [isEditing, filesLoaded, editData]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        projectsListRef.current &&
        !projectsListRef.current.contains(event.target) &&
        projectsButtonRef.current &&
        !projectsButtonRef.current.contains(event.target)
      ) {
        setShowProjectsList(false);
      }
    }
  
    if (showProjectsList) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProjectsList]);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/cards/shared/${card.shareToken}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
      })
  }

  const handleEditClick = () => {
    setEditData({
      ...card,
      projects: card.projects ? card.projects.map(p => p.id) : []
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      ...card,
      projects: card.projects ? card.projects.map(p => p.id) : []
     });
    setShowProjectsList(false);
  };

  const handleSaveEdit = () => {
    const payload = {
      ...editData,
      projects: editData.projects
    };
    updateCard(card.id, payload)
      .then(() => {
        return getCardById(card.id);
      })
      .then((updatedCard) => {
        setCard(updatedCard);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Ошибка при обновлении карточки:', error);
      });
  };

  const handleDelete = () => {
    deleteCard(card.id)
      .then(() => {
        navigate(-1);
      })
      .catch((error) => {
        console.error('Ошибка при удалении карточки:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      fileTitle: file.name, 
      description: '',
    }));
    setEditData(prev => ({
      ...prev,
      cardFiles: prev.cardFiles ? [...prev.cardFiles, ...newFiles] : newFiles
    }));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const removeFile = (index) => {
    setEditData(prev => ({
      ...prev,
      cardFiles: prev.cardFiles.filter((_, i) => i !== index)
    }));
  };

  const handleFileDescriptionChange = (index, value) => {
    setEditData(prev => {
      const updatedFiles = prev.cardFiles.map((file, i) => 
        i === index ? { ...file, description: value } : file
      );
      return { ...prev, cardFiles: updatedFiles };
    });
  };

  const addProjectToCard = projectId => {
    setEditData(prev => {
      const arr = prev.projects || [];
      return arr.includes(projectId)
        ? prev
        : { ...prev, projects: [...arr, projectId] };
    });
  };

  const removeProject = idx => {
    setEditData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  if (loading || authLoading) return <div className='loading-container'>Загрузка...</div>;
  if (!card || authError) return <div className='error-container'>Ошибка получения данных...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="card-detail-page">
      <Header />
      <div className="card-detail-content">
        {isEditing ? (
          <div className='card-detail-container'>
            <div className='edit-card-description-container'>
                <input
                    type="text"
                    name="title"
                    value={editData.title}
                    maxLength={24}
                    onChange={handleChange}
                    className="edit-card-title"
                />
                <label>Описание карточки:</label>
                <textarea
                      name="description"
                      value={editData.description}
                      maxLength={2000}
                      onChange={handleChange}
                      className="edit-card-description"
                />
            </div>
            <div className='edit-card-appendices-container'>
                <div className='edit-card-projects'>
                    <h3>Проекты:</h3>
                    {editData.projects && editData.projects.length > 0 ? (
                      <ul className="card-projects-list">
                        {editData.projects.map((projId, idx) => {
                          const proj = projects.find(p => p.id === projId);
                          return (
                            <li key={idx} className="edit-card-projects-item">
                              <button
                                onClick={() => removeProject(idx)}
                                className="remove-card-project-button"
                              >×</button>
                              <h4 className="edit-card-project-title">
                                {proj ? proj.title : '...'}
                              </h4>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="card-empty-list">Проекты не прикреплены</p>
                    )}
                    <div className='project-upload-button-container'>
                      <button
                        ref={projectsButtonRef}
                        onClick={() => setShowProjectsList(o => !o)}
                        className="project-upload-button"
                      >
                        Добавить проект
                      </button>

                      {showProjectsList && (
                        projects ? (
                        <ul className="project-suggestions-list" ref={projectsListRef}>
                          {projects.map(project => (
                            <li key={project.id} onClick={() => addProjectToCard(project.id)}>
                              {project.title}
                            </li>
                          ))}
                        </ul>)
                        : <div className="projects-empty-dropdown" ref={projectsListRef}><p>Проектов нет</p></div>)}
                    </div>
                </div>
                <div className="edit-card-files">
                    <h3>Файлы:</h3>
                    {editData.cardFiles && editData.cardFiles.length > 0 ? (
                        <ul className="card-files-list">
                          {editData.cardFiles.map((file, index) => (
                            <li key={index} className="edit-card-file-item">
                              <button type="button" onClick={() => removeFile(index)} className="remove-card-file-button">×</button>
                              <div className='edit-file-item-container'>
                                <h4 className="edit-file-title">{file.fileTitle ? file.fileTitle.split('_').at(-1).split(0, 38) : 'Ошибка получения файла'}</h4>
                                <input
                                  type="text"
                                  value={file.description}
                                  maxLength={24}
                                  onChange={(e) => handleFileDescriptionChange(index, e.target.value)}
                                  placeholder="Описание файла"
                                  className="file-description-input"
                                />
                              </div>
                            </li>))}
                        </ul>) : <p className='card-empty-list'>Файлы не прикреплены</p>}
                    <button type="button" onClick={triggerFileInput} className="file-upload-button">Добавить файлы</button>
                    <input
                        type="file"
                        accept="*/*"
                        multiple
                        onChange={handleFilesChange}
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                    />
                </div>
                <div className="edit-card-detail-actions">
                  <button type="button" className="save-button" onClick={handleSaveEdit}>Сохранить</button>
                  <button type="button" className="cancel-button" onClick={handleCancelEdit}>Отменить изменения</button>
                </div>
            </div>
        </div>
        ) : (
          <div className='card-detail-container'>
            <div className='card-user-container'>
              <NavLink to='/cards' className='back-to-cards'><span>←</span> Назад к карточкам</NavLink>
              <div className='card-user-info-container'>
                <div className="card-user-info">
                  <img
                    src={user.imageName ? `http://localhost:8080/uploads/${user.imageName}` : userIcon}
                    alt="Фото пользователя"
                    className="card-user-photo"
                  />
                  <h2>{user.username}</h2>
                </div>
                <div className='card-user-description'>
                  <p><span className='card-user-description-title'>Email: </span>{user.email}</p>
                  <p><span className='card-user-description-title'>Дата рождения: </span>{user.birthDate ? user.birthDate : 'Не указана'}</p>
                  <p><span className='card-user-description-title'>Телефон: </span>{user.phoneNumber ? user.phoneNumber : 'Не указан' }</p>
                </div>
              </div>
              <div className="card-links">
                <h3>Способы связи:</h3>
                {user.linkDTOs && user.linkDTOs.length > 0 ? (
                  <ul className="card-links-list">
                    {user.linkDTOs.map((link, index) => (
                      <li key={index} className='card-links-item'>
                        <a
                          className="link-title"
                          href={link.link}
                        >
                          {link.description || link.link}
                        </a>
                        <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                      </li>
                    ))}
                  </ul>
                ) : <p className='card-empty-list'>Не указано</p>}
              </div>
            </div>
            <div className='card-description-container'>
              <h2>{card.title}</h2>
              <label>Описание карточки:</label>
              <p className='card-description'>{card.description}</p>
            </div>
            <div className='card-appendices-container'>
              <div className='card-projects'>
                <h3>Проекты:</h3>
                {card.projects && card.projects.length > 0? (
                  <ul className="card-projects-list">
                      {card.projects.map((project, index) => (
                        <li key={index} className="card-projects-item">
                          <Link to={`/projects/${project.id}`} className="project-title">{project.title}</Link>
                          <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                        </li>
                      ))}
                    </ul>
                  ) : <p className='card-empty-list'>Проекты не прикреплены</p>}
              </div>
              <div className="card-files">
                <h3>Файлы:</h3>
                {card.cardFiles && card.cardFiles.length > 0? (
                  <ul className="card-files-list">
                    {card.cardFiles.map((file, index) => (
                      <li key={index} className="card-files-item"  onClick={() => handleFileClick(file)}>
                        <img src={fileIcon} className='file-icon' alt='Иконка файла'></img>
                        <h4 className="file-title">{
                        file.description ? file.description : 
                          file.fileTitle ? file.fileTitle.split('_').at(-1).split(0, 38) : 
                            'Ошибка'
                        }</h4>
                      </li>
                    ))}
                  </ul>
                ) : <p className='card-empty-list'>Файлы не прикреплены</p>}
              </div>
              <div className="card-detail-actions">
                <button type="button" className="share-button" onClick={handleCopy}>{copied ? 'Ссылка скопирована!' : 'Поделиться'}</button>
                <div className='card-detail-actions-container'>
                  <button type="button" className="edit-button" onClick={handleEditClick}>Изменить</button>
                  <button type="button" className="delete-button" onClick={handleDelete}>Удалить</button>
                </div>
              </div>              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
