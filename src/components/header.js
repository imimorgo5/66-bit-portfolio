import React from 'react';
import { Link } from 'react-router-dom';
import UserIcon from '../img/user-icon.png';
import '../css/header.css';


export default class Header extends React.Component {
  render = () => (
  <nav className='header'>
    <ul className='nav-list'>
      <li className='active'><Link to="/" className='header-link'>Проекты</Link></li>
      <li><Link to="/teams" className='header-link'>Команды</Link></li>
      <li><Link to="/cards" className='header-link'>Карточки</Link></li>
      <li><Link to="/achievements" className='header-link'>Достижения</Link></li>
    </ul>
    <Link to="/user" className='header-user-icon'><img src={UserIcon} alt='Аватарка пользователя'></img></Link>
  </nav>
  );
}
