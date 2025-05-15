import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../css/teams-page.css';
import { AuthContext } from '../context/AuthContext';
import { getAllPersonTeams, createTeam } from '../services/team-service';
import userIcon from '../img/user-icon.svg';
import EmptyArrow from '../img/empty-arrow.svg';
import EmptyPicture from '../img/empty-items-picture.png';

export default function TeamsPage() {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPersonTeams()
      .then(teams => setTeams(teams))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const isNew = (team) => team.persons.length === 1 && team.title === 'Новая команда';

  const handleCreateDefaultTeam = () => {
    if (!user) return navigate('/register');
    createTeam({ title: 'Новая команда', emails: [] })
      .then(response => {
        const newTeam = response.team ?? response;
        newTeam.persons = [user];
        setTeams(prev => [...prev, newTeam]);
      })
      .catch(err => console.error(err));
  };

  if (loading || authLoading) return <div className="loading-container">Загрузка...</div>;

  return (
    <div className="teams-page-wrapper">
      <Header />
      <div className="teams-page-content">
        {teams.length > 0 ? (
          <div className='teams-items-container'>
            <ul className="teams-list">
              {teams.map(team => {
                const sortedMembers = [...team.persons].sort((a, b) => {
                  if (a.email === user.email) return -1;
                  if (b.email === user.email) return 1;
                  return 0;
                });
                return (
                  <li
                    key={team.id}
                    className={"teams-list-item" + (isNew(team) ? ' new-team' : '')}
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <span className="teams-item-title">{team.title}</span>
                    <ul className="team-persons-list">
                      {sortedMembers.map(person => (
                        <li key={person.id} className="team-persons-list-item">
                          <img
                            src={
                              person.imageName
                                ? `http://localhost:8080/uploads/${person.imageName}`
                                : userIcon
                            }
                            alt="Фото пользователя"
                            className="team-person-photo"
                          />
                          <div className='team-person-info-container'>
                            <p className='team-person-username'>{person.username}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
              )})}
            </ul>
          </div>
        ) : (
          <div className="empty-previews">
            <img
              src={EmptyPicture}
              alt="Красивая картинка"
              className="empty-items-picture"
            />
            <p className="empty-title">
              У Вас пока нет команд - <span>Создайте первую!</span>
            </p>
            <div className="arrow-to-add">
              <img
                src={EmptyArrow}
                className="empty-arrow"
                alt="Стрелка к кнопке"
              />
            </div>
          </div>
        )}
        <div className='teams-create-btn-container'>
          <button className="teams-create-btn" onClick={handleCreateDefaultTeam}>
            Создать команду
          </button>
        </div>
      </div>
    </div>
  );
}
