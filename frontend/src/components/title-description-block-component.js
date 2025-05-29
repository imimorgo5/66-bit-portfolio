import React from 'react';
import '../css/title-description-block-component.css';

export default function TitleDescriptionBlock({ isEditing = false, title, description, onTitleChange, onDescriptionChange, descriptionLabel = '', className = '' }) {
  if (isEditing) {
    return (
      <div className={`entity-description-container ${className} edit`}>
        <input
          type='text'
          name='title'
          value={title}
          maxLength={24}
          onChange={onTitleChange}
          placeholder={'Введите название'}
          className='text-input entity-title'
        />
        <label className='entity-description-label'>{descriptionLabel}</label>
        <textarea
          name='description'
          value={description}
          maxLength={2000}
          onChange={onDescriptionChange}
          placeholder={'Введите описание'}
          className='text-input entity-description'
        />
      </div>
    );
  }

  return (
    <div className={`entity-description-container ${className}`}>
      <h2 className='entity-title'>{title}</h2>
      <label className='entity-description-label'>{descriptionLabel}</label>
      <p className='entity-description'>{description || 'Описание не добавлено'}</p>
    </div>
  );
}