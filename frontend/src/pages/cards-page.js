import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header.js';
import ItemPreview from '../components/item-preview.js';
import { AuthContext } from '../context/AuthContext.js';
import SortComponent from '../components/sortComponent.js';
import SelfTeamSwitch from '../components/selfTeamSwitchComponent.js';
import AddCardForm from '../components/addCardForm.js';
import '../css/preview-pages.css';
import '../css/cards-page.css';


export default function CardsPage() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [teamMode, setTeamMode] = useState(false);
  
    const handleAddCard = () => {
      if (!user) {
        navigate('/register');
      } else {
        setIsFormOpen(true);
      }
    };

    const handleCreateCard = (cardData) => {
        // Здесь можно добавить логику сохранения карточки
        console.log('Создан проект:', cardData);
    };

    const handleTeamSwitchChange = (option) => {
        setTeamMode(option === 'team');
    };

    return (<div className='page'>
                <Header />
                <div className='content cards-page'>
                    {isFormOpen && (
                        <AddCardForm
                        onClose={() => setIsFormOpen(false)}
                        onCreate={handleCreateCard}
                        />
                    )}
                    <div className='cards-actions'>
                        <SelfTeamSwitch onOptionChange={handleTeamSwitchChange} />
                        <SortComponent />
                    </div>
                    <ul className='preview-list'>
                        <li><ItemPreview title="Карточка 1" /></li>
                        <li><ItemPreview title="Карточка 2" /></li>
                        <li><ItemPreview title="Карточка 3" /></li>
                        <li><ItemPreview title="Карточка 4" /></li>
                        <li><ItemPreview title="Карточка 5" /></li>
                        <li><ItemPreview title="Карточка 6" /></li>
                    </ul>
                    <button type="button" className={`add-item ${teamMode ? 'disabled' : ''}`} onClick={handleAddCard}>Создать карточку</button>
                </div>
            </div>
    );
}
