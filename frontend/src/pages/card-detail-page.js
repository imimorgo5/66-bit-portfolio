import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../css/card-detail.css';
import { getCardById, updateCard, deleteCard } from '../services/cardService.js';

export default function CardDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filesLoaded, setFilesLoaded] = useState(false);

  useEffect(() => {
    getCardById(id)
      .then((fetchedCard) => {
        setCard(fetchedCard);
      })
      .catch((error) => {
        console.error('Ошибка получения карточки:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (isEditing && !filesLoaded && editData && editData.cardFiles && editData.cardFiles.some(file => !file.file)) {
      Promise.all(
        editData.cardFiles.map(async (file) => {
          if (file.file) return file;
          try {
            const response = await fetch(`http://localhost:8080/uploads/${file.fileTitle}`, { credentials: 'include' });
            if (!response.ok) {
              console.error(`Ошибка получения файла ${file.fileTitle}: ${response.status}`);
              return file;
            }
            const blob = await response.blob();
            const fetchedFile = new File([blob], file.fileTitle, { type: blob.type });
            return { ...file, file: fetchedFile };
          } catch (err) {
            console.error('Ошибка при получении файла для редактирования:', err);
            return file;
          }
        })
      )
      .then((filesWithData) => {
        setEditData(prev => ({ ...prev, cardFiles: filesWithData }));
        setFilesLoaded(true);
      })
      .catch((error) => {
        console.error('Ошибка загрузки файлов для редактирования:', error);
      });
    }
  }, [isEditing, filesLoaded, editData]);

  const handleFileClick = (file) => {
    return;
  };

  const handleEditClick = () => {
    setEditData({ ...card });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({ ...card });
  };

  const handleSaveEdit = () => {
    updateCard(card.id, editData)
      .then(() => {
        return getCardById(card.id);
      })
      .then((updatedCard) => {
        setCard(updatedCard);
        setEditData(updatedCard);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error('Ошибка при обновлении карточки:', error);
      });
  };

  const handleDelete = () => {
    deleteCard(card.id)
      .then((res) => {
        navigate(-1);
      })
      .catch((error) => {
        console.error('Ошибка при удалении карточки:', error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const fileInputRef = React.useRef(null);

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newFiles = selectedFiles.map(file => ({
      file,
      fileTitle: file.name, 
      description: '',
    }));
    setEditData(prev => ({
      ...prev,
      cardFiles: prev.cardFiles ? [...prev.cardFiles, ...newFiles] : newFiles
    }));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const removeFile = (index) => {
    if(editData.cardFiles && editData.cardFiles[index].preview) {
      URL.revokeObjectURL(editData.cardFiles[index].preview);
    }
    setEditData(prev => ({
      ...prev,
      cardFiles: prev.cardFiles.filter((_, i) => i !== index)
    }));
  };

  const handleFileDescriptionChange = (index, value) => {
    setEditData(prev => {
      const updatedFiles = prev.cardFiles.map((file, i) => 
        i === index ? { ...file, description: value } : file
      );
      return { ...prev, cardFiles: updatedFiles };
    });
  };

  const [linkInput, setLinkInput] = useState('');
  const addLink = () => {
    if (linkInput.trim() !== '') {
      setEditData(prev => ({
        ...prev,
        links: prev.links ? [...prev.links, linkInput.trim()] : [linkInput.trim()]
      }));
      setLinkInput('');
    }
  };

  const removeLink = (index) => {
    setEditData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  if (loading) return <div>Загрузка...</div>;
  if (!card) return <div>Карточка не найдена</div>;

  return (
    <div className="card-detail-page">
      <Header />
      <div className="card-detail-content">
        {isEditing ? (
          <>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleChange}
              className="edit-title"
            />
            <textarea
              name="description"
              value={editData.description}
              onChange={handleChange}
              className="edit-description"
            />
            <div className="edit-files">
              <h3>Файлы:</h3>
              {editData.cardFiles && editData.cardFiles.length > 0 ? (
                <ul className="card-files-list">
                  {editData.cardFiles.map((file, index) => (
                    <li key={index} className="edit-card-file-item">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="remove-card-file-button"
                      >
                        ×
                      </button>
                      <div className='edit-file-item-container'>
                        <h4 className="file-title">{file.fileTitle ? file.fileTitle.split('_').at(-1) : file.fileTitle}</h4>
                        <input
                          type="text"
                          value={file.description}
                          onChange={(e) => handleFileDescriptionChange(index, e.target.value)}
                          placeholder="Описание файла"
                          className="file-description-input"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Нет файлов</p>
              )}
              <button type="button" onClick={triggerFileInput} className="file-upload-button">
                Добавить файлы
              </button>
              <input
                type="file"
                accept="*/*"
                multiple
                onChange={handleFilesChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
            <div className="edit-links">
              <h3>Ссылки:</h3>
              <div className="card-link-input-group">
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder="Введите ссылку"
                  className="link-input"
                />
                <button type="button" onClick={addLink} className="add-card-link-button">
                  Добавить ссылку
                </button>
              </div>
              {editData.links && editData.links.length > 0 && (
                <ul className="card-links-list">
                  {editData.links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      <button type="button" onClick={() => removeLink(index)} className="remove-card-link-button">
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>{card.title}</h2>
            <p className='card-description'>{card.description}</p>
            {card.cardFiles && card.cardFiles.length > 0 && (
              <div className="card-files">
                <h3>Файлы:</h3>
                <ul className="card-files-list">
                  {card.cardFiles.map((file, index) => (
                    <li key={index} className="card-file-item" onClick={() => handleFileClick(file)}>
                      <h4 className="file-title">{file.fileTitle ? file.fileTitle.split('_').at(-1) : file.fileTitle}</h4>
                      <p className="file-decription">{file.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {card.links && card.links.length > 0 && (
              <div className="card-links">
                <h3>Ссылки:</h3>
                <ul className="card-links-list">
                  {card.links.map((link, index) => (
                    <li key={index}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="card-detail-actions">
        {isEditing ? (
          <>
            <button type="button" className="save-button" onClick={handleSaveEdit}>Сохранить</button>
            <button type="button" className="cancel-button" onClick={handleCancelEdit}>Отменить изменения</button>
          </>
        ) : (
          <>
            <button type="button" className="edit-button" onClick={handleEditClick}>Изменить</button>
            <button type="button" className="delete-button" onClick={handleDelete}>Удалить</button>
          </>
        )}
      </div>
    </div>
  );
}
