export const getPersonById = async (id) => {
  const res = await fetch(`/person/profile/${id}`, { credentials: 'include', method: 'GET' });

  if (!res.ok) {
    throw new Error('Ошибка при получении информации о пользователе');
  }

  const data = await res.json();
    return data.person;
  };
  
  export const updatePerson = async (id, personData) => {
    const formData = new FormData();
    formData.append('username', personData.username);
    formData.append('email', personData.email);
    formData.append('phoneNumber', personData.phoneNumber);
    formData.append('birthDate', personData.birthDate);

    if (personData.imageFile) {
      formData.append('imageFile', personData.imageFile);
    }

    if (personData.linkDTOs && Array.isArray(personData.linkDTOs)) {
        personData.linkDTOs.forEach((link, index) => {
            formData.append(`linkDTOs[${index}].link`, link.link || '');
            formData.append(`linkDTOs[${index}].description`, link.description || '');
        });
    }

    const res = await fetch(`/person/update/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error)
    }

    const data = await res.json();
    return data.updatedPerson;
  };

  export const getAllPeople = async () => {
    try {
      const response = await fetch('/person/profile/all', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при получении пользователей');
      }
  
      const data = await response.json();
      return data.persons;
    } catch (error) {
      console.error('Ошибка в getAllPeople:', error);
      throw error;
    }
  };  
  