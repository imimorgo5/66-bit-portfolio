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
    formData.append('description', cardData.description);

    if (cardData.links && Array.isArray(cardData.links)) {
        cardData.links.forEach(link => {
            formData.append('links', link);
        });
    }

    if (cardData.files && Array.isArray(cardData.files)) {
        cardData.files.forEach((fileItem, index) => {
            formData.append(`cardFiles[${index}].file`, fileItem.file);
            formData.append(`cardFiles[${index}].fileTitle`, fileItem.fileTitle);
            formData.append(`cardFiles[${index}].description`, fileItem.description);
        });
    }

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
    formData.append('description', cardData.description);

    if (cardData.links && Array.isArray(cardData.links)) {
        cardData.links.forEach(link => {
            formData.append('links', link);
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