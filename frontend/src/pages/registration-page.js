import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/registration-page.css';
import '../css/log-reg.css';
import logo from '../img/logo.png';

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordAgainError, setPasswordAgainError] = useState('');

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

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    let userNames = ['qwerty123', 'zxc', 'qwertyqwertyqwertyqwertyqwer'];
    if (userNames.includes(value)) {
      setNameError('Пользователь с таким логином уже есть');
    } else if (value.length > 28) {
        setNameError('Слишком длинное имя пользователя');   
    } else {
      setNameError('');
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

  const handlePasswordAgainChange = (e) => {
    const value = e.target.value;
    setPasswordAgain(value);
    if (value !== password) {
      setPasswordAgainError('Пароли не совпадают');
    } else {
        setPasswordAgainError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailError && !nameError && !passwordError && !passwordAgainError && email && name && password && passwordAgain) {
      const formData = {
        email: email,
        name: name,
        password: password
      };
  
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Ошибка при регистрации');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Регистрация прошла успешно:', data);
          // Можно выполнить редирект или показать сообщение об успехе
        })
        .catch((error) => {
          console.error('Ошибка:', error);
          // Здесь можно обработать ошибку и вывести сообщение пользователю
        });
    }
  };
  

  const isFormValid = email && name && password && passwordAgain && !emailError && !nameError && !passwordError && !passwordAgainError;

  return (
    <div className='page'>
      <div className='log-reg-title-container'>
        <Link to="/"><img src={logo} className='logo' alt="Лого сайта" /></Link>
        <h1 className="log-reg-title">Регистрация</h1>
      </div>
      <div className="content log-reg-page">
        <form onSubmit={handleSubmit} className="log-reg-form registration-form">
          <div className="input-group">
            <label className='registration-lable' htmlFor="email">Электронная почта</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Введите ваш email"
              />
              {emailError && (
                <div className="error-icon-wrapper">
                  <span className="error-icon">&times;</span>
                  <span className="error-message">{emailError}</span>
                </div>
              )}
            </div>
          </div>
          <div className="input-group">
            <label className='registration-lable' htmlFor="name">Имя пользователя</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                placeholder="Введите желаемое имя пользователя"
              />
              {nameError && (
                <div className="error-icon-wrapper">
                  <span className="error-icon">&times;</span>
                  <span className="error-message">{nameError}</span>
                </div>
              )}
            </div>
          </div>
          <div className="input-group">
            <label className='registration-lable' htmlFor="password">Пароль</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Придумайте пароль (не менее 8 символов)"
              />
              {passwordError && (
                <div className="error-icon-wrapper">
                  <span className="error-icon">&times;</span>
                  <span className="error-message">{passwordError}</span>
                </div>
              )}
            </div>
          </div>
          <div className="input-group">
            <label className='registration-lable' htmlFor="passwordAgain">Пароль (ещё раз)</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="passwordAgain"
                value={passwordAgain}
                onChange={handlePasswordAgainChange}
                placeholder="Повторите пароль"
              />
              {passwordAgainError && (
                <div className="error-icon-wrapper">
                  <span className="error-icon">&times;</span>
                  <span className="error-message">{passwordAgainError}</span>
                </div>
              )}
            </div>
          </div>
          <div className="log-reg-link">
            <span>У Вас уже есть аккаунт? </span>
            <Link to="/login">Войти</Link>
          </div>        
        </form>
        <button type="submit" className="log-reg-button registration-button" onClick={handleSubmit} disabled={!isFormValid}>Зарегестрироваться</button>
      </div>
    </div>
  );
}
