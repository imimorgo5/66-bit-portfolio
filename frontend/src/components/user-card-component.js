import React from 'react';
import { Link } from 'react-router-dom';
import userIcon from '../img/user-icon.svg';
import linkIcon from '../img/link_icon.svg';
import { normalizeUrl } from '../utils/utils.js';
import '../css/user-card-component.css'

export default function UserCard({user, className = '', infoTitle = ''}) {
  return (
    <div className={`user-card ${className}`}>
      <div className="user-info-container">
        <div className="user-info">
          <img
            src={user.imageName ? `http://localhost:8080/uploads/${user.imageName}` : userIcon}
            alt="Фото пользователя"
            className="user-photo"
          />
          <h2>{user.username}</h2>
        </div>
        <div className="user-data">
          {infoTitle && <h3 className="user-data-title">Личные данные</h3>}
          <div className="user-description">
            <p className='user-description-item'><span className="description-title">Email: </span>{user.email}</p>
            <p className='user-description-item'><span className="description-title">Дата рождения: </span>{user.birthDate ? new Date(user.birthDate).toLocaleDateString('ru-RU') : 'Не указана'}</p>
            <p className='user-description-item'><span className="description-title">Телефон: </span>{user.phoneNumber || 'Не указан'}</p>
          </div>
        </div>
      </div>
      <div className="user-links">
        <h3 className="user-links-title">Способы связи</h3>
        {user.linkDTOs && user.linkDTOs.length > 0 ?
        <ul className="user-links-list">
            {user.linkDTOs.map((link, i) => (
                <li key={i} className="user-links-item">
                    <Link to={normalizeUrl(link.link)} target="_blank" rel="noopener noreferrer" className="link user-link-title">
                        {link.description ? link.description : link.link.length > 35 ? link.link.slice(0, 32) + '...' : link.link}
                    </Link>
                    <img src={linkIcon} alt="Иконка ссылки" className="link-icon" />
                </li>
            ))}
        </ul>
        : <p className="user-empty-list">Не указано</p>}
      </div>
    </div>
  );
}
