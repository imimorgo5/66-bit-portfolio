package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CreateTeamDTO;
import ru.project.BackendPortfolio.dto.TeamDTO;
import ru.project.BackendPortfolio.exceptions.ForbiddenException;
import ru.project.BackendPortfolio.mappers.TeamMapper;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.PersonTeam;
import ru.project.BackendPortfolio.models.Team;
import ru.project.BackendPortfolio.repositories.PeopleRepository;
import ru.project.BackendPortfolio.repositories.PersonTeamRepository;
import ru.project.BackendPortfolio.repositories.TeamRepository;

import java.util.*;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final PersonTeamRepository personTeamRepository;
    private final PersonService personService;
    private final TeamMapper teamMapper;
    private final NotificationService notificationService;
    private final PeopleRepository personRepository;

    @Autowired
    public TeamService(TeamRepository teamRepository, PersonTeamRepository personTeamRepository,
                       PersonService personService, TeamMapper teamMapper, NotificationService notificationService, PeopleRepository personRepository) {
        this.teamRepository = teamRepository;
        this.personTeamRepository = personTeamRepository;
        this.personService = personService;
        this.teamMapper = teamMapper;
        this.notificationService = notificationService;
        this.personRepository = personRepository;
    }

    @Transactional
    public TeamDTO createTeam(CreateTeamDTO createTeamDTO) {
        var creator = personService.getActivePerson();
        var team = new Team();
        team.setTitle(createTeamDTO.getTitle());
        team.setAdminId(creator.getId());
        teamRepository.save(team);
        var members = createTeamDTO.getPersons();
        for(var member : members) {
            var personTeam = teamMapper.mapPersonTeam(team, member);
            var person = personTeam.getPerson();
            notificationService.sendInvitation(person, team, creator.getUsername(), member.getRole());
        }

        var creatorDTO = teamMapper.mapPersonTeamDTO(creator, createTeamDTO.getMyRole());
        var personTeam = teamMapper.mapPersonTeam(team, creatorDTO);
        personTeamRepository.save(personTeam);

        return teamMapper.mapTeamDTO(team);
    }

    public TeamDTO getTeamDTOById(int id){
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        return teamMapper.mapTeamDTO(team);
    }

    public Team getTeamById(int id){
        return teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
    }

    @Transactional
    public void updateTeam(int teamId, CreateTeamDTO createTeamDTO) {
        var updater = personService.getActivePerson(); // текущий пользователь (админ)
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        team.setTitle(createTeamDTO.getTitle());

        List<PersonTeam> currentMembers = team.getPersonTeams();
        Map<String, PersonTeam> currentMap = new HashMap<>();
        for (var pt : currentMembers) {
            currentMap.put(pt.getPerson().getEmail(), pt);
        }

        List<PersonTeam> updatedMembers = new ArrayList<>();

        for (var personTeamDTO : createTeamDTO.getPersons()) {
            var person = personRepository.findByEmail(personTeamDTO.getEmail())
                    .orElseThrow(() -> new RuntimeException(
                            "Пользователь с почтой " + personTeamDTO.getEmail() + " не найден"));

            var existing = currentMap.remove(person.getEmail());
            if (existing != null) {
                existing.setRole(personTeamDTO.getRole());
                updatedMembers.add(existing);
            } else {
                notificationService.sendInvitation(
                        person,
                        team,
                        updater.getUsername(),
                        personTeamDTO.getRole()
                );
            }
        }

        var adminPT = currentMembers.stream()
                .filter(pt -> pt.getPerson().getId() == (team.getAdminId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Admin not found in team"));

        adminPT.setRole(createTeamDTO.getMyRole());
        adminPT.setIsAdmin(true); // на всякий случай
        updatedMembers.add(adminPT);

        team.getPersonTeams().clear();
        team.getPersonTeams().addAll(updatedMembers);

        teamRepository.save(team);
    }

    @Transactional
    public void deleteTeam(int id){
        var team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Команда с таким ID не найдена"));
        checkRights(team);
        notificationService.deleteAllByTeam(team);
        teamRepository.delete(team);
    }

    public void checkRights(Team team){
        var adminId = team.getAdminId();
        var activePersonId = personService.getActivePerson().getId();
        if (adminId != activePersonId){
            throw new ForbiddenException("У вас недостаточно прав на выполнение этого действия.");
        }
    }

    @Transactional
    public void addPersonToTeam(Person person, Team team, String role){
        var personTeam = new PersonTeam();
        personTeam.setPerson(person);
        personTeam.setTeam(team);
        personTeam.setIsAdmin(false);
        personTeam.setRole(role);
        personTeamRepository.save(personTeam);
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
