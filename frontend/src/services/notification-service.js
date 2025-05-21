export async function getAllNotifications() {
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
}

export async function getUnreadNotifications() {
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
}

export async function getNotificationById(id) {
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
}

export async function acceptInvitation(id) {
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
}

export async function rejectInvitation(id) {
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
}
