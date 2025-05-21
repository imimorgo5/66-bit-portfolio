import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/header';
import '../css/user-page.css';
import { AuthContext } from '../context/AuthContext';
import { updatePerson } from '../services/person-service';
import userIcon from '../img/user-icon.svg';
import linkIcon from '../img/link_icon.svg';

export default function UserPage() {
  const { user, setUser, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({email: '', username: ''});
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [linkInput, setLinkInput] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editMode) {
      setEditData(user);
      setEmailError('');
      setNameError('');
      setPhoneError('');
    }
  }, [editMode, user]);

  const convertDateToServerFormat = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEditData((prev) => ({
      ...prev,
      email: value,
    }));
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailPattern.test(value)) {
      setEmailError('Некорректный email');
    } else {
      setEmailError('');
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setEditData((prev) => ({
      ...prev,
      username: value,
    }));
    if (value && value.length > 64) {
      setNameError('Слишком длинное ФИО');   
    } else if (value && value.split(' ').filter(el => el).length < 2) {
      setNameError('Некорректное ФИО');
    } else {
      setNameError('');
    }
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    const pattern = /^(\+7|8)\d{10}$/;
    if (value && !pattern.test(value)) {
      setPhoneError('Неверный формат номера');
    } else {
      setPhoneError('');
    }
    setEditData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    setEditData((prev) => ({
      ...prev,
      birthDate: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: url,
      }));
    }
  };

  const triggerPhotoInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleLinkDescriptionChange = (index, value) => {
    setEditData(prev => {
      const updatedLinks = prev.linkDTOs.map((link, i) => 
        i === index ? { ...link, description: value } : link
      );
      return { ...prev, linkDTOs: updatedLinks };
    });
  }

  const addLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed !== '') {
      const newLink = { link: trimmed, description: '' };
      setEditData(prev => ({
        ...prev,
        linkDTOs: prev.linkDTOs ? [...prev.linkDTOs, newLink] : [newLink]
      }));
      setLinkInput('');
    }
  };

  const removeLink = (index) => {
    setEditData(prev => ({
      ...prev,
      linkDTOs: prev.linkDTOs.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    let updatedEditData = { ...editData };
    if (editData.birthDate) {
      updatedEditData.birthDate = convertDateToServerFormat(editData.birthDate);
    }

    updatePerson(user.id, updatedEditData)
      .then((updatedPerson) => {
        setUser(updatedPerson);
        setEditData({
          email: updatedPerson.email,
          username: updatedPerson.username,
          phoneNumber: updatedPerson.phoneNumber,
          birthDate: updatedPerson.birthDate,
          imageName: updatedPerson.imageName,
        });
        setEditMode(false);
      })
      .catch((error) => {
        if (error.message.includes("Пользователь с таким email уже существует")) {
          setEditData({...editData, email: ''});
          setEmailError("Пользователь с таким email уже существует");
        }
        console.error('Ошибка обновления профиля:', error);
      });
  };

  const isFormValid = editData.email && editData.username && !emailError && !nameError && !phoneError;

  if (authLoading) return <div className='loading-container'>Загрузка...</div>;
  if (authError) return <div className='error-container'>Ошибка получения данных...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="page">
      <Header />
      <div className="user-page">
        {editMode ? (
          <>
            <div className='user-container'>
              <div className="edit-user-info">
                <img
                  src={
                    editData.imagePreviewUrl
                      ? editData.imagePreviewUrl
                      : user.imageName 
                      ? `http://localhost:8080/uploads/${user.imageName}` 
                      : userIcon
                  }
                  alt="Фото пользователя"
                  className="edit-user-photo"
                />
                <button type="button" onClick={triggerPhotoInput} className='user-photo-change'>
                  Изменить фото
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <input
                  type="text"
                  name="username"
                  value={editData.username}
                  maxLength={75}
                  onChange={handleNameChange}
                  className={`${nameError ? 'input-error' : ''}`}
                />
                {nameError && <span className="user-error-message">{nameError}</span>}               
              </div>
              <div className="edit-user-data">
                  <h1 className="user-data-title">Личные данные</h1>
                  <div className='user-description'>
                    <div className='user-input-wrapper'>
                      <p className='description-title'>Email:</p>
                      <input
                        type="email"
                        name="email"
                        value={editData.email}
                        maxLength={50}
                        onChange={handleEmailChange}
                        className={`${emailError ? 'input-error' : ''}`}
                      />
                      {emailError && <span className="user-error-message">{emailError}</span>}
                    </div>
                    <div className='user-input-wrapper'>
                      <p className='description-title'>Дата рождения:</p>
                      <input
                        type="date"
                        name="birthDate"
                        value={editData.birthDate || ''}
                        onChange={handleBirthDateChange}
                      />
                    </div>
                    <div className='user-input-wrapper'>
                      <p className='description-title'>Телефон:</p>
                      <input
                        type="text"
                        name="phoneNumber"
                        value={editData.phoneNumber || ''}
                        maxLength={12}
                        onChange={handleNumberChange}
                        className={`${phoneError ? 'input-error' : ''}`}
                      />
                      {phoneError && <span className="user-error-message">{phoneError}</span>}
                    </div>
                  </div>
              </div>
            </div>
            <div className="edit-user-links">
                <h1 className='user-links-title'>Способы связи</h1>
                {editData.linkDTOs && editData.linkDTOs.length > 0 ? (
                    <ul className="user-links-list">
                      {editData.linkDTOs.map((link, index) => (
                        <li key={index} className="edit-user-link-item">
                          <div className='edit-user-link-item-container'>
                            <button type="button" onClick={() => removeLink(index)} className="remove-user-link-button">×</button>
                            <Link
                              to={link.link}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="edit-user-link-title"
                            >
                              {link.link.length > 35 ? link.link.slice(0, 32) + '...' : link.link}
                            </Link>
                            <input
                              type="text"
                              value={link.description}
                              maxLength={38}
                              onChange={(e) => handleLinkDescriptionChange(index, e.target.value)}
                              placeholder="Описание ссылки"
                              className="user-link-description-input"
                            />
                          </div>
                        </li>))}
                    </ul>) : <p className='user-empty-list'>Не указано</p>}
                <div className="user-link-input-group">
                    <input
                      type="text"
                      value={linkInput}
                      maxLength={200}
                      onChange={(e) => setLinkInput(e.target.value)}
                      placeholder="Введите ссылку"
                      className="user-link-input"
                    />
                    <button type="button" onClick={addLink} className="add-user-link-button">Добавить</button>
                </div>
            </div>
            <div className="user-info-actions">
                <button onClick={handleSave} className="user-data-save-button" disabled={!isFormValid}>Сохранить</button>
                <button onClick={() => setEditMode(false)} className="user-data-cancel-button">Отменить изменения</button>
            </div>
          </>
        ) : (
          <>
            <div className='user-container'>
              <div className="user-info">
                <img
                  src={user.imageName ? `http://localhost:8080/uploads/${user.imageName}` : userIcon}
                  alt="Фото пользователя"
                  className="user-photo"
                />
                <h2>{user.username}</h2>
              </div>
              <div className="user-data">
                  <h1 className="user-data-title">Личные данные</h1>
                  <div className='user-description'>
                    <p><span className='description-title'>Email: </span>{user.email}</p>
                    <p><span className='description-title'>Дата рождения: </span>{user.birthDate ? new Date(user.birthDate).toLocaleDateString('ru-RU') : 'Не указана'}</p>
                    <p><span className='description-title'>Телефон: </span>{user.phoneNumber ? user.phoneNumber : 'Не указан' }</p>                  
                  </div>
              </div>
            </div>
            <div className="user-links">
              <h1 className='user-links-title'>Способы связи</h1>
              {user.linkDTOs && user.linkDTOs.length > 0 ? (
                <ul className="user-links-list">
                  {user.linkDTOs.map((link, index) => (
                    <li key={index} className='user-links-item'>
                      <Link
                          to={link.link}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="user-link-title"
                        >
                        {link.description ? link.description : link.link.length > 35 ? link.link.slice(0, 32) + '...' : link.link}
                      </Link>
                      <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                    </li>
                  ))}
                </ul>
              ) : <p className='user-empty-list'>Не указано</p>}
            </div>
            <button onClick={() => setEditMode(true)} className="edit-info-button">
              Редактировать профиль
            </button>
          </>
        )}
      </div>
    </div>
  );
}
