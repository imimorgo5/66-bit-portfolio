import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header-component.js';
import UserCard from '../components/user-card-component.js';
import ActionButtons from '../components/action-buttons-component.js';
import { AuthContext } from '../context/AuthContext';
import { updatePerson } from '../services/person-service';
import { useFileInput } from '../hooks/use-file-input.js';
import { useListManager } from '../hooks/use-list-manager.js';
import { validateEmail, validateName } from '../utils/utils.js';
import '../css/user-card-component.css';

export default function UserPage() {
  const { user, setUser, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ email: '', username: '', linkDTOs: [] });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [linkInput, setLinkInput] = useState('');
  const { inputRef, trigger, handleChange: handlePhotoFiles } = useFileInput(files => setEditData(prev => ({ ...prev, imageFile: files[0], imagePreviewUrl: URL.createObjectURL(files[0]) })));
  const { addItem: addLink, removeItem: removeLink, updateItem: updateLink } = useListManager('linkDTOs', setEditData, 5);

  useEffect(() => {
    if (editMode) {
      setEditData(user);
      setErrors({});
      setLinkInput('');
    }
  }, [editMode, user]);

  const handleChangeField = e => {
    const { name, value } = e.target;
    setEditData(d => ({ ...d, [name]: value }));
    if (name === 'email') {
      const { isValid, message } = validateEmail(value);
      setErrors(err => ({ ...err, email: isValid ? '' : message }));
    }
    if (name === 'username') {
      const { isValid, message } = validateName(value);
      setErrors(err => ({ ...err, username: isValid ? '' : message }));
    }
    if (name === 'phoneNumber') {
      const pattern = /^(\+7|8)\d{10}$/;
      setErrors(err => ({ ...err, phoneNumber: value && !pattern.test(value) ? 'Неверный формат номера' : '' }));
    }
  };

  const onChangeLinkDesc = (idx, desc) => updateLink(idx, { ...editData.linkDTOs[idx], description: desc });

  const onAddLink = () => {
    const url = linkInput.trim();
    if (!url) {
      return;
    }
    addLink({ link: url, description: '' });
    setLinkInput('');
  };

  const handleSave = () => {
    const payload = { ...editData, birthDate: editData.birthDate.split('-').reverse().join('.') };

    updatePerson(user.id, payload)
      .then((updatedPerson) => {
        setUser(updatedPerson);
        setEditMode(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.message.includes('email')) {
          setErrors(err => ({ ...err, email: 'Пользователь с таким email уже существует' }));
          setEditData(d => ({ ...d, email: '' }));
        }
      });
  };

  const handleEdit = () => setEditMode(true);

  const handleCancelEdit = () => setEditMode(false);

  const isFormValid = editData.email && editData.username && !errors.email && !errors.username && !errors.phoneNumber;

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
            <UserCard
              editable={true}
              data={editData}
              errors={errors}
              onChangeField={handleChangeField}
              onPhotoTrigger={trigger}
              photoInputRef={inputRef}
              onPhotoChange={handlePhotoFiles}
              linkInput={linkInput}
              onLinkInputChange={setLinkInput}
              onAddLink={onAddLink}
              onRemoveLink={removeLink}
              onChangeLinkDesc={onChangeLinkDesc}
              infoTitle='Личные данные'
              linkTitle='Способы связи'
            />
            <ActionButtons isEdit={true} onSave={handleSave} onCancel={handleCancelEdit} isDisabled={!isFormValid} className='user'/>
          </>
        ) : (
          <>
            <UserCard data={user} infoTitle='Личные данные' linkTitle='Способы связи' />
            <ActionButtons onEdit={handleEdit} editTitle='Редактировать профиль' className='user'/>
          </>
        )}
      </div>
    </div>
  );
}
