import React from 'react';
import { NavLink } from 'react-router-dom';
import UserIcon from '../img/user-icon.png';
import '../css/header.css';


export default class Header extends React.Component {
  render = () => (
    <nav className="header">
    <ul className="nav-list">
      <li>
        <NavLink
          to="/"
          end
          className={({ isActive }) => "header-link" + (isActive ? " active" : "")}
        >
          Проекты
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/teams"
          className={({ isActive }) => "header-link" + (isActive ? " active" : "")}
        >
          Команды
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/cards"
          className={({ isActive }) => "header-link" + (isActive ? " active" : "")}
        >
          Карточки
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/achievements"
          className={({ isActive }) => "header-link" + (isActive ? " active" : "")}
        >
          Достижения
        </NavLink>
      </li>
    </ul>
    <NavLink to="/user" className="header-user-icon">
      <img src={UserIcon} alt="Аватарка пользователя" />
    </NavLink>
  </nav>
  );
}
