import React from 'react';
import Header from '../components/header.js';
import ProjectPreview from '../components/project-preview.js';
import '../css/projects-page.css';


export default function ProjectsPage() {
    return (<div className='page'>
                <Header />
                <div className='content projects-page'>
                    <h1 className='page-title'>Личные проекты</h1>
                    <ul className='projects-list'>
                        <li><ProjectPreview /></li>
                        <li><ProjectPreview /></li>
                        <li><ProjectPreview /></li>
                        <li><ProjectPreview /></li>
                        <li><ProjectPreview /></li>
                        <li><ProjectPreview /></li>
                    </ul>
                    <button type="button" className='add-project'>Добавить проект</button>
                </div>
            </div>
    );
}
