
import React from 'react';
import linkIcon from '../img/link_icon.svg';
import '../css/links-section-component.css';

export default function LinksSection({ title, items, renderItem, editable = false, emptyTitle, isDescEdit = true, isNeedInput = true, maxLength,
  maxCount, onDescriptionChange, onAdd, onRemove, inputValue, onInputChange, className = '' }) {
  return (
    <div className={`links-section ${className} ${editable ? 'edit' : ''}`}>
      {title && <h3 className='links-title'>{title}</h3>}
        {items && items.length > 0 ? (
          <ul className="links-list">
            {items.map((item, idx) => (
              <li key={idx} className="links-item">
                {editable && <button type="button" onClick={() => onRemove(idx)} className="remove-button">×</button>}
                <div className='links-item-container'>
                  {renderItem(item)}
                  {(editable && isDescEdit) &&
                    <input
                      type="text"
                      value={item.description}
                      maxLength={maxLength}
                      onChange={(e) => onDescriptionChange(idx, e.target.value)}
                      placeholder="Описание ссылки"
                      className="text-input link-description-input"
                    />
                  }
                  {!editable && <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>}
                </div>
              </li>
            ))}
          </ul>
        ) : <p className="empty-list">{emptyTitle}</p>}
      {(editable && isNeedInput) && (
        <div className="link-input-group">
          <input
            type="text"
            value={inputValue}
            maxLength={200}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={items.length >= maxCount ? 'Достигнут максимум ссылок' : 'Введите ссылку'}
            className="text-input link-input"
            disabled={items.length >= maxCount}
          />
          <button type="button" onClick={onAdd} disabled={items.length >= maxCount} className="button add-submit-button add-link-button">Добавить</button>
        </div>
      )}
    </div>
  );
}
