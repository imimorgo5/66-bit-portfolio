package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CreateTeamDTO;
import ru.project.BackendPortfolio.dto.PersonTeamDTO;
import ru.project.BackendPortfolio.dto.TeamDTO;
import ru.project.BackendPortfolio.exceptions.ForbiddenException;
import ru.project.BackendPortfolio.mappers.TeamMapper;
import ru.project.BackendPortfolio.models.PersonTeam;
import ru.project.BackendPortfolio.models.Team;
import ru.project.BackendPortfolio.repositories.PersonTeamRepository;
import ru.project.BackendPortfolio.repositories.TeamRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final PersonTeamRepository personTeamRepository;
    private final PersonService personService;
    private final TeamMapper teamMapper;

    @Autowired
    public TeamService(TeamRepository teamRepository, PersonTeamRepository personTeamRepository,
                       PersonService personService, TeamMapper teamMapper) {
        this.teamRepository = teamRepository;
        this.personTeamRepository = personTeamRepository;
        this.personService = personService;
        this.teamMapper = teamMapper;
    }

    @Transactional
    public TeamDTO createTeam(CreateTeamDTO createTeamDTO) {
        var creator = personService.getActivePerson();
        var team = new Team();
        team.setTitle(createTeamDTO.getTitle());
        team.setAdminId(creator.getId());
        teamRepository.save(team);
        var members = createTeamDTO.getPersons();
        List<PersonTeam> personTeams = new ArrayList<>();
        for(var member : members) {
            var personTeam = teamMapper.mapPersonTeam(team, member);
            personTeams.add(personTeam);
            personTeamRepository.save(personTeam);
        }

        var creatorDTO = teamMapper.mapPersonTeamDTO(creator, createTeamDTO.getMyRole());
        var personTeam = teamMapper.mapPersonTeam(team, creatorDTO);
        personTeams.add(personTeam);
        personTeamRepository.save(personTeam);

        team.setPersonTeams(personTeams);
        return teamMapper.mapTeamDTO(team);
    }

    public TeamDTO getTeamById(int id){
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        return teamMapper.mapTeamDTO(team);
    }

    @Transactional
    public TeamDTO updateTeam(int id, CreateTeamDTO createTeamDTO) {
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        team.setTitle(createTeamDTO.getTitle());

        var oldPersonTeams = team.getPersonTeams();
        var newPersonTeamDTOs = createTeamDTO.getPersons();
        var newEmailRoleMap = newPersonTeamDTOs.stream()
                .collect(Collectors.toMap(PersonTeamDTO::getEmail, PersonTeamDTO::getRole));

        oldPersonTeams.removeIf(personTeam -> {
            var person = personTeam.getPerson();
            var email = person.getEmail();

            if (!newEmailRoleMap.containsKey(email)) {
                if (person.getId() != team.getAdminId()) {
                    System.out.println("УДАЛЕНИЕ: " + email);
                    personTeamRepository.delete(personTeam);
                    return true;
                } else {
                    return false;
                }
            }

            var newRole = createTeamDTO.getMyRole();
            if (!newRole.equals(personTeam.getRole())) {
                personTeam.setRole(newRole);
                personTeamRepository.save(personTeam);
            }

            return false;
        });

        for (var personTeamDTO : newPersonTeamDTOs) {
            var email = personTeamDTO.getEmail();
            if (isExists(oldPersonTeams, email)) continue;
            var personTeam = teamMapper.mapPersonTeam(team, personTeamDTO);
            personTeamRepository.save(personTeam);
        }

        return teamMapper.mapTeamDTO(team);
    }

    @Transactional
    public void deleteTeam(int id){
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        checkRights(team);
        teamRepository.delete(team);
    }

    public void checkRights(Team team){
        var adminId = team.getAdminId();
        var activePersonId = personService.getActivePerson().getId();
        if (adminId != activePersonId){
            throw new ForbiddenException("У вас недостаточно прав на выполнение этого действия.");
        }
    }

    public boolean isExists(List<PersonTeam> teams, String email) {
        for (var team : teams) {
            if (team.getPerson().getEmail().equals(email)){
                return true;
            }
        }

        return false;
    }

    public List<TeamDTO> getAllPersonTeams(){
        var activePerson = personService.getActivePerson();
        List<TeamDTO> teamDTOs = new ArrayList<>();
        var allTeams = teamRepository.findAll();
        for(var team : allTeams){
            var personTeams = team.getPersonTeams();
            for(var personTeam : personTeams) {
                var person = personTeam.getPerson();
                if (person.equals(activePerson)) {
                    teamDTOs.add(teamMapper.mapTeamDTO(team));
                }
            }
        }
        return teamDTOs;
    }
}
