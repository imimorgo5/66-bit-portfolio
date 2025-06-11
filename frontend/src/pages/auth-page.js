import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import { login, register } from '../services/auth-service.js';
import { FormType } from '../consts.js';
import { validateEmail, validateName } from '../utils/utils.js';
import logo from '../img/logo.svg';
import logPicture from '../img/login-picture.png';
import regPicture from '../img/reg-picture.png';
import '../css/auth.css';

export default function AuthPage({ formType }) {
    const navigate = useNavigate();
    const isRegister = formType === FormType.REGISTRATION;
    const { setUser } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordAgainError, setPasswordAgainError] = useState('');
    let isFormValid = false;

    useEffect(() => {
        setEmailError('');
        setPasswordError('');
        setPasswordAgainError('');
        setEmail('');
        setPassword('');
        setPasswordAgain('');
        setUsername('');
        setNameError('');
    }, [isRegister]);

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        const vaildateResult = validateEmail(value)
        if (!vaildateResult.isValid) {
            setEmailError(vaildateResult.message);
        } else {
            setEmailError('');
        }
    };

    const handleNameChange = (e) => {
        const value = e.target.value;
        setUsername(value);
        const vaildateResult = validateName(value);
        if (!vaildateResult.isValid) {
            setNameError(vaildateResult.message);
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

    const handleSubmit = e => {
        e.preventDefault();
        if (isRegister) {
            if (isFormValid)
                register({ email, password, username })
                    .then(() => navigate('/login'))
                    .catch(err => {
                        if (err.message.includes('email')) {
                            setEmail('');
                            setEmailError("Пользователь с таким email уже существует");
                        }
                        console.error(err);
                    });
        } else {
            if (isFormValid) {
                login({ email, password })
                    .then(data => {
                        setUser(data.user);
                        window.location.href = '/'
                    })
                    .catch(err => {
                        if (err.message.includes('Invalid credentials')) {
                            setEmail('');
                            setEmailError('Неверная почта или пароль');
                            setPassword('');
                            setPasswordError('Неверная почта или пароль');
                        }
                        console.error(err);
                    });
            }
        };
    }

    isFormValid = email && (!isRegister || username) && password && (!isRegister || passwordAgain)
        && !emailError && !nameError && !passwordError && !passwordAgainError

    return (
        <div className={'auth-page ' + formType}>
            <div className="auth-content">
                <Link to="/"><img src={logo} className='logo' alt="Лого сайта" /></Link>
                <h1 className="auth-title">{isRegister ? 'Регистрация' : 'Вход'}</h1>
                <form onSubmit={handleSubmit} className='auth-form'>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            maxLength={50}
                            placeholder="Введите электронную почту"
                            className={`text-input ${emailError ? 'input-error' : ''}`}
                        />
                        {emailError && <span className="error-message auth-error-message">{emailError}</span>}
                    </div>
                    {isRegister &&
                        <div className="input-wrapper">
                            <input
                                type="text"
                                id="name"
                                value={username}
                                onChange={handleNameChange}
                                maxLength={75}
                                placeholder="Введите свои ФИО"
                                className={`text-input ${nameError ? 'input-error' : ''}`}
                            />
                            {nameError && <span className="error-message auth-error-message">{nameError}</span>}
                        </div>
                    }
                    <div className="input-wrapper">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                            maxLength={25}
                            placeholder={isRegister ? "Придумайте пароль (не менее 8 символов)" : 'Введите пароль'}
                            className={`text-input ${passwordError ? 'input-error' : ''}`}
                        />
                        {passwordError && <span className="error-message auth-error-message">{passwordError}</span>}
                    </div>
                    {isRegister &&
                        <div className="input-wrapper">
                            <input
                                type="password"
                                id="passwordAgain"
                                value={passwordAgain}
                                onChange={handlePasswordAgainChange}
                                maxLength={25}
                                placeholder="Повторите пароль"
                                className={`text-input ${passwordAgainError ? 'input-error' : ''}`}
                            />
                            {passwordAgainError && <span className="error-message auth-error-message">{passwordAgainError}</span>}
                        </div>
                    }
                    <div className="auth-link">
                        <span>{isRegister ? 'У Вас уже есть аккаунт? ' : 'У Вас ещё нет аккаунта? '}</span>
                        <Link to={isRegister ? '/login' : '/register'} className='link'>{isRegister ? 'Войти' : 'Зарегистрироваться'}</Link>
                    </div>
                </form>
                <button type="submit" className="button add-submit-button auth-button" onClick={handleSubmit} disabled={!isFormValid}>{isRegister ? 'Зарегистрироваться' : 'Войти'}</button>
            </div>
            <div className='auth-picture-container'>
                <img src={isRegister ? regPicture : logPicture} alt='Красивая картинка'></img>
            </div>
        </div>
    );
}
