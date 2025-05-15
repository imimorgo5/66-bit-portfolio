import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicCard } from '../services/public-service.js';
import '../css/card-detail.css';
import userIcon from '../img/user-icon.svg';
import fileIcon from '../img/file_icon.svg';
import linkIcon from '../img/link_icon.svg';

export default function PublicCardPage() {
  const { token } = useParams();
  const [card, setCard] = useState(null);

  useEffect(() => {
    getPublicCard(token)
      .then(data => setCard(data.card))
      .catch(() => setCard(undefined));
  }, [token]);

  const handleFileClick = async (file) => {
    try {
      const response = await fetch(`http://localhost:8080/uploads/${file.fileTitle}`, {
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error(`Ошибка при скачивании файла: ${response.status}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);  
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileTitle;
      document.body.appendChild(link);
      link.click();
  
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
    }
  };

  if (card === null) return <p>Загрузка…</p>;
  if (card === undefined) return <p>Карточка не найдена или ссылка просрочена.</p>;

  return (
    <div className="card-detail-content">
        <div className='card-detail-container'>
            <div className='card-user-container'>
                <div className='card-user-info-container'>
                    <div className="card-user-info">
                        <img
                            src={card.publicPerson.imageName ? `http://localhost:8080/uploads/${card.publicPerson.imageName}` : userIcon}
                            alt="Фото пользователя"
                            className="card-user-photo"
                        />
                        <h2>{card.publicPerson.username}</h2>
                    </div>
                    <div className='card-user-description'>
                        <p><span className='card-user-description-title'>Email: </span>{card.publicPerson.email}</p>
                        <p><span className='card-user-description-title'>Дата рождения: </span>{card.publicPerson.birthDate ? card.publicPerson.birthDate : 'Не указана'}</p>
                        <p><span className='card-user-description-title'>Телефон: </span>{card.publicPerson.phoneNumber ? card.publicPerson.phoneNumber : 'Не указан' }</p>
                    </div>
                </div>
                <div className="card-links public-card-links">
                    <h3>Способы связи:</h3>
                    {card.publicPerson.linkDTOs && card.publicPerson.linkDTOs.length > 0 ? (
                        <ul className="card-links-list">
                        {card.publicPerson.linkDTOs.map((link, index) => (
                            <li key={index} className='card-links-item'>
                                <a className="link-title" href={link.link}>
                                    {link.description || link.link}
                                </a>
                                <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                            </li>
                        ))}
                        </ul>
                    ) : <p className='card-empty-list'>Не указано</p>}
                </div>
            </div>
            <div className='card-description-container public-card-description-container'>
                <h2>{card.title}</h2>
                <label>Описание карточки:</label>
                <p className='card-description'>{card.description}</p>
            </div>
            <div className='card-appendices-container'>
                <div className='card-projects public-card-projects'>
                    <h3>Проекты:</h3>
                    {card.projects && card.projects.length > 0? (
                        <ul className="card-projects-list">
                            {card.projects.map((project, index) => (
                                <li key={index} className="card-projects-item">
                                    <Link to={`http://localhost:3000/projects/shared/${project.shareToken}`} className="project-title">{project.title}</Link>
                                    <img src={linkIcon} className='link-icon' alt='Иконка ссылки'></img>
                                </li>
                            ))}
                        </ul>
                    ) : <p className='card-empty-list'>Проекты не прикреплены</p>}
                </div>
                <div className="card-files public-card-files">
                    <h3>Файлы:</h3>
                    {card.cardFiles && card.cardFiles.length > 0? (
                        <ul className="card-files-list">
                            {card.cardFiles.map((file, index) => (
                                <li key={index} className="card-files-item"  onClick={() => handleFileClick(file)}>
                                    <img src={fileIcon} className='file-icon' alt='Иконка файла'></img>
                                    <h4 className="file-title">{
                                        file.description ? file.description : 
                                        file.fileTitle ? file.fileTitle.split('_').at(-1).split(0, 38) : 
                                        'Ошибка'
                                    }</h4>
                                </li>
                            ))}
                        </ul>
                    ) : <p className='card-empty-list'>Файлы не прикреплены</p>}
                </div>              
            </div>
        </div>
    </div>
  );
}
