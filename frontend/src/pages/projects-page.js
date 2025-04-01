import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.js';
import ItemPreview from '../components/item-preview.js';
import { AuthContext } from '../context/AuthContext.js';
import SortComponent from '../components/sortComponent.js';
import AddProjectForm from '../components/addProjectForm.js';
import '../css/preview-pages.css';
import '../css/projects-page.css';
import { ProjectsPreviews } from '../mock/project-preview.js';
import EmptyArrow from '../img/empty-arrow.svg';


export default function ProjectsPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [sortMode, setSortMode] = useState('date');

    useEffect(() => {
      // В будущем здесь будет fetch-запрос для получения проектов
      // fetch('/api/projects').then(res => res.json()).then(setProjects)
      setProjects(ProjectsPreviews);
    }, []);


    const handleAddProject = () => {
      if (!user) {
        navigate('/register');
      } else {
        setIsFormOpen(true);
      }
    };

    const handleCreateProject = (projectData) => {
        // Здесь можно добавить логику сохранения проекта
        console.log('Создан проект:', projectData);
        setProjects(prev => [...prev, { id: Date.now(), ...projectData, createdAt: new Date().toISOString() }]);
    };

    const handleSortChange = (mode) => {
      setSortMode(mode);
    };

    const sortedProjects = [...projects].sort((a, b) => {
      if (sortMode === 'name') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return (<div className='page'>
                <Header />
                <div className='content projects-page'>
                    {isFormOpen && (
                        <AddProjectForm
                        onClose={() => setIsFormOpen(false)}
                        onCreate={handleCreateProject}
                        />
                    )}
                    {sortedProjects.length > 0 ? (
                      <div>
                        <div className='sort-container'>
                          <SortComponent onSortChange={handleSortChange} />
                        </div>
                        <ul className="preview-list">
                          {sortedProjects.map(project => (
                            <li key={project.id}>
                              <ItemPreview 
                                title={project.title}
                                image={project.image}
                                createdAt={project.createdAt}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="empty-previews">
                        <p className='empty-title'>У Вас пока нет проектов - <span>добавьте первый!</span></p>
                        <div className="arrow-to-add">
                          <img 
                            src={EmptyArrow} 
                            className='empty-arrow' 
                            alt="Стрелка к кнопке"
                          />
                        </div>
                      </div>
                    )}
                    <button type="button" className='add-item' onClick={handleAddProject}>Добавить проект</button>
                </div>
            </div>
    );
}
