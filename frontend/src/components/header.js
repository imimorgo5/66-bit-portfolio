import React from 'react';
import { NavLink } from 'react-router-dom';
import NotificationComponent from './notificationComponent.js';
import userIcon from '../img/user-icon.svg';
import '../css/header.css';
import { AuthContext } from '../context/AuthContext.js';
import { logout } from '../services/authService';
import logo from '../img/logo.svg';
import notificationsIcon from '../img/notifications-icon.svg';

export default class Header extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isNotificationsOpen: false
    };
    this.dropdownRef = React.createRef();
    this.notificationsRef = React.createRef();
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
      this.closeDropdown();
    }
    if (
      this.state.isNotificationsOpen &&
      this.notificationsRef.current &&
      !this.notificationsRef.current.contains(event.target)
    ) {
      this.closeNotifications();
    }
  };

  toggleDropdown = () => {
    this.closeNotifications();
    this.setState(prevState => ({ isDropdownOpen: !prevState.isDropdownOpen }));
  };

  toggleNotifications = () => {
    this.closeDropdown();
    this.setState(prevState => ({ isNotificationsOpen: !prevState.isNotificationsOpen }));
  };

  closeDropdown = () => {
    this.setState({ isDropdownOpen: false });
  };

  closeNotifications = () => {
    this.setState({ isNotificationsOpen: false });
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
    const userPhoto = userIcon;

    return (
      <nav className="header">
        <div className="logo-container">
          <NavLink to="/"><img src={logo} className="main-logo" alt="Лого сайта" /></NavLink>
        </div>
        <div className="nav-list-container">
          <ul className="nav-list">
            <li>
              <NavLink
                to="/"
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
        </div>
        <div className='user-controllers'>
          {user && (
            <div className="header-user-notifications" ref={this.notificationsRef}>
                <div onClick={this.toggleNotifications} className="header-notifications-icon">
                  <img src={notificationsIcon} alt="Иконка уведомлений" />
                </div>
                {this.state.isNotificationsOpen && (
                  <NotificationComponent notifications={user.notifications} />
                )}
            </div>
          )}
          <div className="header-user-dropdown" ref={this.dropdownRef}>
            <div onClick={this.toggleDropdown} className="header-user-icon">
              <img src={userPhoto} alt="Аватарка пользователя" />
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
        </div>
      </nav>
    );
  }
}
