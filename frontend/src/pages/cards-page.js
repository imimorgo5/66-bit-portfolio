import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import CardPreview from '../components/card-preview';
import { AuthContext } from '../context/AuthContext';
import SortComponent from '../components/sortComponent';
import SelfTeamSwitch from '../components/selfTeamSwitchComponent';
import '../css/preview-pages.css';
import '../css/cards-page.css';
import EmptyArrow from '../img/empty-arrow.svg';
import EmptyPicture from '../img/empty-items-picture.png';
import { getCards, createCard } from '../services/cardService';

export default function CardsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [sortMode, setSortMode] = useState('date');
  const [teamMode, setTeamMode] = useState(false);

  useEffect(() => {
    getCards()
      .then(fetched => setCards(fetched))
      .catch(err => console.error(err));
  }, []);

  const handleAddCard = () => {
    if (!user) {
      navigate('/register');
      return;
    }
    createCard({ title: 'Новая карточка' })
      .then(newCard => setCards(prev => [...prev, newCard]))
      .catch(err => console.error(err));
  };

  const handleSortChange = mode => setSortMode(mode);
  const handleTeamSwitchChange = option => setTeamMode(option === 'team');
  const goToCardDetail = card => navigate(`/cards/${card.id}`, { state: { card } });

  const isNew = card => {
    const keys = Object.keys(card);
    return keys.every(k => k === 'title' || card[k] == null || card[k] === '')
      && typeof card.title === 'string' && card.title !== '';
  };

  const sortedCards = [...cards].sort((a, b) => {
    if (sortMode === 'name') return a.title.localeCompare(b.title);
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="page">
      <Header />
      <div className="content cards-page">
        {sortedCards.length > 0 ? (
          <>
            <div className="cards-actions">
              <SortComponent onSortChange={handleSortChange} />
              <SelfTeamSwitch onOptionChange={handleTeamSwitchChange} />
            </div>
            <ul className="preview-list">
              {sortedCards.map(card => (
                <li
                  key={card.id}
                  onClick={() => goToCardDetail(card)}
                  className={isNew(card) ? 'new-item' : ''}
                >
                  <CardPreview title={card.title} />
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
        <button
          type="button"
          className={`add-item ${teamMode && sortedCards.length > 0 ? 'disabled' : ''}`}
          onClick={handleAddCard}
        >
          Добавить карточку
        </button>
      </div>
    </div>
  );
}
