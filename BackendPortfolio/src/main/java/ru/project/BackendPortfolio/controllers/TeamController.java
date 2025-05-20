package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.CreateTeamDTO;
import ru.project.BackendPortfolio.services.NotificationService;
import ru.project.BackendPortfolio.services.TeamService;

import java.util.Map;

@RestController
@RequestMapping("/teams")
public class TeamController {

    private final TeamService teamService;
    private final NotificationService notificationService;

    @Autowired
    public TeamController(TeamService teamService, NotificationService notificationService) {
        this.teamService = teamService;
        this.notificationService = notificationService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createTeam(@RequestBody CreateTeamDTO createTeamDTO) {
        var teamDTO = teamService.createTeam(createTeamDTO);
        return ResponseEntity.ok(Map.of("team", teamDTO));
    }

    @GetMapping("/show/{id}")
    public ResponseEntity<?> getTeamById(@PathVariable("id") int id) {
        var teamDTO = teamService.getTeamDTOById(id);
        return ResponseEntity.ok(Map.of("team", teamDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTeamById(@PathVariable("id") int id, @RequestBody CreateTeamDTO createTeamDTO) {
        teamService.updateTeam(id, createTeamDTO);
        return ResponseEntity.ok("YEEES");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTeamById(@PathVariable("id") int id) {
        teamService.deleteTeam(id);
        return ResponseEntity.ok(Map.of("message", "Команда успешно удалена"));
    }

    @GetMapping("/show/all")
    public ResponseEntity<?> getAllPersonTeam() {
        var teamsDTO = teamService.getAllPersonTeams();
        return ResponseEntity.ok(Map.of("teams", teamsDTO));
    }

    // Получение всех пользователей, приглашённых в эту команду
    @GetMapping("/{id}/show-invited")
    public ResponseEntity<?> getInvitedPersonTeam(@PathVariable("id") int id) {
        var personDTOs = notificationService.getAllInvitedPersons(id);
        return ResponseEntity.ok(Map.of("persons", personDTOs));
    }
}
