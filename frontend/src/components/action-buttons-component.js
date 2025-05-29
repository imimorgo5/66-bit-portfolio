import React from 'react';
import '../css/action-buttons-component.css';

export default function ActionButtons({ isEdit = false, onEdit, onDelete, onSave, onCancel, isDisabled, editTitle = 'Изменить', className = '' }) {
  return (
    <div className={`action-buttons ${className} ${isEdit ? 'edit' : ''}`}>
      <button type="button" className={`button ${isEdit ? 'add-submit-button' : 'edit-button'}`} onClick={isEdit ? onSave : onEdit} disabled={isEdit && isDisabled}>{isEdit ? 'Сохранить' : editTitle}</button>
      <button type="button" className='button cancel-delete-button' onClick={isEdit ? onCancel : onDelete}>{isEdit ? 'Отменить' : 'Удалить'}</button>
    </div>
  );
}
