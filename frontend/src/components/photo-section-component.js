import React from 'react';
import { getFullName } from '../utils/file';
import '../css/photo-section-component.css';

export default function PhotoSection({ isEditing = false, defaultImage, imagePreviewUrl, imageName, inputTrigger, inputRef, onPhotoChange, className = '' }) {
    return (
        <div className={`image-container ${className} ${isEditing ? 'edit' : ''}`}>
            <img
                src={imagePreviewUrl ? imagePreviewUrl : (imageName ? getFullName(imageName) : defaultImage)}
                className="preview-img"
                alt="Фото проекта или пользователя"
            />
            {isEditing &&
                <>
                    <button type="button" onClick={inputTrigger} className="button add-submit-button change-photo-button">Изменить фото</button>
                    <input type="file" accept="image/*" onChange={onPhotoChange} ref={inputRef} style={{ display: 'none' }} />
                </>
            }
        </div>
    );
}
