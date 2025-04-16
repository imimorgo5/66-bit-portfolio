export const getPersonById = (id) => {
    return fetch(`/person/profile/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при получении информации о пользователе');
        }
        return res.json();
      })
      .then((data) => data.person);
  };
  
  export const updatePerson = (id, personData) => {
    const formData = new FormData();
    formData.append('username', personData.username);
    formData.append('email', personData.email);
    formData.append('phoneNumber', personData.phoneNumber);
    formData.append('birthDate', personData.birthDate);
    if (personData.imageFile) {
      formData.append('imageFile', personData.imageFile);
    }
    return fetch(`/person/update/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при обновлении профиля');
        }
        return res.json();
      })
      .then((data) => data.updatedPerson);
  };
  