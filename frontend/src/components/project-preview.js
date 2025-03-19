import React from 'react';
import defaultPreview from '../img/defaultPreview.png';
import '../css/project-preview.css';

export default class ProjectPreview extends React.Component {
  render() {
    const { title, image } = this.props;
    return (
      <div className='project-preview'>
        <div className='preview-title-container'>
          <h3>{title ? title : 'Новый проект'}</h3>
        </div>
        <img src={image ? image : defaultPreview} className='preview-img' alt="Фото проекта" />
      </div>
    );
  }
}
