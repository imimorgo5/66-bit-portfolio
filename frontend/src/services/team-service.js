export const createTeam = async ({ title, emails }) => {
    const res = await fetch('/teams/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, emails })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Ошибка создания команды');
    }
    const data = await res.json();
    return data.team;
  };
  
  export const getTeamById = async (id) => {
    try {
      const response = await fetch(`/teams/team/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при получении команды');
      }
  
      const data = await response.json();
      return data.team;
    } catch (error) {
      console.error('Ошибка в getTeamById:', error);
      throw error;
    }
  };
  
  export const getAllPersonTeams = async () => {
    const res = await fetch('/teams/team/all', {
      method: 'GET',
      credentials: 'include'
    });
    if (!res.ok) throw new Error('Не удалось загрузить команды');
    const data = await res.json();
    return data.teams;
  };  
  
  export const updateTeamById = async (id, teamData) => {
    try {
      const response = await fetch(`/teams/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(teamData), // { title, emails: [...] }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при обновлении команды');
      }
  
      const data = await response.json();
      return data.team;
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
  