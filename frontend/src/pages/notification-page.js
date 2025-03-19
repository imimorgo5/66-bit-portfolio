import Header from '../components/header.js';
import '../css/notification-page.css';


export default function NotificationPage() {
    return (<div className='page'>
                <Header />
                <div className='content cards-page'>
                    <h1 className="page-title">Уведомления</h1>
                </div>
            </div>
    );
}
