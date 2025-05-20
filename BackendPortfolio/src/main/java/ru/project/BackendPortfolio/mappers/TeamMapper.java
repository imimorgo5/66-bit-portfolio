package ru.project.BackendPortfolio.mappers;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;
import ru.project.BackendPortfolio.dto.PersonTeamDTO;
import ru.project.BackendPortfolio.dto.TeamDTO;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.PersonTeam;
import ru.project.BackendPortfolio.models.Team;
import ru.project.BackendPortfolio.repositories.PeopleRepository;

import java.util.ArrayList;
import java.util.List;

@Component
public class TeamMapper {

    private final ModelMapper modelMapper;
    private final PeopleRepository peopleRepository;

    public TeamMapper(ModelMapper modelMapper, PeopleRepository peopleRepository) {
        this.modelMapper = modelMapper;
        this.peopleRepository = peopleRepository;
    }

    public PersonTeamDTO mapPersonTeamDTO(Person person, String role){
        var personTeamDTO = new PersonTeamDTO();
        personTeamDTO.setPersonId(person.getId());
        personTeamDTO.setUsername(person.getUsername());
        personTeamDTO.setEmail(person.getEmail());
        personTeamDTO.setRole(role);
        personTeamDTO.setImageName(person.getImageName());
        System.out.println("Image name: " + person.getImageName());
        return personTeamDTO;
    }

    public PersonTeam mapPersonTeam(Team team, PersonTeamDTO personTeamDTO){
        var personTeam = new PersonTeam();
        var email = personTeamDTO.getEmail();
        var person = peopleRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Пользователь с email " + email + " не найден"));
        personTeam.setPerson(person);
        personTeam.setTeam(team);
        personTeam.setRole(personTeamDTO.getRole());
        return personTeam;
    }

    public TeamDTO mapTeamDTO(Team team){
        var teamDTO = modelMapper.map(team, TeamDTO.class);
        var personTeams = team.getPersonTeams();
        List<PersonTeamDTO> personTeamDTOs = new ArrayList<>();
        for (var personTeam : personTeams) {
            var person = personTeam.getPerson();
            var personTeamDTO = new PersonTeamDTO();
            personTeamDTO.setPersonId(person.getId());
            personTeamDTO.setEmail(person.getEmail());
            personTeamDTO.setUsername(person.getUsername());
            personTeamDTO.setRole(personTeam.getRole());
            personTeamDTO.setImageName(person.getImageName());
            System.out.println("Image name: " + person.getImageName());
            personTeamDTOs.add(personTeamDTO);
        }
        teamDTO.setPersons(personTeamDTOs);
        return teamDTO;
    }
}
