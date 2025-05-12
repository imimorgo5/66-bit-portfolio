import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import '../css/teams-page.css';
import { AuthContext } from '../context/AuthContext';
import { getAllPersonTeams, createTeam } from '../services/teamService';
import { getAllPeople } from '../services/PersonService';

export default function TeamsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [allPeople, setAllPeople] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedEmails, setSelectedEmails] = useState([]);

  useEffect(() => {
    getAllPersonTeams()
        .then(list => setTeams(list))
        .catch(console.error)
        .finally(() => setLoading(false));
    }, []);

  const openForm = () => {
    if (!user) return navigate('/register');
    setIsFormOpen(true);
    getAllPeople().then(list => setAllPeople(list)).catch(console.error);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setTitle('');
    setSelectedEmails([]);
  };

  const handleSubmit = () => {
    createTeam({ title, emails: selectedEmails })
        .then(response => {
        const newTeam = response.team ?? response;
        const members = allPeople
            .filter(p => selectedEmails.includes(p.email));
        if (user && !selectedEmails.includes(user.email)) {
            members.unshift(user);
        }
        newTeam.persons = members;
        setTeams(prev => [...prev, newTeam]);
        closeForm();
        })
        .catch(console.error);
  };

  const toggleEmail = email => {
    setSelectedEmails(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  return (
    <div className="teams-page-wrapper">
      <Header />
      <div className="teams-page-content">
        <div className="teams-title-container">
          <h1 className="teams-title">Мои команды</h1>
        </div>
        <div className='teams-items-container'>
          {loading ? (
          <p className="teams-loading">Загрузка команд...</p>
            ) : teams.length > 0 ? (
            <ul className="teams-list">
                {teams.map(team => (
                <li
                    key={team.id}
                    className="teams-list-item"
                    onClick={() => navigate(`/teams/${team.id}`)}
                >
                    <span className="teams-item-title">{team.title}</span>
                    <span className="teams-item-count">
                        Участников: {team.persons?.length || 0}
                    </span>
                </li>
                ))}
            </ul>
            ) : (
            <p className="teams-empty">У вас нет команд. Создайте первую!</p>
            )}
        </div>
        <div className='teams-create-btn-container'>
          <button className="teams-create-btn"  onClick={openForm}>
            Создать команду
          </button>
        </div>
        {isFormOpen && (
          <div className="teams-form-overlay">
            <div className="teams-form-container">
              <h2 className="teams-form-title">Новая команда</h2>

              <label className="teams-form-field">
                Заголовок
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="teams-form-input"
                  placeholder="Название команды"
                />
              </label>

              <fieldset className="teams-form-field">
                <legend>Участники</legend>
                <div className="teams-people-list">
                  {allPeople.map(p => (
                    <label key={p.id} className="teams-checkbox-label">
                      <input
                        type="checkbox"
                        value={p.email}
                        checked={selectedEmails.includes(p.email)}
                        onChange={() => toggleEmail(p.email)}
                      />
                      {p.username} — {p.email}
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="teams-form-buttons">
                <button
                  className="teams-submit-btn"
                  onClick={handleSubmit}
                  disabled={!title.trim() || selectedEmails.length === 0}
                >
                  Создать
                </button>
                <button className="teams-cancel-btn" onClick={closeForm}>
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
