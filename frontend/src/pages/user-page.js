import React, { useContext, useState, useEffect, useRef } from 'react';
import Header from '../components/header';
import '../css/user-page.css';
import { AuthContext } from '../context/AuthContext';
import { getPersonById, updatePerson } from '../services/PersonService';
import userIcon from '../img/user-icon.png';

export default function UserPage() {
  const { user, setUser } = useContext(AuthContext);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
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

  const convertDateToServerFormat = (dateStr) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
    return dateStr;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
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


  if (loading) return <div>Загрузка...</div>;
  if (!person) return <div>Пользователь не найден</div>;

  return (
    <div className="page">
      <Header />
      <div className="content user-page">
        <h1 className="page-title">Личный кабинет</h1>
        {editMode ? (
          <div className="user-info-edit">
            <div className="user-photo-edit">
              <h3>Фото пользователя:</h3>
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
              <button type="button" onClick={triggerPhotoInput}>
                Изменить фото
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
            </div>
            <div className='edit-user-description'>
                <label>Имя пользователя:</label>
                <input
                type="text"
                name="username"
                value={editData.username}
                onChange={handleChange}
                />
                <label>Email:</label>
                <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                />
                <label>Телефон:</label>
                <input
                type="text"
                name="phoneNumber"
                value={editData.phoneNumber || ''}
                onChange={handleChange}
                />
                <label>Дата рождения:</label>
                <input
                type="date"
                name="birthDate"
                value={editData.birthDate || ''}
                onChange={handleChange}
                />
            </div>
            <div className="user-info-actions">
              <button onClick={handleSave} className="save-button">Сохранить</button>
              <button onClick={() => setEditMode(false)} className="cancel-button">Отменить изменения</button>
            </div>
          </div>
        ) : (
          <div className="user-info">
            <img
              src={person.imageName ? `http://localhost:8080/uploads/${person.imageName}` : userIcon}
              alt="Фото пользователя"
              className="user-photo"
            />
            <h2>{person.username}</h2>
            <div className='user-discription'>
            <p><span className='description-title'>Email: </span>{person.email}</p>
            <p><span className='description-title'>Телефон: </span>{person.phoneNumber ? person.phoneNumber : 'Не указан' }</p>
            <p><span className='description-title'>Дата рождения: </span>{person.birthDate ? person.birthDate : 'Не указана'}</p>
            </div>
            <button onClick={() => setEditMode(true)} className="edit-info-button">
              Изменить информацию
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
