package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.PersonDTO;
import ru.project.BackendPortfolio.services.PersonService;

import java.util.Map;

@RestController
@RequestMapping("/person")
public class PersonController {

    private final PersonService personService;

    @Autowired
    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updatePerson(@PathVariable("id") int id, @ModelAttribute PersonDTO personDTO) {
        var updatedPerson = personService.updateProfile(id, personDTO);
        return ResponseEntity.ok(Map.of("updatedPerson", personService.mapToDTO(updatedPerson)));
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getPerson(@PathVariable("id") int id) {
        var personDTO = personService.getPersonDTOById(id);
        return ResponseEntity.ok(Map.of("person", personDTO));
    }

    // Метод для получения профиля текущего пользователя
    @GetMapping("/profile/my")
    public ResponseEntity<?> getActivePerson(){
        var personDTO = personService.getActivePersonDTO();
        return ResponseEntity.ok(Map.of("person", personDTO));
    }

    // Метод, для получения профилей всех пользователей
    @GetMapping("/profile/all")
    public ResponseEntity<?> getAllPersons(){
        var personDTO = personService.getAllPersonDTO();
        return ResponseEntity.ok(Map.of("persons", personDTO));
    }
}
