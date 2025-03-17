import Header from '../components/header.js';
import '../css/teams-page.css';


export default function TeamsPage() {
    return (<div className='page'>
                <Header />
                <div className='content teams-page'>
                    <h1 className="page-title">Команды</h1>
                </div>
            </div>
    );
}
