import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddButton({ title, onClick }) {
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
        <button className="button add-submit-button create-button" onClick={onButtonClick}>{title}</button>
    </div>
);
}
