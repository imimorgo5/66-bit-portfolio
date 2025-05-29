import React from 'react';

export default function LoadMoreButton({ onClick }) {
    return (
        <div className='load-more-button-container'>
            <button className="button add-submit-button load-more-button" onClick={onClick}>Загрузить еще</button>
        </div>
    );
}
