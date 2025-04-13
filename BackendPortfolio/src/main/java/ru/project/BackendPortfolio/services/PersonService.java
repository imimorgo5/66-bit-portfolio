package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.repositories.PeopleRepository;

@Service
public class PersonService {
    private final PeopleRepository peopleRepository;

    @Autowired
    public PersonService(PeopleRepository peopleRepository) {
        this.peopleRepository = peopleRepository;
    }

    public Person getActivePerson(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var username = authentication.getName();
        return peopleRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }
}
