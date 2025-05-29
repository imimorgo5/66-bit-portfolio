import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../css/add-button-component.css';

export default function AddButton({ title, onClick, className = '' }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onButtonClick = () => {
    if (!user) {
      return navigate('/login');
    }
    onClick();
  }

  return (
    <div className='create-button-container'>
        <button className={`button add-submit-button create-button ${className}`} onClick={onButtonClick}>{title}</button>
    </div>
);
}
