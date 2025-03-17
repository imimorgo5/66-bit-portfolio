import Header from '../components/header.js';
import '../css/user-page.css';


export default function UserPage() {
    return (<div className='page'>
                <Header />
                <div className='content user-page'>
                    <h1 className="page-title">Личный кабинет</h1>
                </div>
            </div>
    );
}
