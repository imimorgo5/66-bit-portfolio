import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.js';
import ItemPreview from '../components/item-preview.js';
import { AuthContext } from '../context/AuthContext.js';
import SortComponent from '../components/sortComponent.js';
import SelfTeamSwitch from '../components/selfTeamSwitchComponent.js';
import AddCardForm from '../components/addCardForm.js';
import '../css/preview-pages.css';
import '../css/cards-page.css';
import { CardsPreviews } from '../mock/card-preview.js';
import EmptyArrow from '../img/empty-arrow.svg';


export default function CardsPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [teamMode, setTeamMode] = useState(false);
    const [cards, setCards] = useState([]);
    const [sortMode, setSortMode] = useState('date');

    useEffect(() => {
      // В будущем здесь будет fetch-запрос для получения проектов
      // fetch('/api/cards').then(res => res.json()).then(setCards)
      setCards(CardsPreviews);
    }, []);

  
    const handleAddCard = () => {
      if (!user) {
        navigate('/register');
      } else {
        setIsFormOpen(true);
      }
    };

    const handleCreateCard = (cardData) => {
        // Здесь можно добавить логику сохранения карточки
        console.log('Создана карточка:', cardData);
        setCards(prev => [...prev, { id: Date.now(), ...cardData, createdAt: new Date().toISOString() }]);
    };

    const handleTeamSwitchChange = (option) => {
        setTeamMode(option === 'team');
    };

    const handleSortChange = (mode) => {
      setSortMode(mode);
    };

    const sortedCards = [...cards].sort((a, b) => {
      if (sortMode === 'name') {
        return a.title.localeCompare(b.title);
      } else {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return (<div className='page'>
                <Header />
                <div className='content cards-page'>
                    {isFormOpen && (
                        <AddCardForm
                        onClose={() => setIsFormOpen(false)}
                        onCreate={handleCreateCard}
                        />
                    )}
                    {sortedCards.length > 0 ? (
                      <div>
                        <div className='cards-actions'>
                            <SelfTeamSwitch onOptionChange={handleTeamSwitchChange} />
                            <SortComponent onSortChange={handleSortChange} />
                        </div>
                        <ul className="preview-list">
                          {sortedCards.map(card => (
                            <li key={card.id}>
                              <ItemPreview 
                                title={card.title}
                                image={card.image}
                                createdAt={card.createdAt}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="empty-previews">
                        <p className='empty-title'>У Вас пока нет карточек - <span>добавьте первую!</span></p>
                        <div className="arrow-to-add">
                            <img 
                            src={EmptyArrow} 
                            className='empty-arrow' 
                            alt="Стрелка к кнопке"
                            />
                        </div>
                      </div>
                    )}
                    <button type="button" className={`add-item ${teamMode && sortedCards.length > 0 ? 'disabled' : ''}`} onClick={handleAddCard}>Создать карточку</button>
                </div>
            </div>
    );
}
