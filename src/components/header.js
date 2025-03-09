import React from 'react';
import { NavLink } from 'react-router-dom';
import UserIcon from '../img/user-icon.png';
import '../css/header.css';


export default class Header extends React.Component {
  state = {
    isDropdownOpen: false,
  };

  toggleDropdown = () => {
    this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  };

  closeDropdown = () => {
    this.setState({ isDropdownOpen: false });
  };

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
    <div className="header-user-dropdown">
      <div onClick={this.toggleDropdown} className="header-user-icon">
        <img src={UserIcon} alt="Аватарка пользователя" />
      </div>
      {this.state.isDropdownOpen && (
        <div className="dropdown-menu">
          <NavLink
            to="/login"
            onClick={this.closeDropdown}
            className="dropdown-item"
          >
            Войти
          </NavLink>
          <NavLink
            to="/register"
            onClick={this.closeDropdown}
            className="dropdown-item"
          >
            Зарегистрироваться
          </NavLink>
        </div>
      )}
    </div>
  </nav>
  );
}
