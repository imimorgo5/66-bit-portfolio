import React from 'react';
import defaultPreview from '../img/defaultPreview.png';
import '../css/item-preview.css';

export default function ItemPreview({ title, image, createdAt }) {
  return (
    <div className='item-preview'>
      <div className='preview-title-container'>
        <h3>{title || 'Новый проект/карточка'}</h3>
      </div>
      <img 
        src={image || defaultPreview} 
        className='preview-img' 
        alt="Фото проекта/карточки" 
      />
      {createdAt && (
        <div className="preview-date">
          {new Date(createdAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
