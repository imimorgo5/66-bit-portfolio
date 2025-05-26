export const getAllNotifications = async () => {
  const res = await fetch('/notifications/show-all', {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Ошибка при загрузке всех уведомлений');
  }
  const data = await res.json();
  return data.notifications;
};

export const getUnreadNotifications = async () => {
  const res = await fetch('/notifications/show-unread', {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Ошибка при загрузке непрочитанных уведомлений');
  }
  const data = await res.json();
  return data.notifications;
};

export const getNotificationById = async (id) => {
  const res = await fetch(`/notifications/show/${id}`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `Ошибка при загрузке уведомления ${id}`);
  }
  const data = await res.json();
  return data.notifications;
};

export const acceptInvitation = async (id) => {
  const res = await fetch(`/notifications/${id}/accept`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `Ошибка при принятии приглашения ${id}`);
  }
  const data = await res.json();
  return data.message;
};

export const rejectInvitation = async (id) => {
  const res = await fetch(`/notifications/${id}/reject`, {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || `Ошибка при отклонении приглашения ${id}`);
  }
  const data = await res.json();
  return data.message;
};
