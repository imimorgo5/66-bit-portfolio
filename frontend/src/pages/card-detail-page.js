import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation, NavLink, Link } from 'react-router-dom';
import Header from '../components/header-component.js';
import ErrorComponent from '../components/error-component.js';
import LoadingComponent from '../components/loading-component.js';
import UserCard from '../components/user-card-component.js';
import TeamMembersList from '../components/team-members-list-component.js';
import TitleDescriptionBlock from '../components/title-description-block-component.js';
import ActionButtons from '../components/action-buttons-component.js';
import FileList from '../components/file-list-component.js';
import Suggestions from '../components/suggestions-component.js';
import LinksSection from '../components/link-section-component.js';
import { AuthContext } from '../context/AuthContext';
import { getCardById, updateCard, deleteCard } from '../services/card-service.js';
import { getPublicCard } from '../services/public-service.js';
import { getPersonProjects, getTeamProjects } from '../services/project-service.js';
import { getTeamById } from '../services/team-service.js';
import { mapCardToEditData } from '../utils/map-data.js';
import { pendingRedirect, redirectIfSessionExpired } from '../utils/redirect.js';
import { useFetchDetail } from '../hooks/use-fetch-detail.js';
import { useEditData } from '../hooks/use-edit-data.js';
import { useFileInput } from '../hooks/use-file-input.js';
import { useFilesManager } from '../hooks/use-files-manager.js';
import { useListManager } from '../hooks/use-list-manager.js';
import { useSuggestions } from '../hooks/use-suggestions.js';
import { PageMode } from '../consts.js';
import '../css/card-detail.css';

