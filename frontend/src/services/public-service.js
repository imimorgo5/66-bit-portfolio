export const getPublicCard = async (token) => {
  try {
    const response = await fetch(`/public/card/${token}`);
    if (response.status === 404) {
      throw new Error('Карточка не найдена или ссылка недействительна');
    }
    if (!response.ok) {
      throw new Error('Ошибка сети при загрузке карточки');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getPublicProject = async (token) => {
  try {
    const response = await fetch(`/public/project/${token}`);
    if (response.status === 404) {
      throw new Error('Проект не найден или ссылка недействительна');
    }
    if (!response.ok) {
      throw new Error('Ошибка сети при загрузке проекта');
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};
