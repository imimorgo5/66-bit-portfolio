import React, { useContext, useState, useEffect, useRef } from 'react';
import Header from '../components/header';
import '../css/user-page.css';
import { AuthContext } from '../context/AuthContext';
import { getPersonById, updatePerson } from '../services/PersonService';
import userIcon from '../img/user-icon.svg';

export default function UserPage() {
  const { user, setUser } = useContext(AuthContext);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({email: '', username: ''});
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && user.id) {
      getPersonById(user.id)
        .then((data) => {
          setPerson(data);
          setEditData(data);
        })
        .catch((error) => {
          console.error('Ошибка получения данных пользователя:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (editMode) {
      setEditData(person);
      setEmailError('');
      setNameError('');
      setPhoneError('');
    }
  }, [editMode, person]);

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

  const handleSave = () => {
    let updatedEditData = { ...editData };
    if (editData.birthDate) {
      updatedEditData.birthDate = convertDateToServerFormat(editData.birthDate);
    }

    updatePerson(person.id, updatedEditData)
      .then((updatedPerson) => {
        setPerson(updatedPerson);
        setEditData(updatedPerson);
        setEditMode(false);
        setUser(updatedPerson);
      })
      .catch((error) => {
        console.error('Ошибка обновления профиля:', error);
      });
  };

  const isFormValid = editData.email && editData.username && !emailError && !nameError && !phoneError;

  if (loading) return <div>Загрузка...</div>;
  if (!person) return <div>Пользователь не найден</div>;

  return (
    <div className="page">
      <Header />
      <div className="user-page">
        {editMode ? (
          <div className='user-container'>
            <div className="user-info">
              <img
                src={
                  editData.imagePreviewUrl
                    ? editData.imagePreviewUrl
                    : person.imageName 
                    ? `http://localhost:8080/uploads/${person.imageName}` 
                    : userIcon
                }
                alt="Фото пользователя"
                className="user-photo"
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
            <div className="user-data">
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
                  </div>
                  {emailError && <span className="user-error-message">{emailError}</span>}
                  <div className='user-input-wrapper'>
                    <p className='description-title'>Телефон:</p>
                    <input
                      type="text"
                      name="phoneNumber"
                      value={editData.phoneNumber || ''}
                      maxLength={12}
                      onChange={handleNumberChange}
                      className={`${emailError ? 'input-error' : ''}`}
                    />
                  </div>
                  {phoneError && <span className="user-error-message">{phoneError}</span>}
                  <div className='user-input-wrapper'>
                    <p className='description-title'>Дата рождения:</p>
                    <input
                      type="date"
                      name="birthDate"
                      value={editData.birthDate || ''}
                      onChange={handleBirthDateChange}
                    />
                  </div>
                </div>
                <div className="user-info-actions">
                  <button onClick={handleSave} className="user-data-save-button" disabled={!isFormValid}>Сохранить</button>
                  <button onClick={() => setEditMode(false)} className="user-data-cancel-button">Отменить изменения</button>
                </div>
            </div>
          </div>
        ) : (
          <div className='user-container'>
            <div className="user-info">
              <img
                src={person.imageName ? `http://localhost:8080/uploads/${person.imageName}` : userIcon}
                alt="Фото пользователя"
                className="user-photo"
              />
              <h2>{person.username}</h2>
            </div>
            <div className="user-data">
                <h1 className="user-data-title">Личные данные</h1>
                <div className='user-description'>
                  <p><span className='description-title'>Email: </span>{person.email}</p>
                  <p><span className='description-title'>Телефон: </span>{person.phoneNumber ? person.phoneNumber : 'Не указан' }</p>
                  <p><span className='description-title'>Дата рождения: </span>{person.birthDate ? person.birthDate : 'Не указана'}</p>
                </div>
                <button onClick={() => setEditMode(true)} className="edit-info-button">
                  Редактировать
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
