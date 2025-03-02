import React from 'react';
import ProjectPreview from './project-preview.js';


export default class Projects extends React.Component {
  render = () => (
    <ul className='projects-list'>
        <li><ProjectPreview /></li>
        <li><ProjectPreview /></li>
        <li><ProjectPreview /></li>
        <li><ProjectPreview /></li>
        <li><ProjectPreview /></li>
        <li><ProjectPreview /></li>
    </ul>
  );
}
