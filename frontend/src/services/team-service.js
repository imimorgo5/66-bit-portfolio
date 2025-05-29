export const createTeam = async (teamData) => {
  const res = await fetch('/teams/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(teamData)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Ошибка создания команды');
  }
  const data = await res.json();
  return data.team;
};

export const getTeamById = async (id) => {
  const response = await fetch(`/teams/show/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Ошибка при получении команды');
  }
  const data = await response.json();
  return { ...data.team, persons: data.team.persons.map(p => ({ ...p, id: p.personId })) };
};

export const getAllPersonTeams = async () => {
  const res = await fetch('/teams/show/all', {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) {
    throw new Error('Не удалось загрузить команды');
  }
  const data = await res.json();
  return data.teams.map(team => ({...team, persons: team.persons.map(p => ({ ...p, id: p.personId }))}));
};

export const updateTeamById = async (id, teamData) => {
  console.log(teamData);
  try {
    const response = await fetch(`/teams/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(teamData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при обновлении команды');
    }
  } catch (error) {
    console.error('Ошибка в updateTeamById:', error);
    throw error;
  }
};

export const deleteTeamById = async (id) => {
  try {
    const response = await fetch(`/teams/delete/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ошибка при удалении команды');
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('Ошибка в deleteTeamById:', error);
    throw error;
  }
};

export const getInvitedPersons = async (teamId) => {
  const res = await fetch(`/teams//${teamId}/show-invited`, {
    method: 'GET',
    credentials: 'include'
  });
  if (!res.ok) throw new Error('Не удалось загрузить приглашенных пользователей');
  const data = await res.json();
  return data.persons;
};  
