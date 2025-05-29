import React, { useState, useEffect } from 'react';
import '../css/notification-component.css';
import { getUnreadNotifications, acceptInvitation, rejectInvitation } from '../services/notification-service';

export default function NotificationComponent({handleRead}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getUnreadNotifications()
      .then(setNotifications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openDetail = notif => setSelected(notif);

  const closeDetail = () => setSelected(null);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  const handleAccept = () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      acceptInvitation(selected.id);
      setNotifications(prev => prev.filter(n => n.id !== selected.id));
      closeDetail();
      handleRead();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  const handleReject = () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      rejectInvitation(selected.id);
      setNotifications(prev => prev.filter(n => n.id !== selected.id));
      closeDetail();
      handleRead();
    } catch (e) {
      console.error(e);
    }
    setActionLoading(false);
  };

  if (loading) {
    return <div className="notifications-container">
      <p className='notifications-loading'>Загрузка...</p>
    </div>;
  }

  return (
    <div className="notifications-container">
      {notifications.length > 0 ? (
        <ul className="notifications-list">
          {notifications.map(n => (
            <li key={n.id} onClick={() => openDetail(n)}>
              <p className='notification-title'>Приглашение в команду</p>
              <p className='notification-date'>{formatDateTime(n.createdAt)}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className='notifications-empty-title'>Новых уведомлений нет</p>
      )}

      {selected && (
        <div className="notification-modal-overlay" onClick={closeDetail}>
          <div className="notification-modal" onClick={e => e.stopPropagation()}>
            <h3 className="notification-modal-title">Приглашение в команду</h3>
            <p className="notification-modal-content">{selected.message}</p>
            <div className="notification-modal-actions">
              <button onClick={handleAccept} className='button add-submit-button accept-notification-button' disabled={actionLoading}>Принять</button>
              <button onClick={handleReject} className='button cancel-delete-button reject-notification-button' disabled={actionLoading}>Отклонить</button>
            </div>
            <button className="remove-button notification-modal-close" onClick={closeDetail}>×</button>
          </div>
        </div>
      )}
    </div>
  );
}
