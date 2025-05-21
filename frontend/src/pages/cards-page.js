import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom';
import Header from '../components/header';
import CardPreview from '../components/card-preview';
import { AuthContext } from '../context/AuthContext';
import SortComponent from '../components/sortComponent';
import SelfTeamSwitch from '../components/selfTeamSwitchComponent';
import '../css/preview-pages.css';
import '../css/cards-page.css';
import EmptyArrow from '../img/empty-arrow.svg';
import EmptyPicture from '../img/empty-items-picture.png';
import { getPersonCards, getPersonTeamsCard, createPersonCard } from '../services/card-service';

export default function CardsPage() {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [sortMode, setSortMode] = useState('date');
  const [isTeamMode, setIsTeamMode] = useState(new URLSearchParams(location.search).get('mode') === 'team');

  useEffect(() => {
    setLoading(true);
    if (isTeamMode && !authLoading) {
      getPersonTeamsCard(user.id)
        .then(fetched => setCards(fetched))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      getPersonCards()
        .then(fetched => setCards(fetched))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isTeamMode, user, authLoading]);

  const handleAddCard = () => {
    if (!user) {
      navigate('/register');
      return;
    }
    createPersonCard({ title: 'Новая карточка' })
      .then(newCard => goToCardDetail(newCard))
      .catch(err => console.error(err));
  };

  const handleSortChange = mode => setSortMode(mode);
  
  const handleTeamSwitchChange = option => {
    const isTeam = option === 'team';
    setIsTeamMode(isTeam);
    navigate(`/cards?mode=${isTeam ? 'team' : 'self'}`, { replace: true });
  };

  const goToCardDetail = card => navigate(`/cards/${card.id}?from=${isTeamMode ? '/cards?mode=team' : '/cards'}`);

  const isNew = (card) => {
    return (
      (card.description === null || card.description === '') &&
      (card.cardFiles === null || (Array.isArray(card.cardFiles) && card.cardFiles.length === 0)) &&
      (card.cardLinks === null || (Array.isArray(card.cardLinks) && card.cardLinks.length === 0)) &&
      typeof card.title === 'string' && card.title === 'Новая карточка'
    );
  };

  const sortedCards = [...cards].sort((a, b) => {
    if (sortMode === 'name') return a.title.localeCompare(b.title);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (loading || authLoading) return <div className="loading-container">Загрузка...</div>;

  return (
    <div className="page">
      <Header />
      <div className="content cards-page">
        {sortedCards.length > 0 ? (
          <>
            <div className="cards-actions">
              <SortComponent onSortChange={handleSortChange} />
              <SelfTeamSwitch 
                onOptionChange={handleTeamSwitchChange}
                isTeamMode={isTeamMode}
              />
            </div>
            <ul className="preview-list">
              {sortedCards.map(card => (
                <li
                  key={card.id}
                  onClick={() => goToCardDetail(card)}
                  className={isNew(card) ? 'new-item' : ''}
                >
                  <CardPreview title={card.title}/>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="empty-previews">
            <img src={EmptyPicture} alt="Пусто" className="empty-items-picture" />
            <p className="empty-title">
              У Вас пока нет карточек - <span>добавьте первую!</span>
            </p>
            <div className="arrow-to-add">
              <img src={EmptyArrow} className="empty-arrow" alt="Стрелка" />
            </div>
          </div>
        )}
        {!isTeamMode && 
          <button
            type="button"
            className='add-item'
            onClick={handleAddCard}
          >
            Добавить карточку
          </button>
        }
      </div>
    </div>
  );
}
