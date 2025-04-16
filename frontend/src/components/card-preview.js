import React from 'react';
import '../css/item-preview.css';

export default function CardPreview({ title, description }) {
  return (
    <div className='item-preview'>
      <div className='preview-title-container'>
        <h3>{title || 'Новый проект/карточка'}</h3>
      </div>
      {description ? (
        <div className='preview-container'>
            <h4>{description.length > 220 ? description.substring(0, 220) + '...' : description}</h4>
        </div>
      ) : ''}
    </div>
  );
}
