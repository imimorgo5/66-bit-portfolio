import Header from '../components/header.js';
import '../css/cards-page.css';


export default function CardsPage() {
    return (<div className='page'>
                <Header />
                <div className='content cards-page'>
                    <h1 className="page-title">Карточки</h1>
                </div>
            </div>
    );
}
