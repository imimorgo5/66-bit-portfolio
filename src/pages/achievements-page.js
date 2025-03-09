import Header from '../components/header.js';
import '../css/achievements-page.css';


export default function AchievementsPage() {
    return (<div className='page'>
                <Header />
                <div className='content achievements-page'>
                    <h1 className="page-title">Достижения</h1>
                </div>
            </div>
    );
}
