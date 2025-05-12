import React from 'react';
import '../css/notification-component.css';
import { NOTIFICATIONS } from '../mock/notifications.js';

export default function NotificationComponent({ notifications }) {
  const handleClick = (notification) => {
    return;
  };

  return (
    <div className="notifications-container">
        {NOTIFICATIONS ? (
        <ul className="notifications-list">
            {NOTIFICATIONS.map((notification) => (
                <li key={notification.id} onClick={() => handleClick(notification)}>
                    <p className='notification-title'>{notification.title}</p>
                    <p className='notification-date'>{notification.createdDate}</p>
                </li>
            ))}
        </ul>) : 
        <p className='notifications-empty-title'>Уведомлений нет</p>
        }
    </div>
  );
}
