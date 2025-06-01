export const normalizeUrl = (input) => {
  let url = input.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url;
  }
  return url;
};

export const isNewCard = (card) =>
  (card.description === null || card.description === '') &&
  (card.cardFiles === null || (Array.isArray(card.cardFiles) && card.cardFiles.length === 0)) &&
  (card.projects === null || (Array.isArray(card.projects) && card.projects.length === 0)) &&
  card.title === 'Новая карточка';

export const isNewProject = (proj) =>
  (proj.description === null || proj.description === '') &&
  (proj.imageName == null || proj.imageName === '') &&
  (proj.projectLinks === null || (Array.isArray(proj.projectLinks) && proj.projectLinks.length === 0)) &&
  proj.title === 'Новый проект';

export const isNewTeam = (team) => team.persons.length === 1 && team.title === 'Новая команда';

export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailPattern.test(email)) {
    return { isValid: false, message: 'Некорректный email' };
  }
  return { isValid: true };
};

export const validateName = (name) => {
  if (name && name.length > 64) {
    return { isValid: false, message: 'Слишком длинное ФИО' };
  } else if (name && name.split(' ').filter(el => el).length < 2) {
    return { isValid: false, message: 'Некорректное ФИО' };
  }
  return { isValid: true };
};