export default function CardDetailPage({ pageMode }) {
  const { identifier } = useParams();
  const { user, setUser, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = new URLSearchParams(location.search).get('from');
  const { entity: card, setEntity: setCard, team, loading: { entity: cardLoading, team: teamLoading } } =
    useFetchDetail({ identifier, pageMode, getPublic: getPublicCard, getPrivate: getCardById, getTeamById });
  const isTeamCard = Boolean(card?.team || card?.teamId);
  const isPublicCard = pageMode === PageMode.PUBLIC;
  const [isEditing, setIsEditing] = useState(location.state?.isEdit);
  const [allProjects, setAllProjects] = useState([]);
  const [allProjectsLoading, setAllProjectsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { editData, setEditData } = useEditData({ entity: card, isEditing, mapEntityToEdit: mapCardToEditData, fileKeys: ['cardFiles'] });
  const { addFiles, removeFile, updateDescription } = useFilesManager(editData, setEditData, { parentKey: 'cardFiles', maxItems: 7 });
  const { inputRef: filesInputRef, trigger: triggerFilesInput, handleChange: handleFilesInputChange } = useFileInput(fileList => addFiles(null, fileList));
  const { addItem: addProject, removeItem: removeProject } = useListManager('projects', setEditData, 7);

  useEffect(() => {
    if (!cardLoading && isEditing && card) {
      (isTeamCard ? getTeamProjects(card.teamId) : getPersonProjects())
        .then(setAllProjects)
        .catch(err => {
          console.error(err);
          setAllProjects(null);
        })
        .finally(() => setAllProjectsLoading(false));
    }
  }, [cardLoading, isEditing, isTeamCard, card]);

  const { term: searchTerm, setTerm: setSearchTerm, items: suggestions, containerRef: suggestionsRef } = useSuggestions({
    allItems: allProjects,
    filterFn: useCallback((p, term) => p.title.toLowerCase().includes(term.toLowerCase()), []),
    maxItems: 5,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(`http://localhost:3000/cards/shared/${card.shareToken}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }

  const handleEditClick = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    setIsEditing(true);
  }

  const handleSave = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    updateCard(card.id, editData)
      .then(() => getCardById(card.id))
      .then((updatedCard) => {
        setCard(updatedCard);
        setIsEditing(false);
        setSearchTerm('');
      })
      .catch(console.error);
  };

  const handleCancelEdit = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    setIsEditing(false);
    setSearchTerm('');
  }

  const handleDelete = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    deleteCard(card.id).then(() => navigate(backTo)).catch(console.error);
  }

  const handleNameDescriptionChange = (e) => setEditData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSuggestionClick = pid => {
    if (!editData.projects.includes(pid)) {
      addProject(pid);
    }
    setSearchTerm('');
  };

  if (!isPublicCard && !user) {
    navigate('/login');
    return null;
  }
  if (cardLoading || (!isPublicCard && ((isTeamCard && teamLoading) || (isEditing && (allProjectsLoading || !editData)) || authLoading))) return <LoadingComponent />;
  if (!card || (!isPublicCard && ((isTeamCard && !team) || (isEditing && !allProjects) || authError))) {
    pendingRedirect(navigate, '/cards');
    return <ErrorComponent />;
  }

  return (
    <div className={`card-detail-page ${pageMode}`}>
      {!isPublicCard && <Header />}
      <div className="card-detail-content">
        {isEditing ? (
          <div className='card-detail-container'>
            <TitleDescriptionBlock
              isEditing={true}
              title={editData.title}
              description={editData.description}
              onTitleChange={handleNameDescriptionChange}
              onDescriptionChange={handleNameDescriptionChange}
              descriptionLabel='Описание карточки:'
              className='card'
            />
            <div className='edit-card-appendices-container'>
              <div className='edit-card-projects'>
                <h3 className='links-title'>Проекты:</h3>
                <Suggestions
                  searchRef={suggestionsRef}
                  searchTerm={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  isDisabled={editData.projects.length >= 7}
                  placeholder={editData.projects.length >= 7 ? 'Достигнут максимум проектов' : 'Введите название проекта'}
                  suggestions={suggestions}
                  getAlready={p => editData.projects.includes(p.id)}
                  addItem={p => onSuggestionClick(p.id)}
                  getSuggestionTitle={p => p.title}
                  getAlreadyTitle={() => 'Уже добавлен'}
                  className='card'
                />
                <LinksSection
                  items={editData.projects}
                  renderItem={(pid) => {
                    const proj = allProjects.find(p => p.id === pid);
                    return <h4 className="link-title">{proj.title}</h4>
                  }}
                  editable={true}
                  emptyTitle='Проекты не прикреплены'
                  isDescEdit={false}
                  isNeedInput={false}
                  onRemove={removeProject}
                  className='card-projects'
                />
              </div>
              <FileList
                editable={true}
                title='Файлы:'
                files={editData.cardFiles}
                maxTitleLength={27}
                maxCount={7}
                onRemove={(fi, i) => removeFile(fi, i)}
                onDescriptionChange={(fi, i, v) => updateDescription(fi, i, v)}
                onAddClick={triggerFilesInput}
                fileInputProps={{
                  type: 'file',
                  accept: '*/*',
                  multiple: true,
                  ref: filesInputRef,
                  onChange: handleFilesInputChange
                }}
                className='card'
              />
              <ActionButtons isEdit={true} onSave={handleSave} onCancel={handleCancelEdit} className='card' />
            </div>
          </div>
        ) : (
          <div className='card-detail-container'>
            <div className='card-owner-container'>
              {!isPublicCard && <NavLink to={backTo} className='link back-to card-link'><span>←</span> Назад</NavLink>}
              {isTeamCard ? (
                <div className='card-team-main'><TeamMembersList team={isPublicCard ? card.team : team} className='card' /></div>
              ) : (
                <UserCard data={isPublicCard ? card.publicPerson : user} className={isPublicCard ? 'card public' : 'card'} />
              )}
            </div>
            <TitleDescriptionBlock
              title={card.title}
              description={card.description}
              descriptionLabel='Описание карточки:'
              className={`card ${pageMode}`}
            />
            <div className='card-appendices-container'>
              <LinksSection
                title='Проекты:'
                items={card.projects}
                renderItem={(project) =>
                  isPublicCard ? (
                    <Link to={`http://localhost:3000/projects/shared/${project.shareToken}`}
                      target="_blank" rel="noopener noreferrer" className="link link-title">
                      {project.title}
                    </Link>) :
                    <Link to={`/projects/${project.id}?from=/cards/${card.id}?from=${backTo}`} className="link link-title">
                      {project.title}
                    </Link>
                }
                emptyTitle='Проекты не прикреплены'
                className={`card-projects ${isPublicCard ? 'public' : ''}`}
              />
              <FileList files={card.cardFiles} title='Файлы:' maxTitleLength={28} className={`card ${isPublicCard ? 'public' : ''}`} />
              {!isPublicCard &&
                <div className="card-detail-actions">
                  <button type="button" className="button add-submit-button share-button" onClick={handleCopy}>{copied ? 'Ссылка скопирована' : 'Поделиться'}</button>
                  {(!isTeamCard || (isTeamCard && team.adminId === user.id)) &&
                    <ActionButtons onEdit={handleEditClick} onDelete={handleDelete} className='card' />
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
