import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import ProjectPreview from '../components/project-preview';
import { AuthContext } from '../context/AuthContext';
import SortComponent from '../components/sortComponent';
import '../css/preview-pages.css';
import '../css/projects-page.css';
import EmptyArrow from '../img/empty-arrow.svg';
import EmptyPicture from '../img/empty-items-picture.png';
import { getProjects, createProject } from '../services/projectService';

export default function ProjectsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [sortMode, setSortMode] = useState('date');

  useEffect(() => {
    getProjects()
      .then(fetched => setProjects(fetched))
      .catch(err => console.error(err));
  }, []);

  const handleAddProject = () => {
    if (!user) {
      navigate('/register');
      return;
    }
    createProject({ title: 'Новый проект' })
      .then(newProj => setProjects(prev => [...prev, newProj]))
      .catch(err => console.error(err));
  };

  const handleSortChange = mode => setSortMode(mode);

  const goToProjectDetail = project =>
    navigate(`/projects/${project.id}`, { state: { project } });

  const isNew = (proj) => {
    return (
      (proj.description === null || proj.description === '') &&
      (proj.imageName == null || proj.imageName === '') &&
      (proj.projectLinks === null || (Array.isArray(proj.projectLinks) && proj.projectLinks.length === 0)) &&
      typeof proj.title === 'string' && proj.title.trim() !== ''
    );
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortMode === 'name') return a.title.localeCompare(b.title);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="page">
      <Header />
      <div className="content projects-page">
        {projects.length > 0 ? (
          <>
            <div className="sort-container">
              <SortComponent onSortChange={handleSortChange} />
            </div>
            <ul className="preview-list">
              {sortedProjects.map(proj => (
                <li
                  key={proj.id}
                  onClick={() => goToProjectDetail(proj)}
                  className={isNew(proj) ? 'new-item' : ''}
                >
                  <ProjectPreview
                    title={proj.title}
                    image={
                      proj.imageName
                        ? `http://localhost:8080/uploads/${proj.imageName}`
                        : ''
                    }
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="empty-previews">
            <img
              src={EmptyPicture}
              alt="Красивая картинка"
              className="empty-items-picture"
            />
            <p className="empty-title">
              У Вас пока нет проектов - <span>добавьте первый!</span>
            </p>
            <div className="arrow-to-add">
              <img
                src={EmptyArrow}
                className="empty-arrow"
                alt="Стрелка к кнопке"
              />
            </div>
          </div>
        )}

        <button type="button" className="add-item" onClick={handleAddProject}>
          Добавить проект
        </button>
      </div>
    </div>
  );
}
