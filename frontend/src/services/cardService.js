export const getCards = () => {
    return fetch('/cards/show', { credentials: 'include' })
        .then((res) => {
        if (!res.ok) {
            throw new Error('Ошибка при получении карточек');
        }
        return res.json();
        })
        .then((data) => data.cards || []);
};

export const getCardById = (id) => {
    return fetch(`/cards/card/${id}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Ошибка при получении карточки');
        }
        return res.json();
      })
      .then((data) => data.card);
};

export const createCard = (cardData) => {
    const formData = new FormData();
    formData.append('title', cardData.title);

    //Убрать после переделки в бэке
    formData.append('description', ' ');

    return fetch('/cards/create', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Ошибка при создании карточки');
        }
        return res.json();
    })
    .then((data) => data.card);
};

export const updateCard = (id, cardData) => {
    const formData = new FormData();
    formData.append('title', cardData.title);
   
    if (cardData.description) {
        formData.append('description', cardData.description);
    }

    if (cardData.cardLinks && Array.isArray(cardData.cardLinks)) {
        cardData.cardLinks.forEach((link, index) => {
            formData.append(`cardLinks[${index}].link`, link.link || '');
            formData.append(`cardLinks[${index}].description`, link.description || '');
        });
    }

    if (cardData.cardFiles && Array.isArray(cardData.cardFiles)) {
        cardData.cardFiles.forEach((fileItem, index) => {
            if (fileItem.file) {
                formData.append(`cardFiles[${index}].file`, fileItem.file);
            }
            formData.append(`cardFiles[${index}].fileTitle`, fileItem.fileTitle || '');
            formData.append(`cardFiles[${index}].description`, fileItem.description || '');
        });
    }

    if (cardData.projects && Array.isArray(cardData.projects)) {
        cardData.projects.forEach(projectId => {
            formData.append('projects', projectId);
        });
    }

    return fetch(`/cards/update/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Ошибка при обновлении карточки');
        }
        return res.json();
    })
    .then((data) => data.card);
};

export const deleteCard = (id) => {
    return fetch(`/cards/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    .then((res) => {
        if (!res.ok) {
            throw new Error('Ошибка при удалении карточки');
        }
        return res.json();
    });
};