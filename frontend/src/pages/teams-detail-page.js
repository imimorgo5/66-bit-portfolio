import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/header';
import '../css/team-detail.css';
import { AuthContext } from '../context/AuthContext';
import {
  getTeamById,
  updateTeamById,
  deleteTeamById
} from '../services/team-service';
import { getAllPeople } from '../services/person-service';
import userIcon from '../img/user-icon.svg';

export default function TeamDetailPage() {
  const { user, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [mode, setMode] = useState('view');
  const [title, setTitle] = useState('');
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    loadTeam()
    .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTeam = async () => {
    try {
      const t = await getTeamById(id);
      setTeam(t);
      setTitle(t.title);
      setMembers(t.persons || []);
      const initialRoles = {};
      (t.persons || []).forEach(p => {
        initialRoles[p.email] = p.role || '';
      });
      setRoles(initialRoles);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Удалить команду?')) {
      await deleteTeamById(id);
      navigate('/teams');
    }
  };

  const startEdit = () => setMode('edit');
  const cancelEdit = () => {
    setMode('view');
    loadTeam();
    setSearchTerm('');
    setSearchResults([]);
  };

  const onSearchChange = async e => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length < 2 || members.length >= 6) {
      setSearchResults([]);
      return;
    }
    try {
      const people = await getAllPeople();
      const filtered = people
        .filter(p =>
          (p.email.includes(term) || p.username.toLowerCase().includes(term.toLowerCase())) &&
          p.id !== user.id
        )
        .slice(0, 10);
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = person => {
    if (members.find(m => m.email === person.email) || members.length >= 6) return;
    setMembers(prev => [...prev, person]);
    setRoles(prev => ({ ...prev, [person.email]: '' }));
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeMember = email => {
    setMembers(prev => prev.filter(m => m.email !== email));
    setRoles(prev => {
      const copy = { ...prev };
      delete copy[email];
      return copy;
    });
  };

  const changeRole = (email, value) => {
    setRoles(prev => ({ ...prev, [email]: value }));
  };

  const handleSave = async () => {
    const emails = members.map(m => m.email);
    await updateTeamById(id, { title, emails });
    setMode('view');
    loadTeam();
  };

  if (loading || authLoading) return <div className="loading-container">Загрузка...</div>;
  if (!team || authError) return <div className='error-container'>Ошибка получения данных...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  const baseList = mode === 'view' ? (team.persons || []) : members;
  const sortedMembers = [...baseList].sort((a, b) => {
    if (a.email === user.email) return -1;
    if (b.email === user.email) return 1;
    return 0;
  });

  return (
    <div className="team-detail-page">
      <Header />
      <div className="team-detail-content">
        {mode === 'view' ? (
          <div className="team-view">
            <h2 className="team-title">{team.title}</h2>
            <ul className="team-members-list">
              {sortedMembers.map(person => (
                <li key={person.id} className="member-item">
                  <img
                    src={person.imageName
                      ? `http://localhost:8080/uploads/${person.imageName}`
                      : userIcon}
                    alt=""
                    className="member-photo"
                  />
                  <div className="member-info">
                    <p className="member-name">{person.username}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="actions">
              <button onClick={startEdit} className="btn-edit">Редактировать</button>
              <button onClick={handleDelete} className="btn-delete">Удалить</button>
            </div>
          </div>
        ) : (
          <div className="team-edit">
            <div className="field">
              <label>Название команды</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Добавить участника (email)</label>
              <input
                type="text"
                value={searchTerm}
                onChange={onSearchChange}
                disabled={members.length >= 6}
                placeholder={
                  members.length >= 6 ? 'Достигнут максимум участников' : 'Email или имя'
                }
              />
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map(p => {
                    const already = members.some(m => m.email === p.email);
                    return (
                      <li
                        key={p.id}
                        onClick={() => !already && addMember(p)}
                        className={already ? 'already-added' : ''}
                      >
                        {p.username} — {p.email}
                        {already && <span className="tag">В списке</span>}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <ul className="team-members-list">
              {sortedMembers.map(person => (
                <li key={person.id} className="member-item-edit">
                  <div className="member-main">
                    <img
                      src={person.imageName
                        ? `http://localhost:8080/uploads/${person.imageName}`
                        : userIcon}
                    alt=""
                    className="member-photo"
                  />
                  <div className="member-info">
                    <p className="member-name">{person.username}</p>
                  </div>
                </div>
                <div className="member-controls">
                  <input
                    type="text"
                    value={roles[person.email] || ''}
                    onChange={e => changeRole(person.email, e.target.value)}
                    placeholder="Роль"
                  />
                  {person.email !== user.email && (
                    <button onClick={() => removeMember(person.email)} className="btn-remove">
                      Удалить
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="actions">
            <button onClick={handleSave} className="btn-save" disabled={!title.trim()}>
              Сохранить
            </button>
            <button onClick={cancelEdit} className="btn-cancel">
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}
