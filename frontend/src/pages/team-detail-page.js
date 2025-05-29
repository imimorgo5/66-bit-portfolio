import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation, NavLink, Link } from 'react-router-dom';
import Header from '../components/header-component.js';
import ErrorComponent from '../components/error-component.js';
import LoadingComponent from '../components/loading-component.js';
import TeamMembersList from '../components/team-members-list-component.js';
import AddButton from '../components/add-button-component.js';
import ActionButtons from '../components/action-buttons-component.js';
import { AuthContext } from '../context/AuthContext.js';
import { getTeamById, updateTeamById, deleteTeamById, getInvitedPersons } from '../services/team-service.js';
import { createTeamCard, getTeamCards } from '../services/card-service.js';
import { createTeamProject, getTeamProjects } from '../services/project-service.js';
import { getAllPeople } from '../services/person-service.js';
import { getFullName } from '../utils/file.js';
import { useSuggestions } from '../hooks/use-suggestions.js';
import userIcon from '../img/user-icon.svg';
import adminIcon from '../img/admin-icon.svg';
import defaultPreview from '../img/defaultPreview.png';
import '../css/team-detail.css';

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
  const [editData, setEditData] = useState({ title: '', members: [], roles: {}, invited: [] });
  const [projects, setProjects] = useState([]);
  const [cards, setCards] = useState([]);
  const [newInvitesSent, setNewInvitesSent] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [allPeople, setAllPeople] = useState([]);
  const [allPeopleLoading, setAllPeopleLoading] = useState(true);

  useEffect(() => {
    getTeamById(id).then(setTeam).catch(console.error).finally(() => setTeamLoading(false));
    getTeamProjects(id).then(setProjects).catch(console.error).finally(() => setTeamProjectsLoading(false));
    getTeamCards(id).then(setCards).catch(console.error).finally(() => setTeamCardsLoading(false));
    getAllPeople().then(setAllPeople).catch(console.error).finally(() => setAllPeopleLoading(false));
  }, [id]);

  const { term: searchTerm, setTerm: setSearchTerm, items: suggestions, containerRef: searchRef } = useSuggestions({
    allItems: allPeople,
    filterFn: useCallback((p, term) => {
      if (!user) {
        return false;
      }
      return (p.email.includes(term) || p.username.toLowerCase().includes(term.toLowerCase())) && p.id !== user.id;
    }, [user]),
    maxItems: 10,
  });

  useEffect(() => {
    if (isEditMode && team) {
      getInvitedPersons(id)
        .then(invited => {
          setEditData({
            title: team.title || '',
            members: team.persons || [],
            roles: team.persons.reduce((acc, p) => ({ ...acc, [p.id]: p.role || '' }), {}),
            invited
          });
        })
        .catch(console.error);
    }
  }, [isEditMode, team, id]);

  useEffect(() => {
    if (!isEditMode && newInvitesSent) {
      setNewInvitesSent(false);
    }
  }, [isEditMode, newInvitesSent]);

  const loadTeam = () => getTeamById(id).then(setTeam).catch(console.error).finally(() => setTeamLoading(false));

  const handleDelete = () => deleteTeamById(id).then(() => navigate('/teams')).catch(console.error);

  const handleEditClick = () => setIsEditMode(true);

  const cancelEdit = () => {
    setIsEditMode(false);
    setSearchTerm('');
  };

  const changeTitle = e => setEditData(d => ({ ...d, title: e.target.value }));

  const addMember = person => {
    if (editData.members.find(m => m.id === person.id) || editData.members.length >= 6) return;
    setEditData(d => ({ ...d, members: [...d.members, person], roles: { ...d.roles, [person.id]: '' } }));
    setSearchTerm('');
  };

  const removeMember = id =>
    setEditData(d => ({
      ...d, members: d.members.filter(m => m.id !== id),
      roles: Object.fromEntries(Object.entries(d.roles).filter(([k]) => k !== String(id)))
    }));

  const changeRole = (id, role) => setEditData(d => ({ ...d, roles: { ...d.roles, [id]: role } }));

  const handleSave = () => {
    const existingIds = team.persons.map(p => p.id);
    const added = editData.members.filter(m => !existingIds.includes(m.id));
    const payload = {
      title: editData.title,
      myRole: editData.roles[user.id] || '',
      persons: editData.members.map(m => ({ email: m.email, role: editData.roles[m.id] || '' }))
    };
    updateTeamById(id, payload).then(() => {
      if (added.length > 0) {
        setToastMessage(`Приглашение в команду отправлены для ${added.length} человек(а)`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      setSearchTerm('');
      loadTeam();
    })
      .then(() => setIsEditMode(false))
      .catch(console.error);
  };

  const handleCreateProject = () =>
    createTeamProject({ teamId: id, title: 'Новый проект' })
      .then(newProj => navigate(`/projects/${newProj.id}?from=/teams/${id}`, { state: { isEdit: true } }))
      .catch(console.error);

  const handleCreateCard = () =>
    createTeamCard({ teamId: id, title: 'Новая карточка' })
      .then(newCard => navigate(`/cards/${newCard.id}?from=/teams/${id}`, { state: { isEdit: true } }))
      .catch(console.error);

  if (teamLoading || teamProjectsLoading || teamCardsLoading || (isEditMode && allPeopleLoading) || authLoading) return <LoadingComponent />;
  if (!team || !projects || !cards || (isEditMode && !allPeople) || authError) return <ErrorComponent />;
  if (!user) {
    navigate('/login');
    return null;
  }

  const baseList = !isEditMode ? team.persons : editData.members;
  const sortedMembers = [...baseList].sort((a, b) => {
    if (a.id === user.id) return -1;
    if (b.id === user.id) return 1;
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
                <ActionButtons onEdit={handleEditClick} onDelete={handleDelete} editTitle='Редактировать' className='team'/>
              }
            </div>
            <div className='team-projects-container'>
              <h1 className='team-title'>Проекты</h1>
              {projects.length > 0 ?
                <ul className='team-projects-list'>
                  {projects.map(proj => (
                    <Link to={`/projects/${proj.id}?from=${encodeURIComponent(`/teams/${team.id}`)}`} className='team-project-link'>
                      <li key={proj.id} className='team-projects-item'>
                        <img src={proj.imageName ? getFullName(proj.imageName) : defaultPreview}
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
              {team.adminId === user.id && <AddButton title='Создать проект' onClick={handleCreateProject} className='team-items' />}
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
              {team.adminId === user.id && <AddButton title='Создать карточку' onClick={handleCreateCard} className='team-items' />}
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
              <div className="add-person-container" ref={searchRef}>
                <input
                  type="text"
                  value={searchTerm}
                  className='text-input add-person-input'
                  onChange={e => setSearchTerm(e.target.value)}
                  disabled={editData.members.length + editData.invited.length >= 6}
                  placeholder={editData.members.length + editData.invited.length >= 6 ? 'Достигнут максимум участников' : 'Введите email или имя пользователя'}
                />
                {suggestions.length > 0 && (
                  <ul className="search-person-results-list">
                    {suggestions.map(p => {
                      const already = editData.members.some(m => m.id === p.id) || editData.invited.some(i => i.id === p.id);
                      return (
                        <li key={p.id} onClick={() => !already && addMember(p)} className={already ? 'already-added' : ''}>
                          {p.username} — {p.email}
                          {already && <span className="tag">{editData.members.some(m => m.id === p.id) ? 'Уже добавлен' : 'Уже приглашён'}</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              <ul className="team-edit-members-list">
                {sortedMembers.map(member => (
                  <li key={member.id} className="edit-member-item">
                    <div className="edit-member-info">
                      <img
                        src={member.imageName ? getFullName(member.imageName) : userIcon}
                        alt=""
                        className="team-member-photo"
                      />
                      <div className='team-member-name-container'>
                        <h2 className='team-member-username'>{member.username}</h2>
                        {member.id === team.adminId && <img src={adminIcon} alt='Иконка админа' className='admin-icon' />}
                      </div>
                    </div>
                    <div className="member-edit-role-container">
                      <input
                        type="text"
                        value={editData.roles[member.id] || ''}
                        className={`text-input member-edit-role-input ${member.id === team.adminId ? 'my-role' : ''}`}
                        onChange={e => changeRole(member.id, e.target.value)}
                        maxLength={20}
                        placeholder="Введите роль участника"
                      />
                      {member.id !== user.id && (
                        <button onClick={() => removeMember(member.id)} className="remove-button">×</button>
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
                        <img src={inv.imageName ? getFullName(inv.imageName) : userIcon} className="team-member-photo" alt="" />
                        <h2 className='team-member-username'>{inv.username}</h2>
                      </li>
                    ))}
                  </ul>
                </div>
              }
            </div>
            <ActionButtons isEdit={true} onSave={handleSave} onCancel={cancelEdit} isDisabled={!editData.title.trim()} className='team'/>
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
