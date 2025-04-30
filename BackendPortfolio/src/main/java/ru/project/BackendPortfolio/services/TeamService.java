package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CreateTeamDTO;
import ru.project.BackendPortfolio.dto.PersonDTO;
import ru.project.BackendPortfolio.dto.TeamDTO;
import ru.project.BackendPortfolio.exceptions.ForbiddenException;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.PersonTeam;
import ru.project.BackendPortfolio.models.Team;
import ru.project.BackendPortfolio.repositories.PeopleRepository;
import ru.project.BackendPortfolio.repositories.PersonTeamRepository;
import ru.project.BackendPortfolio.repositories.TeamRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final PersonTeamRepository personTeamRepository;
    private final PeopleRepository peopleRepository;
    private final PersonService personService;
    private final ModelMapper modelMapper;

    @Autowired
    public TeamService(TeamRepository teamRepository, PersonTeamRepository personTeamRepository,
                       PeopleRepository peopleRepository, PersonService personService, ModelMapper modelMapper) {
        this.teamRepository = teamRepository;
        this.personTeamRepository = personTeamRepository;
        this.peopleRepository = peopleRepository;
        this.personService = personService;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public TeamDTO createTeam(String title, List<String> memberEmails) {
        var creator = personService.getActivePerson();

        var team = new Team();
        team.setTitle(title);
        teamRepository.save(team);

        var adminPersonTeam = mapPersonTeam(creator, team, true);
        personTeamRepository.save(adminPersonTeam);

        for (var email : memberEmails) {
            if (email.equalsIgnoreCase(creator.getEmail())) continue;
            var person = peopleRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Пользователь с email " + email + " не найден"));

            var personTeam = mapPersonTeam(person, team, false);
            personTeamRepository.save(personTeam);
        }

        return mapTeamDTO(team);
    }

    public TeamDTO getTeamById(int id){
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        return mapTeamDTO(team);
    }

    @Transactional
    public TeamDTO updateTeam(int id, CreateTeamDTO createTeamDTO){
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        checkRights(team);

        var oldPersonTeams = team.getPersonTeams();
        var newPersonTeamsEmails = createTeamDTO.getEmails();
        oldPersonTeams.removeIf(personTeam -> {
            var email = personTeam.getPerson().getEmail();
            if (personTeam.isAdmin() || newPersonTeamsEmails.contains(email)) {
                return false;
            }
            System.out.println("УДАЛЕНИЕ: " + personTeam.getPerson().getEmail());
            personTeamRepository.delete(personTeam);
            return true;
        });

        team.setTitle(createTeamDTO.getTitle());

        var emails = createTeamDTO.getEmails();
        for (var email : emails) {
            var person = peopleRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Пользователь с email " + email + " не найден"));

            if (isExists(oldPersonTeams, email)){
                continue;
            }

            var personTeam = mapPersonTeam(person, team, false);
            System.out.println("ДОБАВЛЕНИЕ: " + personTeam.getPerson().getEmail());
            personTeamRepository.save(personTeam);
        }

        return mapTeamDTO(team);
    }

    public boolean isExists(List<PersonTeam> teams, String email) {
        for (var team : teams) {
            if (team.getPerson().getEmail().equals(email)){
                return true;
            }
        }

        return false;
    }

    @Transactional
    public void deleteTeam(int id){
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        checkRights(team);
        teamRepository.delete(team);
    }

    public void checkRights(Team team){
        var admin = getAdminPerson(team);
        var activePerson = personService.getActivePerson();
        if (!admin.equals(activePerson)){
            throw new ForbiddenException("У вас недостаточно прав на выполнение этого действия.");
        }
    }

    public Person getAdminPerson(Team team){
        var personTeams = team.getPersonTeams();
        for(var personTeam : personTeams){
            if (personTeam.isAdmin()) {
                return personTeam.getPerson();
            }
        }
        return null;
    }

    public PersonTeam mapPersonTeam(Person person, Team team, boolean isAdmin){
        var personTeam = new PersonTeam();
        personTeam.setPerson(person);
        personTeam.setTeam(team);
        personTeam.setIsAdmin(isAdmin);
        return personTeam;
    }

    public TeamDTO mapTeamDTO(Team team) {
        var teamDTO = new TeamDTO();
        teamDTO.setId(team.getId());
        teamDTO.setTitle(team.getTitle());

        var personTeams = team.getPersonTeams();
        List<PersonDTO> personDTOs = new ArrayList<>();
        for(var personTeam : personTeams){
            var person = personTeam.getPerson();
            var personDTO = personService.mapToDTO(person);
            personDTOs.add(personDTO);
        }

        teamDTO.setPersons(personDTOs);
        return teamDTO;
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
                    teamDTOs.add(mapTeamDTO(team));
                }
            }
        }
        return teamDTOs;
    }
}
