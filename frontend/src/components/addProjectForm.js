import React, { useState, useRef, useEffect } from 'react';
import '../css/add-form.css';
import '../css/add-project-form.css';

export default function AddProjectForm({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ title, description, image });
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="add-form add-project-form">
        <h2>Добавление проекта</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название проекта</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название проекта (обязательно)"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание проекта</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание проекта"
              required
            />
          </div>

          <div className="form-group">
            <label className='file-input-lable'>Фото проекта</label>
            <div className="image-upload-container">
              {imagePreviewUrl ? (
                <div className="image-preview-wrapper">
                  <img
                    src={imagePreviewUrl}
                    alt="Превью проекта"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="change-photo-button"
                  >
                    Изменить фото
                  </button>
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={triggerFileInput}
                  className='file-upload' 
                >
                  Добавить фото
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Создать</button>
          </div>
        </form>
      </div>
    </div>
  );
}
