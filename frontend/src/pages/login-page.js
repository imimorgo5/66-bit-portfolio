import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../css/login-page.css';
import '../css/log-reg.css';
import logo from '../img/logo.png';
import { AuthContext } from '../context/AuthContext';
import { login } from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { setUser } = useContext(AuthContext);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailPattern.test(value)) {
      setEmailError('Некорректный email');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (value && value.length < 8) {
      setPasswordError('Слишком короткий пароль');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailError && !passwordError && email && password) {
      login({ email, password })
        .then(data => {
          setUser(data.user);
          window.location.href = '/';
        })
        .catch(error => {
          console.error('Ошибка входа:', error);
          // Дополнительная обработка ошибок
        });
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <div className='page'>
      <div className='log-reg-title-container'>
        <Link to="/"><img src={logo} className='logo' alt="Лого сайта" /></Link>
        <h1 className="log-reg-title">Вход</h1>
      </div>
      <div className="content log-reg-page">
        <form onSubmit={handleSubmit} className="log-reg-form login-form">
          <div className="input-group">
            <label className='login-lable' htmlFor="email">Электронная почта</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Введите ваш email"
                className={`${emailError ? 'input-error' : ''}`}
              />
              {emailError && (
                <span className="error-message">{emailError}</span>
              )}
            </div>
          </div>
          <div className="input-group">
            <label className='login-lable' htmlFor="password">Пароль</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Введите пароль"
                className={`${passwordError ? 'input-error' : ''}`}
              />
              {passwordError && (
                <span className="error-message">{passwordError}</span>
              )}
            </div>
          </div>
          <div className="log-reg-link password-link">
            <span>Забыли пароль? </span>
            <Link to="/login">Восстановить пароль</Link>
          </div>
          <div className="log-reg-link">
            <span>У Вас ещё нет аккаунта? </span>
            <Link to="/register">Зарегистрироваться</Link>
          </div>        
        </form>
        <button type="submit" className="log-reg-button login-button" onClick={handleSubmit} disabled={!isFormValid}>
          Войти
        </button>
      </div>
    </div>
  );
}
