import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import ProjectPreview from '../components/project-preview';
import { AuthContext } from '../context/AuthContext';
import SortComponent from '../components/sortComponent';
import AddProjectForm from '../components/addProjectForm';
import '../css/preview-pages.css';
import '../css/projects-page.css';
import EmptyArrow from '../img/empty-arrow.svg';
import { getProjects, createProject } from '../services/projectService';

export default function ProjectsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [sortMode, setSortMode] = useState('date');

  useEffect(() => {
    getProjects()
      .then((fetchedProjects) => setProjects(fetchedProjects))
      .catch((error) => console.error(error));
  }, []);

  const handleAddProject = () => {
    if (!user) {
      navigate('/register');
    } else {
      setIsFormOpen(true);
    }
  };

  const handleCreateProject = (projectData) => {
    createProject(projectData)
      .then((newProject) => {
        setProjects((prev) => [...prev, newProject]);
        setIsFormOpen(false);
      })
      .catch((error) => console.error(error));
  };

  const handleSortChange = (mode) => {
    setSortMode(mode);
  };

  const goToProjectDetail = (project) => {
    navigate(`/projects/${project.id}`, { state: { project } });
  };  

  const sortedProjects = [...projects].sort((a, b) => {
    if (sortMode === 'name') {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="page">
      <Header />
      <div className="content projects-page">
        {isFormOpen && (
          <AddProjectForm
            onClose={() => setIsFormOpen(false)}
            onCreate={handleCreateProject}
          />
        )}
        {sortedProjects.length > 0 ? (
          <>
            <div className="sort-container">
              <SortComponent onSortChange={handleSortChange} />
            </div>
            <ul className="preview-list">
              {sortedProjects.map((project) => (
                <li key={project.id} onClick={() => goToProjectDetail(project)}>
                  <ProjectPreview 
                    title={project.title}
                    image={`http://localhost:8080/uploads/${project.imageName}`}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="empty-previews">
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
