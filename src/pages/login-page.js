import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/login-page.css';
import '../css/log-reg.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
    // Здесь можно добавить отправку данных на сервер
    if (!emailError && !passwordError && email && password) {
      console.log('Данные формы корректны');
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <div className="content log-reg-page">
      <h1 className="page-title">Вход</h1>
      <form onSubmit={handleSubmit} className="log-reg-form login-form">
        <div className="input-group">
          <label className='login-lable' htmlFor="email">Почта / Логин</label>
          <div className="input-wrapper">
            <input
              type="text"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Введите email или логин"
            />
            {emailError && <span className="error-message">{emailError}</span>}
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
            />
            {passwordError && <span className="error-message">{passwordError}</span>}
          </div>
        </div>
        <div className="log-reg-link">
          <span>У Вас ещё нет аккаунта? </span>
          <Link to="/register">Зарегистрироваться</Link>
        </div>        
      </form>
      <button type="submit" className="log-reg-button login-button" disabled={!isFormValid}>Войти</button>
    </div>
  );
}
