import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import AddButton from './add-button-component.js';
import { getFullName } from '../utils/file.js';
import defaultPreview from '../img/defaultPreview.png';
import '../css/team-items-section-component.css';

export default function TeamItemsSection({ title, items, getLink, isItemsWithPhoto = false, emptyTitle, adminId, buttonTitle, handleCreateItem, className = '' }) {
    const { user } = useContext(AuthContext);
    return (
        <div className={`team-items-container ${className}`}>
            <h1 className='items-title'>{title}</h1>
            {items.length > 0 ?
                <div className='items-list-container'>
                    <ul className='team-items-list'>
                        {items.map(item => (
                            <Link to={getLink(item)} className='team-item-link'>
                                <li key={item.id} className='team-item'>
                                    {isItemsWithPhoto &&
                                        <img src={item.imageName ? getFullName(item.imageName) : defaultPreview} className='team-item-image' alt="Фото проекта" />
                                    }
                                    <div className='team-item-info-container'>
                                        <h2 className='team-item-title'>{item.title}</h2>
                                        {item.description &&
                                            <p className='team-item-description'>{isItemsWithPhoto ?
                                                item.description.length > 27 ? item.description.slice(0, 24) + '...' : item.description
                                                : item.description.length > 45 ? item.description.slice(0, 42) + '...' : item.description
                                            }</p>
                                        }
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
                : <p className='team-empty-list'>{emptyTitle}</p>
            }
            {adminId === user.id && <AddButton title={buttonTitle} onClick={handleCreateItem} className='team-items' />}
        </div>
    );
}