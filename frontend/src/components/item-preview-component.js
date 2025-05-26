import React from 'react';
import defaultPreview from '../img/defaultPreview.png';
import '../css/item-preview.css';
import { ItemType } from '../consts.js'

export default function ItemPreview({ title, image, itemType }) {
  return (
    <div className='item-preview'>
      <div className={(itemType === ItemType.CARD ? 'card-' : '') + 'preview-title-container'}>
        <h3 className='link'>{title}</h3>
      </div>
      {itemType === ItemType.PROJECT &&
        <div className='preview-container'>
          <img 
            src={image || defaultPreview} 
            className='preview-img' 
            alt="Фото проекта/карточки" 
          />
        </div>
      }
    </div>
  );
}
