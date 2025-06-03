import React, { useContext, useState } from 'react';
import { useLocation, useParams, useNavigate, NavLink, Link } from 'react-router-dom';
import Header from '../components/header-component.js';
import ErrorComponent from '../components/error-component.js';
import LoadingComponent from '../components/loading-component.js';
import LinksSection from '../components/link-section-component.js';
import TitleDescriptionBlock from '../components/title-description-block-component.js';
import PhotoSection from '../components/photo-section-component.js';
import ActionButtons from '../components/action-buttons-component.js';
import FileList from '../components/file-list-component.js';
import { AuthContext } from '../context/AuthContext';
import { getProjectById, updateProject, deleteProject } from '../services/project-service.js';
import { getPublicProject } from '../services/public-service.js';
import { getTeamById } from '../services/team-service.js';
import { normalizeUrl } from '../utils/utils.js';
import { pendingRedirect, redirectIfSessionExpired } from '../utils/redirect.js';
import { mapProjectToEditData } from '../utils/map-data.js';
import { useFetchDetail } from '../hooks/use-fetch-detail.js';
import { useEditData } from '../hooks/use-edit-data.js';
import { useFileInput } from '../hooks/use-file-input.js';
import { useListManager } from '../hooks/use-list-manager.js';
import { useFilesManager } from '../hooks/use-files-manager.js';
import { PageMode } from '../consts.js';
import defaultPreview from '../img/defaultPreview.png';
import folderIcon from '../img/folder_icon.png';
import '../css/project-detail.css';

