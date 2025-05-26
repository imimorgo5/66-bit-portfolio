import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/header-component.js';
import UserCard from '../components/user-card-component.js';
import { AuthContext } from '../context/AuthContext';
import { updatePerson } from '../services/person-service';
import userIcon from '../img/user-icon.svg';
import { normalizeUrl, validateEmail, validateName } from '../utils/utils.js';
import '../css/user-page.css';
import '../css/user-card-component.css';

export default function UserPage() {
  const { user, setUser, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({email: '', username: '', linkDTOs: []});
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
    setEditData((prev) => ({...prev, email: value}));
    const validateResult = validateEmail(value);
    if (!validateResult.isValid) {
      setEmailError(validateResult.message);
    } else {
      setEmailError('');
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setEditData((prev) => ({...prev, username: value}));
    const validateResult = validateName(value);
    if (!validateResult.isValid) {
      setNameError(validateResult.message);   
    } else {
      setNameError('');
    }
  };

  const handleNumberChange = (e) => {
    const value = e.target.value;
    setEditData((prev) => ({...prev, phoneNumber: value}));
    const pattern = /^(\+7|8)\d{10}$/;
    if (value && !pattern.test(value)) {
      setPhoneError('Неверный формат номера');
    } else {
      setPhoneError('');
    }
  };

  const handleBirthDateChange = (e) => {
    const value = e.target.value;
    setEditData((prev) => ({...prev, birthDate: value}));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setEditData((prev) => ({...prev, imageFile: file, imagePreviewUrl: url}));
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
    if (editData.linkDTOs.length >= 5) {
      return;
    }

    const trimmed = linkInput.trim();
    if (trimmed !== '') {
      const newLink = { link: trimmed, description: '' };
      setEditData(prev => ({...prev, linkDTOs: prev.linkDTOs ? [...prev.linkDTOs, newLink] : [newLink]}));
      setLinkInput('');
    }
  };

  const removeLink = (index) => {
    setEditData(prev => ({...prev, linkDTOs: prev.linkDTOs.filter((_, i) => i !== index)}));
  };

  const handleSave = async () => {
    let updatedEditData = { ...editData };
    if (editData.birthDate) {
      updatedEditData.birthDate = convertDateToServerFormat(editData.birthDate);
    }

    await updatePerson(user.id, updatedEditData)
      .then((updatedPerson) => {
        setUser(updatedPerson);
        setEditData({...updatedPerson});
        setEditMode(false);
      })
      .catch((error) => {
        if (error.message.includes("Пользователь с таким email уже существует")) {
          setEditData({...editData, email: ''});
          setEmailError("Пользователь с таким email уже существует");
        }
        console.error(error);
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
            <div className='user-card edit'>
              <div className='user-info-container edit'>
                <div className="user-info edit">
                  <img
                    src={
                      editData.imagePreviewUrl
                        ? editData.imagePreviewUrl
                        : user.imageName 
                        ? `http://localhost:8080/uploads/${user.imageName}` 
                        : userIcon
                    }
                    alt="Фото пользователя"
                    className="user-photo edit"
                  />
                  <button type="button" onClick={triggerPhotoInput} className='button add-submit-button user-photo-change'>Изменить фото</button>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                  />
                  <div className='user-description-item username'>
                    <input
                      type="text"
                      name="username"
                      value={editData.username}
                      maxLength={75}
                      onChange={handleNameChange}
                      className={`text-input ${nameError ? 'input-error' : ''}`}
                    />
                    {nameError && <span className="error-message user-error-message username">{nameError}</span>}     
                  </div>
                </div>
                <div className="user-data edit">
                    <h1 className="user-data-title">Личные данные</h1>
                    <div className='user-description'>
                      <div className='user-description-item'>
                        <p className='description-title'>Email:</p>
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          maxLength={50}
                          onChange={handleEmailChange}
                          className={`text-input ${emailError ? 'input-error' : ''}`}
                        />
                        {emailError && <span className="error-message user-error-message">{emailError}</span>}
                      </div>
                      <div className='user-description-item'>
                        <p className='description-title'>Дата рождения:</p>
                        <input
                          type="date"
                          name="birthDate"
                          value={editData.birthDate || ''}
                          onChange={handleBirthDateChange}
                          className='text-input'
                        />
                      </div>
                      <div className='user-description-item'>
                        <p className='description-title'>Телефон:</p>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={editData.phoneNumber || ''}
                          maxLength={12}
                          onChange={handleNumberChange}
                          className={`text-input ${phoneError ? 'input-error' : ''}`}
                        />
                        {phoneError && <span className="error-message user-error-message">{phoneError}</span>}
                      </div>
                    </div>
                </div>
              </div>
              <div className="user-links edit">
                  <h1 className='user-links-title'>Способы связи</h1>
                  {editData.linkDTOs && editData.linkDTOs.length > 0 ? (
                      <ul className="user-links-list edit">
                        {editData.linkDTOs.map((link, index) => (
                          <li key={index} className="user-link-item edit">
                            <div className='user-link-item-container edit'>
                              <button type="button" onClick={() => removeLink(index)} className="remove-button">×</button>
                              <Link to={normalizeUrl(link.link)} target="_blank" rel="noopener noreferrer" className="link user-link-title edit">
                                {link.link.length > 35 ? link.link.slice(0, 32) + '...' : link.link}
                              </Link>
                              <input
                                type="text"
                                value={link.description}
                                maxLength={38}
                                onChange={(e) => handleLinkDescriptionChange(index, e.target.value)}
                                placeholder="Описание ссылки"
                                className="text-input user-link-description-input"
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
                      placeholder={editData.linkDTOs.length >= 5 ? 'Достигнут максимум ссылок' : 'Введите ссылку'}
                      className="text-input user-link-input"
                      disabled={editData.linkDTOs.length >= 5}
                    />
                    <button type="button" onClick={addLink} disabled={editData.linkDTOs.length >= 5} className="button add-submit-button add-user-link-button">Добавить</button>
                  </div>
              </div>
            </div>
            <div className="user-info-actions">
                <button onClick={handleSave} className="button add-submit-button user-data-save-button" disabled={!isFormValid}>Сохранить</button>
                <button onClick={() => setEditMode(false)} className="button cancel-delete-button user-data-cancel-button">Отменить изменения</button>
            </div>
          </>
        ) : (
          <>
            <UserCard user={user} infoTitle='Личные данные' />
            <button onClick={() => setEditMode(true)} className="button add-submit-button edit-info-button">Редактировать профиль</button>
          </>
        )}
      </div>
    </div>
  );
}
