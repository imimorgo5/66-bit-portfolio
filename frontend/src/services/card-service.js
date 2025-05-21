export const createPersonCard = async (cardData) => {
    const formData = new FormData();
    formData.append('title', cardData.title);

    const res = await fetch('/cards/create-by-person', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    if (!res.ok) {
        throw new Error('Ошибка при создании карточки');
    }
    const data = await res.json();
    return data.card;
};

export const getPersonCards = async () => {
    const res = await fetch('/cards/show-by-person', { credentials: 'include' });
    if (!res.ok) {
        throw new Error('Ошибка при получении карточек');
    }
    const data = await res.json();
    return data.cards || [];
};

export const getTeamCards = async (teamId) => {
    const res = await fetch(`/cards/show-by-team/${teamId}`, { credentials: 'include' });
    if (!res.ok) {
        throw new Error('Ошибка при получении карточек');
    }
    const data = await res.json();
    return data.cards || [];
};

export const getPersonTeamsCard = async (id) => {
    const res = await fetch(`/cards/show-team-cards-by-person/${id}`, { credentials: 'include' });
    if (!res.ok) {
        throw new Error('Ошибка при получении карточек');
    }
    const data = await res.json();
    return data.cards || [];
};

export const createTeamCard = async (cardData) => {
    const formData = new FormData();
    formData.append('teamId', cardData.teamId);
    formData.append('title', cardData.title);

    const res = await fetch('/cards/create-by-team', {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    if (!res.ok) {
        throw new Error('Ошибка при создании карточки');
    }
    const data = await res.json();
    return data.card;
};

export const getCardById = async (id) => {
    const res = await fetch(`/cards/card/${id}`, { credentials: 'include' });
    if (!res.ok) {
        throw new Error('Ошибка при получении карточки');
    }
    const data = await res.json();
    return data.card;
};

export const updateCard = async (id, cardData) => {
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
        cardData.projects.forEach((projectId, index) => {
            formData.append(`projects[${index}].id`, projectId);
        });
    }

    const res = await fetch(`/cards/update/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
    });
    if (!res.ok) {
        throw new Error('Ошибка при обновлении карточки');
    }
    const data = await res.json();
    return data.card;
};

export const deleteCard = async (id) => {
    const res = await fetch(`/cards/delete/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!res.ok) {
        throw new Error('Ошибка при удалении карточки');
    }
    return await res.json();
};