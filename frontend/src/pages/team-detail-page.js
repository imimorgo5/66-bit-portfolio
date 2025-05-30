import React, { useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useLocation, NavLink } from 'react-router-dom';
import Header from '../components/header-component.js';
import ErrorComponent from '../components/error-component.js';
import LoadingComponent from '../components/loading-component.js';
import TeamMembersList from '../components/team-members-list-component.js';
import ActionButtons from '../components/action-buttons-component.js';
import TeamItemsSection from '../components/team-items-section-component.js';
import Suggestions from '../components/suggestions-component.js';
import { AuthContext } from '../context/AuthContext.js';
import { getTeamById, updateTeamById, deleteTeamById, getInvitedPersons } from '../services/team-service.js';
import { createTeamCard, getTeamCards } from '../services/card-service.js';
import { createTeamProject, getTeamProjects } from '../services/project-service.js';
import { getAllPeople } from '../services/person-service.js';
import { useSuggestions } from '../hooks/use-suggestions.js';
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

  return (
    <div className="team-detail-page">
      <Header />
      <div className="team-detail-content">
        {!isEditMode ? (
          <div className="team-view-container">
            <NavLink to='/teams' className='link back-to team-link'><span>←</span> Назад</NavLink>
            <div className='team-info-container'>
              <div className='team-main'><TeamMembersList team={team} className='detail' /></div>
              {team.adminId === user.id &&
                <ActionButtons onEdit={handleEditClick} onDelete={handleDelete} editTitle='Редактировать' className='team' />
              }
            </div>
            <TeamItemsSection
              title='Проекты'
              items={projects}
              getLink={(proj) => `/projects/${proj.id}?from=/teams/${team.id}`}
              isItemsWithPhoto={true}
              emptyTitle={'Ещё не создан ни один проект'}
              adminId={team.adminId}
              buttonTitle={'Создать проект'}
              handleCreateItem={handleCreateProject}
              className='project'
            />
            <TeamItemsSection
              title='Карточки'
              items={cards}
              getLink={(card) => `/cards/${card.id}?from=/teams/${team.id}`}
              emptyTitle={'Ещё не создана ни одна карточка'}
              adminId={team.adminId}
              buttonTitle={'Создать карточку'}
              handleCreateItem={handleCreateCard}
              className='card'
            />
          </div>
        ) : (
          <div className="team-edit-container">
            <div className='team-main'>
              <input type="text" value={editData.title} maxLength={30} onChange={changeTitle} className='text-input team-name-input' />
              <Suggestions 
                searchRef={searchRef}
                searchTerm={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                isDisabled={editData.members.length + editData.invited.length >= 6}
                placeholder={editData.members.length + editData.invited.length >= 6 ? 'Достигнут максимум участников' : 'Введите email или имя пользователя'}
                suggestions={suggestions}
                getAlready={p => editData.members.some(m => m.id === p.id) || editData.invited.some(i => i.id === p.id)}
                addItem={p => addMember(p)}
                getSuggestionTitle={p => `${p.username} — ${p.email}`}
                getAlreadyTitle={p => editData.members.some(m => m.id === p.id) ? 'Уже добавлен' : 'Уже приглашён'}
                className='team'
              />
              <TeamMembersList 
                editable={true} 
                team={team} 
                editData={editData} 
                onRoleChange={(e, m) => changeRole(m.id, e.target.value)}
                onRemoveClick={m => removeMember(m.id)}
              />
            </div>
            <ActionButtons isEdit={true} onSave={handleSave} onCancel={cancelEdit} isDisabled={!editData.title.trim()} className='team' />
          </div>
        )}
      </div>
      {showToast && <div className="toast-toast">{toastMessage}</div>}
    </div>
  );
}
