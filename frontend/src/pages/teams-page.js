import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header-component.js';
import '../css/teams-page.css';
import { AuthContext } from '../context/AuthContext';
import { getAllPersonTeams, createTeam } from '../services/team-service';
import LoadingComponent from '../components/loading-component.js';
import EmptyItemsComponent from '../components/empty-items-component.js';
import AddButton from '../components/add-button-component.js';
import TeamMembersList from '../components/team-members-list-component.js';
import LoadMoreButton from '../components/load-more-button-component.js';
import { isNewTeam } from '../utils/utils.js';

export default function TeamsPage() {
  const { isLoading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    setVisibleCount(3);
    getAllPersonTeams().then(setTeams).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleAddTeam = () =>
    createTeam({ title: 'Новая команда', persons: [] })
      .then(newTeam => navigate(`/teams/${newTeam.id}`, { state: { isEdit: true } }))
      .catch(console.error);

  const handleLoadMoreButtonClick = () => setVisibleCount(vc => Math.min(vc + 3, sortedTeams.length));

  if (loading || authLoading) return <LoadingComponent />;

  const sortedTeams = teams.slice().sort((a, b) => {
    if (isNewTeam(a)) return -1;
    if (isNewTeam(b)) return 1;
    return 0;
  });

  const visibleTeams = sortedTeams.slice(0, visibleCount);

  return (
    <div className="teams-page-wrapper">
      <Header />
      <div className={`teams-page-content${teams.length === 0 ? ' empty-list' : ''}`}>
        {teams.length > 0 ? (
          <div className="teams-items-container">
            <ul className="teams-list">
              {visibleTeams.map(team => {
                return (
                  <li
                    key={team.id}
                    className={`teams-list-item${isNewTeam(team) ? ' new-team' : ''}`}
                    onClick={() => navigate(`/teams/${team.id}`)}
                  >
                    <TeamMembersList team={team} />
                  </li>
                );
              })}
            </ul>
            {visibleCount < sortedTeams.length && <LoadMoreButton onClick={handleLoadMoreButtonClick}/>}
          </div>
        ) : <EmptyItemsComponent title={<>У Вас пока нет команд – <span>Создайте первую!</span></>} className={'empty-teams-list'} />}
      </div>
      <AddButton title="Создать команду" onClick={handleAddTeam} />
    </div>
  );
}
