import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, NavLink, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/header.js';
import '../css/team-detail.css';
import { AuthContext } from '../context/AuthContext';
import { getTeamById, updateTeamById, deleteTeamById, getInvitedPersons } from '../services/team-service.js';
import { createTeamCard, getTeamCards } from '../services/card-service.js';
import { createTeamProject, getTeamProjects } from '../services/project-service.js';
import { getAllPeople } from '../services/person-service.js';
import userIcon from '../img/user-icon.svg';
import adminIcon from '../img/admin-icon.svg';
import defaultPreview from '../img/defaultPreview.png';

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
  const [projects, setProjects] = useState([]);
  const [cards, setCards] = useState([]);
  const [invitedPersons, setInvitedPersons] = useState([]);
  const [newInvitesSent, setNewInvitesSent] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    async function init() {
      await loadTeam();
      await loadProjects();
      await loadCards();
      setLoading(false);
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mode === 'view' && newInvitesSent) {
      toast.success('Приглашения отправлены');
      setNewInvitesSent(false);
    }
  }, [mode, newInvitesSent]);

  const loadTeam = async () => {
    try {
      const t = await getTeamById(id);
      setTeam(t);
      setTitle(t.title);
      setMembers(t.persons || []);
      const initialRoles = {};
      (t.persons || []).forEach(p => {
        initialRoles[p.personId] = p.role || '';
      });
      setRoles(initialRoles);
    } catch (e) {
      console.error(e);
    }
  };

  const loadProjects = async () => {
    try {
      const projs = await getTeamProjects(id);
      setProjects(projs);
    } catch (e) { console.error(e); }
  };

  const loadCards = async () => {
    try {
      const cds = await getTeamCards(id);
      setCards(cds);
    } catch (e) { console.error(e); }
  };

  const loadInvitedPersons = async () => {
    try {
      const invitedPersons = await getInvitedPersons(id);
      setInvitedPersons(invitedPersons);
    } catch (e) { console.error(e); }
  }

  const handleDelete = async () => {
    await deleteTeamById(id);
    navigate('/teams');
  };

  const startEdit = async () => {
    await loadInvitedPersons();
    setMode('edit');
  };

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
    if (members.find(m => m.personId === person.id || m.personId === person.id) || members.length >= 6) return;
    setMembers(prev => [...prev, person]);
    setRoles(prev => ({ ...prev, [person.id]: '' }));
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeMember = id => {
    setMembers(prev => prev.filter(m => m.personId !== id && m.id !== id));
    setRoles(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const changeRole = (id, value) => {
    setRoles(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    const existingIds = team.persons.map(p => p.personId);
    const added = members.filter(m => !existingIds.includes(m.personId || m.id));
    const personsPayload = members.map(m => ({ email: m.email, role: roles[m.personId || m.id] || '' }));
    const myRole = roles[user.id] || '';
    await updateTeamById(id, { title, myRole, persons: personsPayload });
    if (added.length > 0) {
      setNewInvitesSent(true);
    }
    setMode('view');
    loadTeam();
  };

  const handleCreateProject = async () => {
    try {
      const newProj = await createTeamProject({ teamId: id, title: 'Новый проект' });
      navigate(`/projects/${newProj.id}?from=${encodeURIComponent(`/teams/${id}`)}`);
    } catch (e) { console.error(e); }
  };

  const handleCreateCard = async () => {
    try {
      const newCard = await createTeamCard({ teamId: id, title: 'Новая карточка' });
      navigate(`/cards/${newCard.id}?from=${encodeURIComponent(`/teams/${id}`)}`);
    } catch (e) { console.error(e); }
  };

  if (loading || authLoading) return <div className="loading-container">Загрузка...</div>;
  if (!team || authError) return <div className='error-container'>Ошибка получения данных...</div>;
  if (!user) {
    navigate('/login');
    return null;
  }

  const baseList = mode === 'view' ? (team.persons || []) : members;
  const sortedMembers = [...baseList].sort((a, b) => {
    if (a.personId === user.id) return -1;
    if (b.personId === user.id) return 1;
    return 0;
  });

  return (
    <div className="team-detail-page">
      <Header />
      <div className="team-detail-content">
        {mode === 'view' ? (
          <div className="team-view-container">
            <NavLink to='/teams' className='back-to-teams'><span>←</span> Назад к командам</NavLink>
            <div className='team-info-container'>
              <div className='team-main'>
                <h1 className="team-title">{team.title}</h1>
                <ul className="team-members-list">
                  {sortedMembers.map(member => (
                    <li key={member.personId} className="member-item">
                      <img
                        src={member.imageName
                          ? `http://localhost:8080/uploads/${member.imageName}`
                          : userIcon}
                        alt="Изображение пользователя"
                        className="member-photo"
                      />
                      <div className="member-info">
                        <div className='team-person-name-container'>
                          <h2 className='team-person-username'>{member.username}</h2>
                          {member.personId === team.adminId && <img src={adminIcon} alt='Иконка админа' className='admin-icon'/>}
                        </div>
                        {member.role && <h3 className='team-person-role'>{member.role}</h3>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {team.adminId === user.id &&
                <div className="team-info-buttons-conatainer">
                  <button onClick={startEdit} className="edit-team-button">Редактировать</button>
                  <button onClick={handleDelete} className="delete-team-button">Удалить</button>
                </div>
              }
            </div>
            <div className='team-projects-container'>
              <h1 className='team-title'>Проекты</h1>
              {projects.length > 0 ?
                <ul className='team-projects-list'>
                  {projects.map(proj => (
                    <Link to={`/projects/${proj.id}?from=${encodeURIComponent(`/teams/${team.id}`)}`} className='team-project-link'>
                      <li key={proj.id} className='team-projects-item'>
                          <img src={proj.imageNamee ? `http://localhost:8080/uploads/${proj.imageName}` : defaultPreview} 
                            className='team-project-image' alt="Фото проекта/карточки"/>
                          <div className='team-project-info-container'>
                            <h2 className='team-project-title'>{proj.title}</h2>
                            {proj.description &&
                              <p className='team-project-description'>{proj.description.length > 30 ? proj.description.slice(0, 27) + '...' : proj.description}</p>}
                          </div>
                      </li>
                    </Link>
                  ))}
                </ul> :
                <p className='team-empty-list'>Ещё не создан ни один проект</p>
              }
              {team.adminId===user.id && <button onClick={handleCreateProject} className='add-team-project-button'>Создать проект</button>}
            </div>
            <div className='team-cards-container'>
              <h1 className='team-title'>Карточки</h1>
              {cards.length > 0 ?
                <ul className='team-cards-list'>
                  {cards.map(card => (
                    <Link to={`/cards/${card.id}?from=${encodeURIComponent(`/teams/${team.id}`)}`} className='team-card-link'>
                      <li key={card.id} className='team-cards-item'>
                        <div className='team-card-info-container'>
                          <h2 className='team-card-title'>{card.title}</h2>
                          {card.description &&
                            <p className='team-card-description'>{card.description.length > 50 ? card.description.slice(0, 47) + '...' : card.description}</p>}
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul> :
                <p className='team-empty-list'>Ещё не создана ни одна карточка</p>
              }
              {team.adminId===user.id && <button onClick={handleCreateCard} className='add-team-card-button'>Создать карточку</button>}
            </div>
          </div>
          
        ) : (
          <div className="team-edit-container">
            <div className='team-edit-main'>
              <input
                type="text"
                value={title}
                maxLength={30}
                className='team-name-input'
                onChange={e => setTitle(e.target.value)}
              />
              <div className="add-person-container">
                <input
                  type="text"
                  value={searchTerm}
                  className='add-person-input'
                  onChange={onSearchChange}
                  disabled={members.length >= 6}                
                  placeholder={members.length >= 6 ? 'Достигнут максимум участников' : 'Введите email или имя пользователя'}
                />
                {searchResults.length > 0  && (
                  <ul className="search-person-results-list" ref={searchRef}>
                    {searchResults.map(p => {
                      const already = members.some(m=>m.id===p.id || m.personId===p.id) || invitedPersons.some(i=>i.id===p.id);
                      return (
                        <li
                          key={p.id}
                          onClick={() => !already && addMember(p)}
                          className={already ? 'already-added' : ''}
                        >
                          {p.username} — {p.email}
                          {already && <span className="tag">{members.some(m=>m.id===p.id || m.personId===p.id)?'Уже добавлен':'Уже приглашён'}</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <ul className="team-edit-members-list">
                {sortedMembers.map(member => (
                  <li key={member.personId || member.id} className="edit-member-item">
                    <div className="edit-member-info">
                      <img
                        src={member.imageName
                          ? `http://localhost:8080/uploads/${member.imageName}`
                          : userIcon}
                        alt=""
                        className="member-photo"
                      />
                      <div className='team-person-name-container'>
                        <h2 className='team-person-username'>{member.username}</h2>
                        {member.personId === team.adminId && <img src={adminIcon} alt='Иконка админа' className='admin-icon'/>}
                      </div>
                    </div>
                    <div className="member-edit-role-container">
                      <input
                        type="text"
                        value={roles[member.personId || member.id] || ''}
                        className={'member-edit-role-input' + (member.personId === team.adminId ? ' my-role' : '')}
                        onChange={e => changeRole(member.personId || member.id, e.target.value)}
                        maxLength={20}
                        placeholder="Введите роль участника"
                      />
                      {member.personId !== user.id && (
                        <button onClick={() => removeMember(member.personId || member.id)} className="member-remove-button">×</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {invitedPersons.length > 0 &&
                <div className="invited-persons-section">
                  <h1 className='team-invited-title'>Приглашенные пользователи</h1>
                    <ul className="team-invited-list">
                      {invitedPersons.map(inv => (
                        <li key={inv.id} className="team-invited-item">
                          <img src={inv.imageName?`http://localhost:8080/uploads/${inv.imageName}`:userIcon}
                              className="member-photo" alt="" />
                          <h2 className='team-person-username'>{inv.username}</h2>
                        </li>
                      ))}
                    </ul>
                </div>
              }
            </div>
            <div className="team-info-buttons-conatainer">
              <button onClick={handleSave} className="save-team-button" disabled={!title.trim()}>Сохранить</button>
              <button onClick={cancelEdit} className="cancel-edit-team-button">Отмена</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
