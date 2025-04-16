import React from 'react';
import defaultPreview from '../img/defaultPreview.png';
import '../css/item-preview.css';

export default function ProjectPreview({ title, image }) {
  return (
    <div className='item-preview'>
      <div className='preview-title-container'>
        <h3>{title || 'Новый проект/карточка'}</h3>
      </div>
      <div className='preview-container'>
        <img 
          src={image || defaultPreview} 
          className='preview-img' 
          alt="Фото проекта/карточки" 
        />
      </div>
    </div>
  );
}
