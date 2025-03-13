package ru.project.BackendPortfolio.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.services.PersonDetailsService;

@Component
public class PersonValidator implements Validator {

    private final PersonDetailsService personDetailsService;

    @Autowired
    public PersonValidator(PersonDetailsService personDetailsService) {
        this.personDetailsService = personDetailsService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return Person.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        // Можно сделать отдельный сервис под эту логику
        // Можно отдельно прописать логику получения пользователя

        Person person = (Person) target;

        try{
            personDetailsService.loadUserByUsername(person.getUsername());
        } catch(UsernameNotFoundException ignored){
            return;
        }

        errors.rejectValue("username", "",
                "Человек с таким именем пользователя уже существует");
    }
}
