package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.repositories.CardRepository;
import ru.project.BackendPortfolio.repositories.PeopleRepository;
import ru.project.BackendPortfolio.repositories.ProjectRepository;

@Service
public class TokenService {

    private final CardRepository cardRepository;
    private final ProjectRepository projectRepository;
    private final PeopleRepository peopleRepository;

    @Autowired
    public TokenService(CardRepository cardRepository, ProjectRepository projectRepository, PeopleRepository peopleRepository) {
        this.cardRepository = cardRepository;
        this.projectRepository = projectRepository;
        this.peopleRepository = peopleRepository;
    }

    public Card getCardByShareToken(String token) {
        return cardRepository.findByShareToken(token)
                .filter(Card::isPublic)
                .orElseThrow(() -> new RuntimeException("Карточка недоступна, либо не найдена"));
    }

    public Project getProjectByShareToken(String token) {
        return projectRepository.findByShareToken(token)
                .filter(Project::isPublic)
                .orElseThrow(() -> new RuntimeException("Проект недоступен, либо не найден"));
    }

    public Person getPersonByShareToken(String token) {
        return peopleRepository.findByShareToken(token)
                .filter(Person::isPublic)
                .orElseThrow(() -> new RuntimeException("Пользователь недоступен, либо не найден"));
    }
}