export default function ProjectDetailPage({ pageMode }) {
  const { identifier } = useParams();
  const { user, setUser, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const backTo = new URLSearchParams(location.search).get('from');
  const { entity: project, setEntity: SetProject, team, loading: { entity: projectLoading, team: teamLoading } } =
    useFetchDetail({ identifier, pageMode, getPublic: getPublicProject, getPrivate: getProjectById, getTeamById });
  const isTeamProject = Boolean(project?.teamId);
  const isPublicProject = pageMode === PageMode.PUBLIC;
  const [isEditing, setIsEditing] = useState(location.state?.isEdit);
  const [linkInput, setLinkInput] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { editData, setEditData } = useEditData({ entity: project, isEditing, mapEntityToEdit: mapProjectToEditData, fileKeys: ['folders.files'] });
  const { inputRef: inputImageRef, trigger: triggerImageInput, handleChange: handlePhotoChange } =
    useFileInput(files => setEditData(prev => ({ ...prev, imageFile: files[0], imagePreviewUrl: URL.createObjectURL(files[0]) })));
  const { addItem: addLink, removeItem: removeLink, updateItem: updateLink } = useListManager('projectLinks', setEditData, 8);
  const { addFiles, removeFile, updateDescription: updateFileDescription } =
    useFilesManager(editData, setEditData, { parentKey: 'folders', childKey: 'files', maxItems: 5 });
  const { inputRef: folderFilesInputRef, trigger: triggerFolderFilesInput, handleChange: handleFolderFilesChange } =
    useFileInput(fileList => { addFiles(selectedFolder, fileList) });

  const handleEditClick = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    setIsEditing(true);
  }

  const handleDelete = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    deleteProject(project.id).then(() => navigate(backTo)).catch(console.error);
  }

  const handleCancelEdit = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    setIsEditing(false);
  }

  const handleSaveEdit = () => {
    redirectIfSessionExpired(user, setUser, navigate);
    updateProject(project.id, editData)
      .then(() => getProjectById(project.id))
      .then((updatedProject) => {
        SetProject(updatedProject);
        setIsEditing(false);
      })
      .catch(console.error);
  };

  const handleNameDescriptionChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const onChangeLinkDesc = (idx, desc) => updateLink(idx, { ...editData.projectLinks[idx], description: desc });

  const onAddLink = () => {
    const url = linkInput.trim();
    if (!url) {
      return;
    }
    addLink({ link: url, description: '' });
    setLinkInput('');
  };

  const handleFolderNameChange = (idx, name) => setEditData(prev => ({ ...prev, folders: prev.folders.map((f, i) => i === idx ? { ...f, title: name } : f) }));

  const addFolder = () => {
    if (editData.folders.length >= 4) return;
    setEditData(prev => ({ ...prev, folders: [...prev.folders, { title: 'Новая папка', files: [] }] }));
  };

  const removeFolder = (index) => setEditData(prev => ({ ...prev, folders: prev.folders.filter((_, i) => i !== index) }));

  if (projectLoading || (!isPublicProject && (authLoading || (isTeamProject && teamLoading) || (isEditing && !editData)))) return <LoadingComponent />;
  if (!isPublicProject && !user) {
    navigate('/login');
    return null;
  }
  if (!project || (!isPublicProject && (authError || (isTeamProject && !team)))) {
    pendingRedirect(navigate, '/');
    return <ErrorComponent />;
  }

  return (
    <div className={`project-detail-page ${pageMode}`}>
      {!isPublicProject && <Header />}
      <div className="project-detail-content">
        {isEditing ? (
          <div className='project-detail-container'>
            <div className='edit-project-appendices-container'>
              <PhotoSection
                isEditing={true}
                defaultImage={defaultPreview}
                imagePreviewUrl={editData.imagePreviewUrl}
                imageName={editData.imageName}
                inputTrigger={triggerImageInput}
                inputRef={inputImageRef}
                onPhotoChange={handlePhotoChange}
                className='project'
              />
              <LinksSection
                title='Ссылки'
                items={editData.projectLinks}
                renderItem={(link) =>
                  <Link to={normalizeUrl(link.link)} target="_blank" rel="noopener noreferrer" className="link link-title">
                    {link.link.length > 30 ? link.link.slice(0, 27) + '...' : link.link}
                  </Link>
                }
                editable={true}
                emptyTitle="Не указано"
                maxLength={30}
                maxCount={8}
                onDescriptionChange={onChangeLinkDesc}
                onAdd={onAddLink}
                onRemove={removeLink}
                inputValue={linkInput}
                onInputChange={setLinkInput}
                className='project'
              />
            </div>
            <TitleDescriptionBlock
              isEditing={true}
              title={editData.title}
              description={editData.description}
              onTitleChange={handleNameDescriptionChange}
              onDescriptionChange={handleNameDescriptionChange}
              descriptionLabel='Описание проекта:'
              className='project'
            />
            <div className='edit-project-appendices-container'>
              <div className='edit-project-folders-container'>
                <h3>Папки:</h3>
                {editData.folders && editData.folders.length > 0 ? (
                  <ul className="edit-project-folders-list">
                    {editData.folders.map((folder, folderIndex) => (
                      <li key={folderIndex} className="edit-project-folder-item">
                        <div className='folder-name-input-container'>
                          <button type="button" className="remove-button" onClick={() => removeFolder(folderIndex)}>×</button>
                          <input
                            type="text"
                            className="text-input folder-name-input"
                            value={folder.title}
                            maxLength={40}
                            onChange={(e) => handleFolderNameChange(folderIndex, e.target.value)}
                            placeholder="Название папки"
                          />
                        </div>
                        <FileList
                          editable={true}
                          files={folder.files}
                          maxTitleLength={41}
                          maxCount={5}
                          onRemove={(fi) => removeFile(folderIndex, fi)}
                          onDescriptionChange={(fi, v) => updateFileDescription(folderIndex, fi, v)}
                          onAddClick={() => {
                            setSelectedFolder(folderIndex);
                            triggerFolderFilesInput();
                          }}
                          fileInputProps={{
                            type: 'file',
                            multiple: true,
                            id: `file-input-${folderIndex}`,
                            ref: folderFilesInputRef,
                            onChange: handleFolderFilesChange
                          }}
                          className='project'
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='project-empty-list'>Не создано ни одной папки</p>
                )}
                <button type="button" className="button add-submit-button add-folder-button" onClick={addFolder} disabled={editData.folders.length >= 4}>Создать папку</button>
              </div>
              <ActionButtons isEdit={true} onSave={handleSaveEdit} onCancel={handleCancelEdit} className='project' />
            </div>
          </div>
        ) : (
          <div className='project-detail-container'>
            <div className='project-appendices-container'>
              {!isPublicProject && <NavLink to={backTo} className='link back-to project-link'><span>←</span> Назад</NavLink>}
              <PhotoSection
                defaultImage={defaultPreview}
                imagePreviewUrl={project.imagePreviewUrl}
                imageName={project.imageName}
                className={`project ${isPublicProject ? 'public' : ''}`}
              />
              <LinksSection
                title='Ссылки:'
                items={project.projectLinks}
                renderItem={(link) =>
                  <Link to={normalizeUrl(link.link)} target="_blank" rel="noopener noreferrer" className="link link-title">
                    {link.description ? link.description : link.link.length > 30 ? link.link.slice(0, 27) + '...' : link.link}
                  </Link>
                }
                emptyTitle='Не указано'
                className={`project ${pageMode}`}
              />
            </div>
            <TitleDescriptionBlock
              title={project.title}
              description={project.description}
              descriptionLabel='Описание проекта:'
              className={`project ${pageMode}`}
            />
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
                  <FileList folderIndex={selectedFolder} files={project.folders[selectedFolder].files} maxTitleLength={41} className='project' />
                </div>
              )}
              {(!isPublicProject && (!isTeamProject || team.adminId === user.id)) &&
                <ActionButtons onEdit={handleEditClick} onDelete={handleDelete} className='project' />
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
