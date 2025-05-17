package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.services.CardService;
import ru.project.BackendPortfolio.services.PersonService;
import ru.project.BackendPortfolio.services.ProjectService;
import ru.project.BackendPortfolio.services.TokenService;

import java.util.Map;

@RestController
@RequestMapping("/public")
public class PublicController {

    private final CardService cardService;
    private final ProjectService projectService;
    private final TokenService tokenService;
    private final PersonService personService;

    @Autowired
    public PublicController(CardService cardService, ProjectService projectService,
                            TokenService tokenService, PersonService personService) {
        this.cardService = cardService;
        this.projectService = projectService;
        this.tokenService = tokenService;
        this.personService = personService;
    }

    @GetMapping("/card/{token}")
    public ResponseEntity<?> getSharedCard(@PathVariable("token") String token) {
        var card = tokenService.getCardByShareToken(token);
        var cardDTO = cardService.mapToPublicDTO(card);
        return ResponseEntity.ok(Map.of("card", cardDTO));
    }

    @GetMapping("/project/{token}")
    public ResponseEntity<?> getSharedProject(@PathVariable String token) {
        var project = tokenService.getProjectByShareToken(token);
        var projectDTO = projectService.mapToDTO(project);
        return ResponseEntity.ok(Map.of("project", projectDTO));
    }

    @GetMapping("/profile/{token}")
    public ResponseEntity<?> getSharedProfile(@PathVariable String token) {
        var person = tokenService.getPersonByShareToken(token);
        var personDTO = personService.mapToPublicDTO(person);
        return ResponseEntity.ok(Map.of("person", personDTO));
    }
}
