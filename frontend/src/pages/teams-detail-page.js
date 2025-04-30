import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import Header from '../components/header';
import '../css/team-detail.css';
import { AuthContext } from '../context/AuthContext';
import { getTeamById, deleteTeamById } from '../services/teamService';

export default function TeamDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getTeamById(id)
      .then(t => setTeam(t))
      .catch(err => setError(err.message || 'Ошибка'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    deleteTeamById(team.id)
    .then(() => navigate('/teams'))
    .catch(err => alert('Ошибка при удалении: ' + err.message));
  };

  if (loading) return <div className="team-loading">Загрузка...</div>;
  if (error) return <div className="team-error">{error}</div>;
  if (!team) return <div className="team-empty">Команда не найдена</div>;

  return (
    <div className="team-detail-page">
      <Header />
      <div className="team-detail-container">
        <NavLink to="/teams" className="team-back">← Назад к командам</NavLink>
        <h1 className="team-title">{team.title}</h1>
        <div className="team-members-section">
          <h2 className="team-members-heading">Участники</h2>
          {team.persons && team.persons.length > 0 ? (
            <ul className="team-members-list">
              {team.persons.map(person => (
                <li key={person.id} className="team-member-item">
                  <span className="member-name">{person.username}</span>
                  <span className="member-email">{person.email}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="team-no-members">В этой команде пока нет участников.</p>
          )}
        </div>
        {user && (
          <div className="team-actions">
            <button className="team-delete-btn" onClick={handleDelete}>Удалить команду</button>
          </div>
        )}
      </div>
    </div>
  );
}