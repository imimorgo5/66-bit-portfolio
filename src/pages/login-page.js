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
    if (!emailError && !passwordError && email && password) {
      const formData = {
        email: email,
        password: password
      };
  
      fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при входе');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Вход выполнен успешно:', data);
          // Можно выполнить редирект или показать сообщение об успехе
        })
        .catch((error) => {
          console.error('Ошибка:', error);
          // Здесь можно обработать ошибку и вывести сообщение пользователю
        });
    }
  };

  const isFormValid = email && password && !emailError && !passwordError;

  return (
    <div className="content log-reg-page">
      <h1 className="page-title">Вход</h1>
      <form onSubmit={handleSubmit} className="log-reg-form login-form">
        <div className="input-group">
          <label className='login-lable' htmlFor="email">Электронная почта</label>
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
      <button type="submit" className="log-reg-button login-button" onClick={handleSubmit} disabled={!isFormValid}>Войти</button>
    </div>
  );
}
