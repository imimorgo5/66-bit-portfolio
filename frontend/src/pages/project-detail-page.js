import React, { useState, useEffect, useRef  } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../css/project-detail.css';
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
      .catch((error) => {
        console.error('Ошибка получения проекта:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleEditClick = () => {
    setEditData({ ...project });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...project });
  };

  const handleSaveEdit = () => {
    updateProject(project.id, editData)
      .then(() => {
        return getProjectById(project.id);
      })
      .then((updatedProject) => {
        setProject(updatedProject);
        setEditData(updatedProject);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Ошибка при обновлении проекта:', error);
      });
  };

  const handleDelete = () => {
    deleteProject(project.id)
      .then((res) => {
        navigate(-1);
      })
      .catch((error) => {
        console.error('Ошибка при удалении проекта:', error);
      });
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

  if (loading) return <div>Загрузка...</div>;
  if (!project) return <div>Проект не найден</div>;

  return (
    <div className="project-detail-page">
      <Header />
      <div className="project-detail-content">
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
              className="edit-title"
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              className="edit-description"
            />
            <div className="edit-photo">
              <h3>Фото проекта:</h3>
              <img 
                src={
                  editData.imagePreviewUrl
                    ? editData.imagePreviewUrl
                    : `http://localhost:8080/uploads/${project.imageName}`
                }
                className="project-preview-img"
                alt="Фото проекта"
              />
              <button
                type="button"
                onClick={triggerPhotoInput}
                className="change-project-photo-button"
              >
                Изменить фото
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={photoInputRef}
                style={{ display: 'none' }}
              />
            </div>
          </>
        ) : (
          <>
            <h2>{project.title}</h2>
            <p className='project-description'>{project.description}</p>
            <img 
                src={`http://localhost:8080/uploads/${project.imageName}`} 
                className='project-preview-img' 
                alt="Фото проекта" 
            />
          </>
        )}
      </div>

      <div className="project-detail-actions">
        {isEditing ? (
          <>
            <button type="button" className="save-button" onClick={handleSaveEdit}>Сохранить</button>
            <button type="button" className="cancel-button" onClick={handleCancelEdit}>Отменить изменения</button>
          </>
        ) : (
          <>
            <button type="button" className="edit-button" onClick={handleEditClick}>Изменить</button>
            <button type="button" className="delete-button" onClick={handleDelete}>Удалить</button>
          </>
        )}
      </div>
    </div>
  );
}
