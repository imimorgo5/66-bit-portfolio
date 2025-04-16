import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import CardPreview from '../components/card-preview';
import { AuthContext } from '../context/AuthContext';
import SortComponent from '../components/sortComponent';
import SelfTeamSwitch from '../components/selfTeamSwitchComponent';
import AddCardForm from '../components/addCardForm';
import '../css/preview-pages.css';
import '../css/cards-page.css';
import EmptyArrow from '../img/empty-arrow.svg';
import { getCards, createCard } from '../services/cardService';

export default function CardsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [teamMode, setTeamMode] = useState(false);
  const [cards, setCards] = useState([]);
  const [sortMode, setSortMode] = useState('date');

  useEffect(() => {
    getCards()
      .then((fetchedCards) => setCards(fetchedCards))
      .catch((error) => console.error(error));
  }, []);

  const handleAddCard = () => {
    if (!user) {
      navigate('/register');
    } else {
      setIsFormOpen(true);
    }
  };

  const handleCreateCard = (cardData) => {
    createCard(cardData)
      .then((newCard) => {
        setCards((prev) => [...prev, newCard]);
        setIsFormOpen(false);
      })
      .catch((error) => console.error(error));
  };

  const handleTeamSwitchChange = (option) => {
    setTeamMode(option === 'team');
  };

  const handleSortChange = (mode) => {
    setSortMode(mode);
  };

  const goToCardDetail = (card) => {
    navigate(`/cards/${card.id}`, { state: { card } });
  };  

  const sortedCards = [...cards].sort((a, b) => {
    if (sortMode === 'name') {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="page">
      <Header />
      <div className="content cards-page">
        {isFormOpen && (
          <AddCardForm
            onClose={() => setIsFormOpen(false)}
            onCreate={handleCreateCard}
          />
        )}
        {sortedCards.length > 0 ? (
          <div>
            <div className="cards-actions">
              <SortComponent onSortChange={handleSortChange} />
              <SelfTeamSwitch onOptionChange={handleTeamSwitchChange} />
            </div>
            <ul className="preview-list">
              {sortedCards.map((card) => (
                 <li key={card.id} onClick={() => goToCardDetail(card)}>
                    <CardPreview 
                      title={card.title}
                      description={card.description}
                    />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="empty-previews">
            <p className="empty-title">
              У Вас пока нет карточек - <span>добавьте первую!</span>
            </p>
            <div className="arrow-to-add">
              <img 
                src={EmptyArrow} 
                className="empty-arrow" 
                alt="Стрелка к кнопке"
              />
            </div>
          </div>
        )}
        <button
          type="button"
          className={`add-item ${teamMode && sortedCards.length > 0 ? 'disabled' : ''}`}
          onClick={handleAddCard}
        >
          Создать карточку
        </button>
      </div>
    </div>
  );
}
