
import React from 'react';
import { Link } from 'react-router-dom';
import { normalizeUrl } from '../utils/utils.js';
import linkIcon from '../img/link_icon.svg';
import '../css/links-section-component.css';

export default function LinksSection({ title, links, editable = false, maxLength, maxCount, onDescriptionChange, onAdd, onRemove, inputValue, onInputChange, className = '' }) {
  return (
    <div className={`links-section ${className} ${editable ? 'edit' : ''}`}>
      <h3 className='links-title'>{title}</h3>
      {links && links.length > 0 ? (
        <ul className="links-list">
          {links.map((l, i) => (
            <li key={i} className="links-item">
              {editable && <button type="button" onClick={() => onRemove(i)} className="remove-button">×</button>}
              <div className='links-item-container'>
                <Link to={normalizeUrl(l.link)} target="_blank" rel="noopener noreferrer" className="link link-title">
                  {!editable && l.description ? l.description : l.link.length > maxLength ? l.link.slice(0, maxLength - 3) + '...' : l.link}
                </Link>
                {editable && 
                  <input
                    type="text"
                    value={l.description}
                    maxLength={maxLength}
                    onChange={(e) => onDescriptionChange(i, e.target.value)}
                    placeholder="Описание ссылки"
                    className="text-input link-description-input"
                  />
                }
                {!editable && <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>}
              </div>
            </li>
          ))}
        </ul>
      ) : <p className="empty-list">Не указано</p>}
      {editable && (
        <div className="link-input-group">
          <input
            type="text"
            value={inputValue}
            maxLength={200}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={links.length >= maxCount ? 'Достигнут максимум ссылок' : 'Введите ссылку'}
            className="text-input link-input"
            disabled={links.length >= maxCount}
          />
          <button type="button" onClick={onAdd} disabled={links.length >= maxCount} className="button add-submit-button add-link-button">Добавить</button>
        </div>
      )}
    </div>
  );
}
