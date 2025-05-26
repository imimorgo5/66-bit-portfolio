import React, { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, NavLink, Link } from 'react-router-dom';
import Header from '../components/header-component.js';
import '../css/team-detail.css';
import { AuthContext } from '../context/AuthContext';
import { getTeamById, updateTeamById, deleteTeamById, getInvitedPersons } from '../services/team-service.js';
import { createTeamCard, getTeamCards } from '../services/card-service.js';
import { createTeamProject, getTeamProjects } from '../services/project-service.js';
import { getAllPeople } from '../services/person-service.js';
import userIcon from '../img/user-icon.svg';
import adminIcon from '../img/admin-icon.svg';
import defaultPreview from '../img/defaultPreview.png';
import ErrorComponent from '../components/error-component.js';
import LoadingComponent from '../components/loading-component.js';
import TeamMembersList from '../components/team-members-list-component.js';

export default function TeamDetailPage() {
  const { user, isLoading: authLoading, error: authError } = useContext(AuthContext);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamProjectsLoading, setTeamProjectsLoading] = useState(true);
  const [teamCardsLoading, setTeamCardsLoading] = useState(true);
  const [team, setTeam] = useState(null);
  const [isEditMode, setIsEditMode] = useState(state?.isEdit);
  const [editData, setEditData] = useState({
    title: '',
    members: [],
    roles: {},
    invited: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [projects, setProjects] = useState([]);
  const [cards, setCards] = useState([]);
  const [newInvitesSent, setNewInvitesSent] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    async function init() {
      await getTeamById(id).then(setTeam).catch(console.error).finally(() => setTeamLoading(false));
      await getTeamProjects(id).then(setProjects).catch(console.error).finally(() => setTeamProjectsLoading(false));
      await getTeamCards(id).then(setCards).catch(console.error).finally(() => setTeamCardsLoading(false));
    }
    init();
  }, [id]);

  useEffect(() => {
    if (isEditMode && team) {
      getInvitedPersons(id)
        .then(invited => {
          setEditData({
            title: team.title || '',
            members: team.persons || [],
            roles: team.persons.reduce((acc, p) => ({ ...acc, [p.personId]: p.role || '' }), {}),
            invited: invited
          });
          setIsEditMode(true);
        })
        .catch(console.error);
    }
  }, [isEditMode, team, id]);

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
    if (!isEditMode && newInvitesSent) {
      setNewInvitesSent(false);
    }
  }, [isEditMode, newInvitesSent]);

  const loadTeam = async () => await getTeamById(id).then(setTeam).catch(console.error).finally(() => setTeamLoading(false));

  const handleDelete = async () => await deleteTeamById(id).then(() => navigate('/teams')).catch(console.error);

  const cancelEdit = () => {
    setIsEditMode(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const onSearchChange = async e => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length < 2 || editData.members.length >= 6) {
      setSearchResults([]);
      return;
    }
    try {
      const people = await getAllPeople().catch(console.error);
      const filtered = people.filter(p => (p.email.includes(term) || p.username.toLowerCase().includes(term.toLowerCase())) && p.id !== user.id).slice(0, 10);
      setSearchResults(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const changeTitle = e => setEditData(d => ({ ...d, title: e.target.value }));

  const addMember = person => {
    if (editData.members.find(m => m.personId === person.id || m.personId === person.id) || editData.members.length >= 6) return;
    setEditData(d => ({
      ...d,
      members: [...d.members, person],
      roles: { ...d.roles, [person.id]: '' }
    }));
    setSearchTerm('');
    setSearchResults([]);
  };

  const removeMember = id => {
    setEditData(d => ({
      ...d,
      members: d.members.filter(m => m.personId !== id && m.id !== id),
      roles: Object.fromEntries(
        Object.entries(d.roles).filter(([k]) => k !== String(id))
      )
    }));
  };

  const changeRole = (id, role) => setEditData(d => ({ ...d, roles: { ...d.roles, [id]: role } }));

  const handleSave = async () => {
    const existingIds = team.persons.map(p => p.personId);
    const added = editData.members.filter(m => !existingIds.includes(m.personId || m.id));
    const payload = {
      title: editData.title,
      myRole: editData.roles[user.id] || '',
      persons: editData.members.map(m => ({ email: m.email, role: editData.roles[m.personId || m.id] || '' }))
    };
    try {
      await updateTeamById(id, payload);
      if (added.length > 0) {
        setToastMessage(`Приглашение в команду отправлены для ${added.length} человек(а)`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setSearchTerm('');
      setIsEditMode(false);
      loadTeam();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async () => {
    try {
      const newProj = await createTeamProject({ teamId: id, title: 'Новый проект' });
      navigate(`/projects/${newProj.id}?from=${encodeURIComponent(`/teams/${id}`)}`, { state: { isEdit: true } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateCard = async () => {
    try {
      const newCard = await createTeamCard({ teamId: id, title: 'Новая карточка' });
      navigate(`/cards/${newCard.id}?from=${encodeURIComponent(`/teams/${id}`)}`, { state: { isEdit: true } });
    } catch (err) {
      console.error(err);
    }
  };

  if (teamLoading || teamProjectsLoading || teamCardsLoading || authLoading) return <LoadingComponent />;
  if (!team || authError) return <ErrorComponent />;
  if (!user) {
    navigate('/login');
    return null;
  }

  const baseList = !isEditMode ? (team.persons || []) : editData.members;
  const sortedMembers = [...baseList].sort((a, b) => {
    if (a.personId === user.id) return -1;
    if (b.personId === user.id) return 1;
    return 0;
  });

  return (
    <div className="team-detail-page">
      <Header />
      <div className="team-detail-content">
        {!isEditMode ? (
          <div className="team-view-container">
            <NavLink to='/teams' className='link back-to team-link'><span>←</span> Назад</NavLink>
            <div className='team-info-container'>
              <div className='team-main'><TeamMembersList team={team} /></div>
              {team.adminId === user.id &&
                <div className="team-info-buttons-conatainer">
                  <button onClick={() => setIsEditMode(true)} className="button edit-button edit-team-button">Редактировать</button>
                  <button onClick={handleDelete} className="button cancel-delete-button delete-team-button">Удалить</button>
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
                        <img src={proj.imageName ? `http://localhost:8080/uploads/${proj.imageName}` : defaultPreview}
                          className='team-project-image' alt="Фото проекта/карточки" />
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
              {team.adminId === user.id && <button onClick={handleCreateProject} className='button add-submit-button add-team-project-button'>Создать проект</button>}
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
              {team.adminId === user.id && <button onClick={handleCreateCard} className='button add-submit-button add-team-card-button'>Создать карточку</button>}
            </div>
          </div>
        ) : (
          <div className="team-edit-container">
            <div className='team-main'>
              <input
                type="text"
                value={editData.title}
                maxLength={30}
                className='text-input team-name-input'
                onChange={changeTitle}
              />
              <div className="add-person-container">
                <input
                  type="text"
                  value={searchTerm}
                  className='text-input add-person-input'
                  onChange={onSearchChange}
                  disabled={editData.members.length + editData.invited.length >= 6}
                  placeholder={editData.members.length + editData.invited.length >= 6 ? 'Достигнут максимум участников' : 'Введите email или имя пользователя'}
                />
                {searchResults.length > 0 && (
                  <ul className="search-person-results-list" ref={searchRef}>
                    {searchResults.map(p => {
                      const already = editData.members.some(m => m.id === p.id || m.personId === p.id) || editData.invited.some(i => i.id === p.id);
                      return (
                        <li key={p.id} onClick={() => !already && addMember(p)} className={already ? 'already-added' : ''}>
                          {p.username} — {p.email}
                          {already && <span className="tag">{editData.members.some(m => m.id === p.id || m.personId === p.id) ? 'Уже добавлен' : 'Уже приглашён'}</span>}
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
                        src={member.imageName ? `http://localhost:8080/uploads/${member.imageName}` : userIcon}
                        alt=""
                        className="team-member-photo"
                      />
                      <div className='team-member-name-container'>
                        <h2 className='team-member-username'>{member.username}</h2>
                        {member.personId === team.adminId && <img src={adminIcon} alt='Иконка админа' className='admin-icon' />}
                      </div>
                    </div>
                    <div className="member-edit-role-container">
                      <input
                        type="text"
                        value={editData.roles[member.personId || member.id] || ''}
                        className={`text-input member-edit-role-input ${member.personId === team.adminId ? 'my-role' : ''}`}
                        onChange={e => changeRole(member.personId || member.id, e.target.value)}
                        maxLength={20}
                        placeholder="Введите роль участника"
                      />
                      {member.personId !== user.id && (
                        <button onClick={() => removeMember(member.personId || member.id)} className="remove-button">×</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {editData.invited.length > 0 &&
                <div className="invited-persons-section">
                  <h1 className='team-invited-title'>Приглашенные пользователи</h1>
                  <ul className="team-invited-list">
                    {editData.invited.map(inv => (
                      <li key={inv.id} className="team-invited-item">
                        <img src={inv.imageName ? `http://localhost:8080/uploads/${inv.imageName}` : userIcon} className="team-member-photo" alt="" />
                        <h2 className='team-member-username'>{inv.username}</h2>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </div>
            <div className="team-info-buttons-conatainer">
              <button onClick={handleSave} className="button add-submit-button save-team-button" disabled={!editData.title.trim()}>Сохранить</button>
              <button onClick={cancelEdit} className="button cancel-delete-button cancel-edit-team-button">Отмена</button>
            </div>
          </div>
        )}
      </div>
      {showToast && (
        <div className="toast-toast">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
