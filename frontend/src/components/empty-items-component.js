import React from 'react';
import emptyArrow from '../img/empty-arrow.svg';
import emptyPicture from '../img/empty-items-picture.png';
import '../css/empty-items-component.css'

export default function EmptyItemsComponent({title, className}) {
    return (
        <div className={className ? 'empty-previews ' + className : 'empty-previews'}>
            <img
                src={emptyPicture}
                alt="Красивая картинка"
                className="empty-items-picture"
            />
            <p className="empty-title">{title}</p>
            <div className="arrow-to-add">
                <img
                src={emptyArrow}
                className="empty-arrow"
                alt="Стрелка к кнопке"
                />
            </div>
        </div>
    );
}