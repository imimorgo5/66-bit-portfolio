import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.js';
import ItemPreview from '../components/item-preview.js';
import { AuthContext } from '../context/AuthContext.js';
import SortComponent from '../components/sortComponent.js';
import AddProjectForm from '../components/addProjectForm.js';
import '../css/preview-pages.css';
import '../css/projects-page.css';


export default function ProjectsPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
  
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
    };

    return (<div className='page'>
                <Header />
                <div className='content projects-page'>
                    {isFormOpen && (
                        <AddProjectForm
                        onClose={() => setIsFormOpen(false)}
                        onCreate={handleCreateProject}
                        />
                    )}
                    <div className='sort-container'>
                      <SortComponent />
                    </div>
                    <ul className='preview-list'>
                        <li><ItemPreview title="Проект 1" /></li>
                        <li><ItemPreview title="Проект 2" /></li>
                        <li><ItemPreview title="Проект 3" /></li>
                        <li><ItemPreview title="Проект 4" /></li>
                        <li><ItemPreview title="Проект 5" /></li>
                        <li><ItemPreview title="Проект 6" /></li>
                    </ul>
                    <button type="button" className='add-item' onClick={handleAddProject}>Добавить проект</button>
                </div>
            </div>
    );
}
