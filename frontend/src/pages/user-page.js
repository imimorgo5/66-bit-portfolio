import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/header.js';
import '../css/user-page.css';


export default function UserPage() {
    const { user } = useContext(AuthContext);

    return (<div className='page'>
            <Header />
            <div className='content user-page'>
                <h1 className="page-title">Личный кабинет</h1>
                {user ? (
                    <div className="user-info">
                        <h2>Добро пожаловать, {user.username}!</h2>
                    </div>
                    ) : (
                    <div className="auth-warning">
                        Пожалуйста, войдите в систему
                    </div>
                )}
            </div>
        </div>
    );
}
