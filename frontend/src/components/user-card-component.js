import React from 'react';
import { Link } from 'react-router-dom';
import { normalizeUrl } from '../utils/utils.js';
import LinksSection from './link-section-component.js';
import PhotoSection from './photo-section-component.js';
import userIcon from '../img/user-icon.svg';
import '../css/user-card-component.css'

export default function UserCard({ editable = false, data, errors = {}, onChangeField, onPhotoTrigger, photoInputRef, onPhotoChange,
  linkInput, onLinkInputChange, onAddLink, onRemoveLink, onChangeLinkDesc, className = '', infoTitle = '', linkTitle = '' }) {
  const { username, email, birthDate, phoneNumber, imagePreviewUrl, imageName, linkDTOs } = data;

  return (
    <div className={`user-card ${className} ${editable ? 'edit' : ''}`}>
      <div className="user-info-container">
        <div className="user-info">
          <PhotoSection
            isEditing={editable}
            defaultImage={userIcon}
            imagePreviewUrl={imagePreviewUrl}
            imageName={imageName}
            inputTrigger={onPhotoTrigger}
            inputRef={photoInputRef}
            onPhotoChange={onPhotoChange}
            className={`user ${className}`}
          />
          <div className='user-description-item username'>
            {editable ? (
              <input
                type="text"
                name="username"
                value={username}
                maxLength={75}
                onChange={onChangeField}
                className={`text-input ${errors.username ? 'input-error' : ''}`}
                placeholder="Ваше имя"
              />
            ) : (
              <h2>{username}</h2>
            )}
            {errors.username && <div className="error-message user-error-message username">{errors.username}</div>}
          </div>
        </div>
        <div className="user-data">
          {infoTitle && <h3 className="user-data-title">{infoTitle}</h3>}
          {editable ? (
            <div className="user-description">
              <div className="user-description-item">
                <p className='description-title'>Email:</p>
                <input
                  type="email"
                  name="email"
                  value={email}
                  maxLength={50}
                  onChange={onChangeField}
                  className={`text-input ${errors.email ? 'input-error' : ''}`}
                />
                {errors.email && <div className="error-message user-error-message">{errors.email}</div>}
              </div>
              <div className="user-description-item">
                <p className='description-title'>Дата рождения:</p>
                <input
                  type="date"
                  name="birthDate"
                  value={birthDate || ''}
                  onChange={onChangeField}
                  className="text-input"
                />
              </div>
              <div className="user-description-item">
                <p className='description-title'>Телефон:</p>
                <input
                  type="text"
                  name="phoneNumber"
                  value={phoneNumber || ''}
                  maxLength={12}
                  onChange={onChangeField}
                  className={`text-input ${errors.phoneNumber ? 'input-error' : ''}`}
                />
                {errors.phoneNumber && <div className="error-message user-error-message">{errors.phoneNumber}</div>}
              </div>
            </div>
          ) : (
            <div className="user-description">
              <div className='user-description-item'><span className="description-title">Email: </span><p>{email}</p></div>
              <div className='user-description-item'><span className="description-title">Дата рождения: </span><p>{birthDate ? new Date(birthDate).toLocaleDateString('ru-RU') : 'Не указана'}</p></div>
              <div className='user-description-item'><span className="description-title">Телефон: </span><p>{phoneNumber || 'Не указан'}</p></div>
            </div>
          )}
        </div>
      </div>
      <LinksSection
        title={linkTitle}
        items={linkDTOs}
        renderItem={(link) =>
          <Link to={normalizeUrl(link.link)} target="_blank" rel="noopener noreferrer" className="link link-title">
            {!editable && link.description ? link.description : link.link.length > 35 ? link.link.slice(0, 32) + '...' : link.link}
          </Link>
        }
        editable={editable}
        emptyTitle="Не указано"
        maxLength={35}
        maxCount={5}
        onDescriptionChange={onChangeLinkDesc}
        onAdd={onAddLink}
        onRemove={onRemoveLink}
        inputValue={linkInput}
        onInputChange={onLinkInputChange}
        className={`user ${className}`}
      />
    </div>
  );
}
