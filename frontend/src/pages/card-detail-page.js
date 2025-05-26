import React, { useContext, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, NavLink, Link } from 'react-router-dom';
import Header from '../components/header-component.js';
import ErrorComponent from '../components/error-component.js';
import LoadingComponent from '../components/loading-component.js';
import UserCard from '../components/user-card-component.js';
import TeamMembersList from '../components/team-members-list-component.js';
import { AuthContext } from '../context/AuthContext';
import { getCardById, updateCard, deleteCard } from '../services/card-service.js';
import { getPublicCard } from '../services/public-service.js';
import { getPersonProjects, getTeamProjects } from '../services/project-service.js';
import { getTeamById } from '../services/team-service.js';
import fileIcon from '../img/file_icon.svg';
import linkIcon from '../img/link_icon.svg';
import { PageMode } from '../consts.js';
import '../css/card-detail.css';

export default function CardDetailPage({ pageMode }) {
  const { identifier } = useParams();
  const { user, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = new URLSearchParams(location.search).get('from');
  const [card, setCard] = useState(null);
  const [team, setTeam] = useState(null);
  const [cardloading, setCardLoading] = useState(true);
  const [projectsloading, setProjectsLoading] = useState(true);
  const [teamLoading, setTeamLoading] = useState(true);
  const [isTeamCard, setIsTeamCard] = useState(false);
  const [isEditing, setIsEditing] = useState(location.state?.isEdit);
  const [editData, setEditData] = useState({
    title: '',
    description: '',
    projects: [],
    cardFiles: []
  });
  const [filesLoaded, setFilesLoaded] = useState(false);
  const [projects, setProjects] = useState([]);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const suggestionsRef = useRef(null);
  const fileInputRef = React.useRef(null);
  const isPublicCard = pageMode === PageMode.PUBLIC;

  useEffect(() => {
    async function init() {
      try {
        if (isPublicCard) {
          await getPublicCard(identifier)
            .then(data => {
              setCard(data.card);
              setIsTeamCard(Boolean(data.card.team));
            });
        } else if (pageMode === PageMode.PRIVATE) {
          await getCardById(identifier)
            .then((fetchedCard) => {
              setCard(fetchedCard);
              setIsTeamCard(Boolean(fetchedCard.teamId));
            });
        } else {
          throw new Error();
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCardLoading(false);
      }
    }
    init();
  }, [identifier, pageMode, isEditing, isPublicCard]);

  useEffect(() => {
    async function init() {
      if (!isPublicCard && !cardloading && card && isTeamCard) {
        await getTeamById(card.teamId)
          .then(setTeam)
          .catch(console.error)
          .finally(() => setTeamLoading(false));
      }
    }
    init();
  }, [isPublicCard, cardloading, isTeamCard, card])

  useEffect(() => {
    async function init() {
      if (!cardloading && isEditing && card) {
        try {
          if (isTeamCard) {
            await getTeamProjects(card.teamId).then(setProjects);
          } else {
            await getPersonProjects().then(setProjects);
          }
        } catch (err) {
          console.error(err);
          setProjects(null);
        } finally {
          setProjectsLoading(false)
        }
      }
    }
    init();
  }, [cardloading, isEditing, isTeamCard, card]);

  useEffect(() => {
    if (card && (!isTeamCard || team) && isEditing) {
      setEditData({
        ...card,
        projects: card.projects?.map(p => p.id) || [],
        cardFiles: card.cardFiles.map(f => ({
          file: null,
          fileTitle: f.fileTitle,
          description: f.description || ''
        }))
      })
      setFilesLoaded(false);
    }
  }, [isEditing, card, isTeamCard, team]);

  useEffect(() => {
    if (!isEditing || filesLoaded) return;
    if (!editData?.cardFiles?.length) {
      setFilesLoaded(true);
      return;
    }

    const needFetch = editData.cardFiles.some(f => !f.file);
    if (!needFetch) {
      setFilesLoaded(true);
      return;
    }

    Promise.all(
      editData.cardFiles.map(async f => {
        if (f.file) return f;
        const resp = await fetch(`http://localhost:8080/uploads/${f.fileTitle}`, { credentials: 'include' });
        if (!resp.ok) {
          console.error(`Ошибка получения файла ${f.fileTitle}: ${resp.status}`);
          return f;
        }
        const blob = await resp.blob();
        return { ...f, file: new File([blob], f.fileTitle, { type: blob.type }) };
      })
    )
      .then(arr => {
        setEditData(d => ({ ...d, cardFiles: arr }));
        setFilesLoaded(true);
      })
      .catch(err => {
        console.error('Ошибка загрузки файлов:', err);
        setFilesLoaded(true);
      });
  }, [isEditing, editData?.cardFiles, filesLoaded]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        setTimeout(() => setCopied(false), 2000);
      })
  }

  const handleEditClick = () => setIsEditing(true);

  const handleSave = async () => {
    await updateCard(card.id, editData)
      .then(() => getCardById(card.id))
      .then(updated => {
        setCard(updated);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSearchTerm('');
    setSuggestions([]);
  }

  const handleDelete = async () => await deleteCard(card.id).then(() => navigate(backTo)).catch(console.error);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = projects.filter(p => p.title.toLowerCase().includes(term.toLowerCase())).slice(0, 5);
    setSuggestions(term.length > 1 ? filtered : []);
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setEditData(prev => {
      const existing = prev.cardFiles || [];
      const slotsLeft = 7 - existing.length;
      if (slotsLeft <= 0) {
        return prev;
      }
      const toAdd = selectedFiles
        .slice(0, slotsLeft)
        .map(file => ({
          file,
          fileTitle: file.name,
          description: '',
        }));
      return {
        ...prev,
        cardFiles: [...existing, ...toAdd],
      };
    });
    e.target.value = '';
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

  const addProject = p => {
    if (editData.projects.length >= 7) {
      return;
    }

    if (!editData.projects.includes(p.id)) {
      setEditData(prev => ({ ...prev, projects: [...prev.projects, p.id] }));
    }
    setSearchTerm('');
    setSuggestions([]);
  };

  const removeProject = idx => {
    setEditData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  if (cardloading || (!isPublicCard && ((isTeamCard && teamLoading) || (isEditing && projectsloading) || authLoading))) return <LoadingComponent />;
  if (!card || (!isPublicCard && ((isTeamCard && !team) || !projects || authError))) return <ErrorComponent />;
  if (!isPublicCard && !user) {
    navigate('/login');
    return null;
  }

  return (
    <div className={`card-detail-page ${pageMode}`}>
      {!isPublicCard && <Header />}
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
                className="text-input edit-card-title"
              />
              <label>Описание карточки:</label>
              <textarea
                name="description"
                value={editData.description}
                maxLength={2000}
                onChange={handleChange}
                placeholder='Введите описание карточки'
                className="text-input edit-card-description"
              />
            </div>
            <div className='edit-card-appendices-container'>
              <div className='edit-card-projects'>
                <h3>Проекты:</h3>
                <input
                  type='text'
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={editData.projects.length >= 7 ? 'Достигнут максимум файлов' : 'Введите название проекта'}
                  className='text-input card-project-search-input'
                  disabled={editData.projects.length >= 7}
                />
                {suggestions.length > 0 && (
                  <ul className='card-project-suggestions-list' ref={suggestionsRef}>
                    {suggestions.map(p => {
                      const already = editData.projects.includes(p.id);
                      return (
                        <li
                          key={p.id}
                          className={already ? 'already-added' : ''}
                          onClick={() => !already && addProject(p)}
                        >
                          <h4 className='edit-card-project-title'>{p.title}</h4>
                          {already && <span className='tag'>Уже добавлен</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
                <ul className='selected-card-projects-list'>
                  {editData.projects.map((pid, idx) => {
                    const pr = projects.find(p => p.id === pid);
                    return (
                      <li key={idx} className='selected-card-project-item'>
                        <h4 className="edit-card-project-title">{pr?.title || '...'}</h4>
                        <button className='remove-button' onClick={() => removeProject(idx)}>×</button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="edit-card-files">
                <h3>Файлы:</h3>
                {editData.cardFiles && editData.cardFiles.length > 0 ? (
                  <ul className="card-files-list">
                    {editData.cardFiles.map((file, index) => (
                      <li key={index} className="edit-card-file-item">
                        <button type="button" onClick={() => removeFile(index)} className="remove-button">×</button>
                        <div className='edit-file-item-container'>
                          <h4 className="edit-file-title">{file.fileTitle ? file.fileTitle.split('_').at(-1).split(0, 38) : 'Ошибка получения файла'}</h4>
                          <input
                            type="text"
                            value={file.description}
                            maxLength={24}
                            onChange={(e) => handleFileDescriptionChange(index, e.target.value)}
                            placeholder="Описание файла"
                            className="text-input file-description-input"
                          />
                        </div>
                      </li>))}
                  </ul>) : <p className='card-empty-list'>Файлы не прикреплены</p>}
                <button type="button" onClick={triggerFileInput} disabled={editData.cardFiles.length >= 7} className="button add-submit-button file-upload-button">Добавить файлы</button>
                <input
                  type="file"
                  accept="*/*"
                  multiple
                  onChange={handleFilesChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  disabled={editData.cardFiles.length >= 7}
                />
              </div>
              <div className="edit-card-detail-actions">
                <button type="button" className="button add-submit-button card-save-button" onClick={handleSave}>Сохранить</button>
                <button type="button" className="button cancel-delete-button card-cancel-button" onClick={handleCancelEdit}>Отменить изменения</button>
              </div>
            </div>
          </div>
        ) : (
          <div className='card-detail-container'>
            <div className='card-owner-container'>
              {!isPublicCard && <NavLink to={backTo} className='link back-to card-link'><span>←</span> Назад</NavLink>}
              {isTeamCard ? (
                <div className='card-team-main'><TeamMembersList team={isPublicCard ? card.team : team} className='card' /></div>
              ) : (
                <UserCard user={isPublicCard ? card.publicPerson : user} className={isPublicCard ? 'card public' : 'card'} />
              )}
            </div>
            <div className='card-description-container'>
              <h2>{card.title}</h2>
              <label>Описание карточки:</label>
              <p className='card-description'>{card.description ? card.description : 'Описание не добавлено'}</p>
            </div>
            <div className='card-appendices-container'>
              <div className='card-projects'>
                <h3>Проекты:</h3>
                {card.projects && card.projects.length > 0 ? (
                  <ul className="card-projects-list">
                    {card.projects.map((project, index) => (
                      <li key={index} className="card-projects-item">
                        {isPublicCard ? (
                          <Link to={`http://localhost:3000/projects/shared/${project.shareToken}`}
                            target="_blank" rel="noopener noreferrer" className="link project-title">
                            {project.title}
                          </Link>) :
                          <Link to={`/projects/${project.id}?from=${encodeURIComponent(`/cards/${card.id}?from=${backTo}`)}`} className="link project-title">
                            {project.title}
                          </Link>
                        }
                        <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                      </li>
                    ))}
                  </ul>
                ) : <p className='card-empty-list'>Проекты не прикреплены</p>}
              </div>
              <div className="card-files">
                <h3>Файлы:</h3>
                {card.cardFiles && card.cardFiles.length > 0 ? (
                  <ul className="card-files-list">
                    {card.cardFiles.map((file, index) => (
                      <li key={index} className="card-files-item" onClick={() => handleFileClick(file)}>
                        <img src={fileIcon} className='file-icon' alt='Иконка файла'></img>
                        <h4 className="link file-title">{
                          file.description ||
                          (file.fileTitle ? file.fileTitle.split('_').at(-1).split(0, 38) :
                            'Ошибка')
                        }</h4>
                      </li>
                    ))}
                  </ul>
                ) : <p className='card-empty-list'>Файлы не прикреплены</p>}
              </div>
              {!isPublicCard &&
                <div className="card-detail-actions">
                  <button type="button" className="button add-submit-button share-button" onClick={handleCopy}>{copied ? 'Ссылка скопирована' : 'Поделиться'}</button>
                  {(!isTeamCard || (isTeamCard && team.adminId === user.id)) &&
                    <div className='card-detail-actions-container'>
                      <button type="button" className="button edit-button card-edit-button" onClick={handleEditClick}>Изменить</button>
                      <button type="button" className="button cancel-delete-button card-delete-button" onClick={handleDelete}>Удалить</button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
