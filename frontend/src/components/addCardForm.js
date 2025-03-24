import React, { useState, useRef, useEffect } from 'react';
import '../css/add-form.css';
import '../css/add-card-form.css';

export default function AddProjectForm({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filesData, setFilesData] = useState([]);
  const [links, setLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      filesData.forEach(item => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, [filesData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { title, description, files: filesData, links };
    onCreate(data);
    onClose();
  };

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      description: ''
    }));
    setFilesData(prev => [...prev, ...newFiles]);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(filesData[index].preview);
    setFilesData(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDescriptionChange = (index, newDescription) => {
    setFilesData(prev => prev.map((item, i) => {
      if (i === index) {
        return { ...item, description: newDescription };
      }
      return item;
    }));
  };

  const addLink = () => {
    if (linkInput.trim() !== '') {
      setLinks(prev => [...prev, linkInput.trim()]);
      setLinkInput('');
    }
  };

  const removeLink = (index) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="modal-overlay">
      <div className="add-form">
      <h2>Добавление карточки</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Название карточки</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название карточки (обязательно)"
              required
            />
          </div>

          <div className="form-group">
            <label>Описание карточки</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Введите описание карточки"
              required
            />
          </div>

          <div className="form-group">
            <label>Файлы</label>
            <div className="files-upload-container">
              <button
                type="button"
                onClick={triggerFileInput}
                className="file-upload-button"
              >
                Прикрепить файлы
              </button>
              <input
                type="file"
                accept="*/*"
                multiple
                onChange={handleFilesChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              {filesData.length > 0 && (
                <div className="files-preview">
                  {filesData.map((item, index) => (
                    <div key={index} className="file-row">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="remove-file-button"
                      >
                        ×
                      </button>
                      <span className="file-name">{item.file.name}</span>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleFileDescriptionChange(index, e.target.value)
                        }
                        placeholder="Описание файла"
                        className="file-description-input"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Ссылки на проекты</label>
            <div className="links-upload-container">
              <div className="link-input-group">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Введите ссылку"
                />
                <button type="button" onClick={addLink} className="add-link-button">
                  Добавить ссылку
                </button>
              </div>
              {links.length > 0 && (
                <ul className="links-list">
                  {links.map((link, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="remove-link-button"
                      >
                        ×
                      </button>
                      <a href={link} target="_blank" rel="noopener noreferrer">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
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
