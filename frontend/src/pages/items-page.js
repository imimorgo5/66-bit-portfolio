import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/header-component.js';
import ItemPreview from '../components/item-preview-component.js';
import { AuthContext } from '../context/AuthContext';
import SortComponent from '../components/sort-component';
import FilterComponent from '../components/filter-component';
import LoadingComponent from '../components/loading-component.js';
import EmptyItemsComponent from '../components/empty-items-component.js';
import AddButton from '../components/add-button-component.js';
import LoadMoreButton from '../components/load-more-button-component.js';
import { getPersonCards, getPersonTeamsCard, createPersonCard } from '../services/card-service';
import { createPersonProject, getPersonProjects } from '../services/project-service';
import { isNewCard, isNewProject } from '../utils/utils.js';
import { getFullName } from '../utils/file.js';
import { redirectIfSessionExpired } from '../utils/redirect.js';
import { ItemType } from '../consts.js';
import '../css/items-page.css';

export default function ItemsPage({ itemType }) {
    const { user, setUser, isLoading: authLoading } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [sortMode, setSortMode] = useState('date');
    const [isTeamMode, setIsTeamMode] = useState(new URLSearchParams(location.search).get('mode') === 'team');
    const [visibleCount, setVisibleCount] = useState(8);
    const isProjectsPage = itemType === ItemType.PROJECT;

    useEffect(() => {
        if (user) {
            redirectIfSessionExpired(user, setUser, navigate);
        }
    }, [user, setUser, navigate]);

    useEffect(() => {
        setVisibleCount(8);
        isProjectsPage && setIsTeamMode(false);
        if (!authLoading) {
            user ?
                (isProjectsPage ? getPersonProjects() : isTeamMode ? getPersonTeamsCard(user.id) : getPersonCards())
                    .then(setItems)
                    .catch(console.error)
                    .finally(() => setLoading(false))
                : setLoading(false);
        }
    }, [isTeamMode, user, authLoading, isProjectsPage, navigate]);

    const goToProjectDetail = (project, isEdit = false) => navigate(`/projects/${project.id}?from=/`, { state: { isEdit: isEdit } });

    const goToCardDetail = (card, isEdit = false) => navigate(`/cards/${card.id}?from=${isTeamMode ? '/cards?mode=team' : '/cards'}`, { state: { isEdit: isEdit } });

    const handleAddItem = () => {
        redirectIfSessionExpired(user, setUser, navigate);
        if (isProjectsPage) {
            createPersonProject({ title: 'Новый проект' }).then(newProj => goToProjectDetail(newProj, true)).catch(console.error);
        } else {
            createPersonCard({ title: 'Новая карточка' }).then(newCard => goToCardDetail(newCard, true)).catch(console.error);
        }
    };

    const handleSortChange = mode => setSortMode(mode);

    const handleTeamSwitchChange = option => {
        const isTeam = option === 'team';
        setIsTeamMode(isTeam);
        navigate(`/cards${isTeam ? '?mode=team' : ''}`);
    };

    const handleLoadMoreButtonClick = () => setVisibleCount(vc => Math.min(vc + 4, sortedItems.length));

    const sortedItems = [...items].sort((a, b) => {
        if (sortMode === 'name') {
            return a.title.localeCompare(b.title);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const visibleItems = sortedItems.slice(0, visibleCount);

    if (loading || authLoading) return <LoadingComponent />;

    return (
        <div className="page">
            <Header />
            <div className='items-page'>
                <div className={'items-actions' + (!isProjectsPage && sortedItems.length === 0 ? ' empty-cards-list' : '')}>
                    {visibleItems.length > 0 && <SortComponent onSortChange={handleSortChange} />}
                    {!isProjectsPage && <FilterComponent onOptionChange={handleTeamSwitchChange} isTeamMode={isTeamMode} />}
                </div>
                {visibleItems.length > 0 ? (
                    <div className='main-item-content'>
                        <ul className="preview-list">
                            {visibleItems.map(item => (
                                <li
                                    key={item.id}
                                    onClick={() => isProjectsPage ? goToProjectDetail(item) : goToCardDetail(item)}
                                    className={(isProjectsPage ? isNewProject(item) : isNewCard(item)) ? 'new-item' : ''}
                                >
                                    {isProjectsPage
                                        ? <ItemPreview title={item.title} image={item.imageName ? getFullName(item.imageName) : ''} itemType={ItemType.PROJECT} />
                                        : <ItemPreview title={item.title} itemType={ItemType.CARD} />
                                    }
                                </li>
                            ))}
                        </ul>
                        {visibleCount < sortedItems.length && <LoadMoreButton onClick={handleLoadMoreButtonClick} />}
                    </div>
                ) : (
                    !isProjectsPage && isTeamMode ?
                        <EmptyItemsComponent title={'У Вас пока нет командных карточек'} className={'empty-team-cards-list'} /> :
                        <EmptyItemsComponent
                            title={<>У Вас пока нет {isProjectsPage ? 'проектов' : 'карточек'} — <span>добавьте {isProjectsPage ? 'первый' : 'первую'}!</span></>}
                            className={!isProjectsPage ? 'empty-cards-list' : ''}
                        />
                )}
                {(isProjectsPage || (!isProjectsPage && !isTeamMode)) &&
                    <AddButton title={isProjectsPage ? 'Добавить проект' : 'Добавить карточку'} onClick={handleAddItem} />
                }
            </div>
        </div>
    );
}
