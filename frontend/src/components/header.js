import React from 'react';
import { NavLink } from 'react-router-dom';
import userIcon from '../img/user-icon.png';
import '../css/header.css';
import { AuthContext } from '../context/AuthContext.js';
import { logout } from '../services/authService';

export default class Header extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
    };
    this.dropdownRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }
  
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }
  
  handleClickOutside = (event) => {
    if (
      this.state.isDropdownOpen &&
      this.dropdownRef.current &&
      !this.dropdownRef.current.contains(event.target)
    ) {
      this.setState({ isDropdownOpen: false });
    }
  };

  toggleDropdown = () => {
    this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  };

  closeDropdown = () => {
    this.setState({ isDropdownOpen: false });
  };

  handleLogout = () => {
    logout()
      .then(() => {
        this.context.setUser(null);
        window.location.href = '/';
      })
      .catch(error => {
        console.error('Ошибка выхода:', error);
      })
      .finally(() => {
        this.closeDropdown();
      });
  };

  render() {
    const { user } = this.context;

    return (
      <nav className="header">
        <div className='nav-list-container'>
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
            {user && (
              <li>
                <NavLink
                  to="/notification"
                  className={({ isActive }) => "header-link" + (isActive ? " active" : "")}
                >
                  Уведомления
                </NavLink>
              </li>
            )}
          </ul>
        </div>
        <div className="header-user-dropdown" ref={this.dropdownRef}>
          <div onClick={this.toggleDropdown} className="header-user-icon">
            <img src={userIcon} alt="Аватарка пользователя" />
          </div>
          {this.state.isDropdownOpen && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <NavLink
                    to="/user"
                    onClick={this.closeDropdown}
                    className="dropdown-item authorized"
                  >
                    Личный кабинет
                  </NavLink>
                  <div
                    onClick={this.handleLogout}
                    className="dropdown-item authorized"
                    style={{ cursor: 'pointer' }}
                  >
                    Выйти
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    );
  }
}
