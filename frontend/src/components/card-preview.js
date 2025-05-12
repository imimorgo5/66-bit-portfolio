import React from 'react';
import '../css/item-preview.css';

export default function CardPreview({ title }) {
  return (
    <div className='item-preview'>
      <div className='card-preview-title-container'>
        <h3>{title}</h3>
      </div>
    </div>
  );
}
