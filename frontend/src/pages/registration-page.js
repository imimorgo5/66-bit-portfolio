import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/log-reg.css';
import logo from '../img/logo.svg';
import picture from '../img/reg-picture.png';
import { register } from '../services/auth-service';

export default function RegistrationPage() {
  const [email, setEmail] = useState('');
  const [userName, setName] = useState('');
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
    if (value && value.length > 64) {
      setNameError('Слишком длинное ФИО');   
    } else if (value && value.split(' ').filter(el => el).length < 2) {
      setNameError('Некорректное ФИО');
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
    if (value && value !== password) {
      setPasswordAgainError('Пароли не совпадают');
    } else {
        setPasswordAgainError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailError && !nameError && !passwordError && !passwordAgainError && email && userName && password && passwordAgain) {
      register({ email, userName, password })
        .then(data => {
          window.location.href = '/login';
        })
        .catch(error => {
          if (error.message.includes("Пользователь с таким email уже существует")) {
            setEmail('');
            setEmailError("Пользователь с таким email уже существует");
          }
        });
    }
  };
  

  const isFormValid = email && userName && password && passwordAgain && !emailError && !nameError && !passwordError && !passwordAgainError;

  return (
    <div className='page'>
      <div className='log-reg-container'>
        <div className="log-reg-content">
          <Link to="/"><img src={logo} className='logo' alt="Лого сайта" /></Link>
          <h1 className="log-reg-title">Регистрация</h1>
          <form onSubmit={handleSubmit} className="log-reg-form registration-form">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                maxLength={50}
                placeholder="Введите электронную почту"
                className={`${emailError ? 'input-error' : ''}`}
              />
              {emailError && (
                  <span className="error-message">{emailError}</span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                value={userName}
                onChange={handleNameChange}
                maxLength={75}
                placeholder="Введите свои ФИО"
                className={`${nameError ? 'input-error' : ''}`}
              />
              {nameError && (
                  <span className="error-message">{nameError}</span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                maxLength={25}
                placeholder="Придумайте пароль (не менее 8 символов)"
                className={`${passwordError ? 'input-error' : ''}`}
              />
              {passwordError && (
                  <span className="error-message">{passwordError}</span>
              )}
            </div>
            <div className="input-wrapper">
              <input
                type="password"
                id="passwordAgain"
                value={passwordAgain}
                onChange={handlePasswordAgainChange}
                maxLength={25}
                placeholder="Повторите пароль"
                className={`${passwordAgainError ? 'input-error' : ''}`}
              />
              {passwordAgainError && (                
                  <span className="error-message">{passwordAgainError}</span>
              )}
            </div>
            <div className="log-reg-link">
              <span>У Вас уже есть аккаунт? </span>
              <Link to="/login">Войти</Link>
            </div>        
          </form>
          <button type="submit" className="log-reg-button registration-button" onClick={handleSubmit} disabled={!isFormValid}>Зарегистрироваться</button>
        </div>
        <div className='log-reg-picture-container'>
          <img src={picture} alt='Красивая картинка:)'></img>
        </div>
      </div>
    </div>
  );
}
