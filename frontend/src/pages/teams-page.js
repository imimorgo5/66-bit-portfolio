import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../css/teams-page.css';
import { AuthContext } from '../context/AuthContext';
import { getAllPersonTeams, createTeam } from '../services/team-service';
import userIcon from '../img/user-icon.svg';
import emptyArrow from '../img/empty-arrow.svg';
import emptyPicture from '../img/empty-items-picture.png';
import adminIcon from '../img/admin-icon.svg';

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
    createTeam({ title: 'Новая команда', persons: [] })
      .then(newTeam => navigate(`/teams/${newTeam.id}`))
      .catch(err => console.error(err));
  };

  if (loading || authLoading) return <div className="loading-container">Загрузка...</div>;

  const sortedTeams = teams.sort((a, b) => {
    if (isNew(a)) return -1;
    if (isNew(b)) return 1;
    return 0;
  });

  return (
    <div className="teams-page-wrapper">
      <Header />
      <div className="teams-page-content">
        {teams.length > 0 ? (
          <div className='teams-items-container'>
            <ul className="teams-list">
              {sortedTeams.map(team => {
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
                    <h1 className="teams-item-title">{team.title}</h1>
                    <ul className="team-persons-list">
                      {sortedMembers.map(member => (
                        <li key={member.personId} className="team-persons-list-item">
                          <img
                            src={
                              member.imageName
                                ? `http://localhost:8080/uploads/${member.imageName}`
                                : userIcon
                            }
                            alt="Фото пользователя"
                            className="team-person-photo"
                          />
                          <div className='team-person-info-container'>
                            <div className='team-person-name-container'>
                              <h2 className='team-person-username'>{member.username}</h2>
                              {member.personId === team.adminId && <img src={adminIcon} alt='Иконка админа' className='admin-icon'/>}
                            </div>
                            {member.role && <h3 className='team-person-role'>{member.role}</h3>}
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
              src={emptyPicture}
              alt="Красивая картинка"
              className="empty-items-picture"
            />
            <p className="empty-title">
              У Вас пока нет команд - <span>Создайте первую!</span>
            </p>
            <div className="arrow-to-add">
              <img
                src={emptyArrow}
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
