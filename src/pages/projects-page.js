import React from 'react';
import Projects from '../components/projects.js';
import Button from '../components/button.js';
import '../css/projects-page.css';


export default function ProjectsPage() {
    return (<div className='page'>
                <h1 className='page-title'>Личные проекты</h1>
                <Projects />
                <Button text='Добавить проект'/>
            </div>
    );
}
