import React, { useContext, useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import NotificationComponent from './notification-component.js';
import { AuthContext } from '../context/AuthContext.js';
import { logout } from '../services/auth-service.js';
import { getUnreadNotifications } from '../services/notification-service';
import userIcon from '../img/user-icon.svg';
import logo from '../img/logo.svg';
import notificationsIcon from '../img/notifications-icon.svg';
import '../css/header.css';

export default function Header() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  const loadUnreadCount = () => getUnreadNotifications().then(arr => setUnreadCount(arr.length)).catch(console.error);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    loadUnreadCount();
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setNotificationsOpen(false);
    setDropdownOpen(prev => !prev);
  };

  const toggleNotifications = () => {
    setDropdownOpen(false);
    setNotificationsOpen(open => {
      const willOpen = !open;
      if (!willOpen) {
        loadUnreadCount();
      }
      return willOpen;
    });
  };

  const handleLogout = () =>
    logout()
      .then(() => null)
      .catch(console.error)
      .finally(() => {
        setDropdownOpen(false);
        setUser(null);
        navigate('/login');
      });

  return (
    <nav className="header">
      <div className="logo-container">
        <NavLink to="/"><img src={logo} className="main-logo" alt="Лого сайта" /></NavLink>
      </div>
      <div className="nav-list-container">
        <ul className="nav-list">
          <li><NavLink to="/" className={({ isActive }) => "link header-link" + (isActive ? " active" : "")}>Проекты</NavLink></li>
          <li><NavLink to="/cards" className={({ isActive }) => "link header-link" + (isActive ? " active" : "")}>Карточки</NavLink></li>
          <li><NavLink to="/teams" className={({ isActive }) => "link header-link" + (isActive ? " active" : "")}>Команды</NavLink></li>
        </ul>
      </div>

      <div className="user-controllers">
        {user && (
          <div className="header-user-notifications" ref={notificationsRef}>
            <div onClick={toggleNotifications} className="header-notifications-icon">
              {unreadCount > 0 && (
                <span className="notifications-badge">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              <img src={notificationsIcon} alt="Иконка уведомлений" />
            </div>
            {isNotificationsOpen && (
              <NotificationComponent handleRead={loadUnreadCount} />
            )}
          </div>
        )}

        <div className="header-user-dropdown" ref={dropdownRef}>
          <div onClick={toggleDropdown} className="header-user-icon">
            <img src={userIcon} alt="Аватар пользователя" />
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {user ? (
                <>
                  <NavLink to="/user" onClick={() => setDropdownOpen(false)} className="link dropdown-item authorized">Личный кабинет</NavLink>
                  <div onClick={handleLogout} className="link dropdown-item authorized">Выйти</div>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setDropdownOpen(false)} className="link dropdown-item">Войти</NavLink>
                  <NavLink to="/register" onClick={() => setDropdownOpen(false)} className="link dropdown-item">Зарегистрироваться</NavLink>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
