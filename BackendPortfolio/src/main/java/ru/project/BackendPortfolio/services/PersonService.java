package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.*;
import ru.project.BackendPortfolio.dto.to_share.PublicPersonDTO;
import ru.project.BackendPortfolio.exceptions.ForbiddenException;
import ru.project.BackendPortfolio.exceptions.RegistrationException;
import ru.project.BackendPortfolio.models.Link;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.repositories.PeopleRepository;
import ru.project.BackendPortfolio.security.PersonDetails;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PersonService {

    private final PeopleRepository peopleRepository;
    private final FileStorageService fileStorageService;
    private final ModelMapper modelMapper;

    @Autowired
    public PersonService(PeopleRepository peopleRepository, FileStorageService fileStorageService, ModelMapper modelMapper) {
        this.peopleRepository = peopleRepository;
        this.fileStorageService = fileStorageService;
        this.modelMapper = modelMapper;
    }

    public Person getActivePerson() {
        var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof PersonDetails personDetails) {
            return peopleRepository.findById(personDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        }

        throw new RuntimeException("Пользователь не авторизован");
    }

    public PersonDTO getPersonDTOById(int id) {
        var person = peopleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        return mapToDTO(person);
    }

    public Person getPersonById(int id) {
        return peopleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
    }


    @Transactional
    public Person updateProfile(int personId, PersonDTO personDTO) {
        var person = peopleRepository.findById(personId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        var currentPerson = getActivePerson();
        if (!person.equals(currentPerson)) {
            throw new ForbiddenException("Вы не можете редактировать чужой профиль.");
        }

        var newUsername = personDTO.getUsername();
        if (newUsername != null) {
            person.setUsername(newUsername);
        }

        if (personDTO.getPhoneNumber() != null) {
            person.setPhoneNumber(personDTO.getPhoneNumber());
        }

        if (personDTO.getImageFile() != null) {
            var fileName = fileStorageService.save(personDTO.getImageFile());
            person.setImageName(fileName);
        }

        var currentEmail = person.getEmail();
        var newEmail = personDTO.getEmail();
        if (newEmail != null && !newEmail.equals(currentEmail)) {
            if (peopleRepository.findByEmail(newEmail).isPresent()){
                throw new RegistrationException("Пользователь с таким email уже существует");
            }
            person.setEmail(newEmail);
        }

        if (personDTO.getBirthDate() != null && !personDTO.getBirthDate().isBlank()) {
            try {
                var formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
                var parsedDate = LocalDate.parse(personDTO.getBirthDate(), formatter);
                person.setBirthDate(parsedDate);
            } catch (DateTimeParseException e) {
                throw new RuntimeException("Неверный формат даты рождения. Ожидается формат: дд.ММ.гггг");
            }
        }

        if (personDTO.getLinkDTOs() != null) {
            person.getLinks().clear();
            for (var linkDTO : personDTO.getLinkDTOs()) {
                var link = modelMapper.map(linkDTO, Link.class);
                link.setPerson(person);
                person.getLinks().add(link);
            }
        }

        return peopleRepository.save(person);
    }

    public PersonDTO getActivePersonDTO() {
        var person = getActivePerson();
        return mapToDTO(person);
    }

    public List<PersonDTO> getAllPersonDTO() {
        var persons = peopleRepository.findAll();
        List<PersonDTO> personDTOs = new ArrayList<>();
        for(var person : persons) {
            personDTOs.add(mapToDTO(person));
        }
        return personDTOs;
    }

    public PublicPersonDTO mapToPublicDTO(Person person) {
        var publicPersonDTO = modelMapper.map(person, PublicPersonDTO.class);
        List<LinkDTO> linkDTOs = new ArrayList<>();
        for(var link : person.getLinks()) {
            var linkDTO = modelMapper.map(link, LinkDTO.class);
            linkDTOs.add(linkDTO);
        }
        publicPersonDTO.setLinkDTOs(linkDTOs);
        return publicPersonDTO;
    }

    public PersonDTO mapToDTO(Person person) {
        var personDTO = modelMapper.map(person, PersonDTO.class);
        personDTO.setPassword("No");

        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for(var project : person.getProjects()) {
            var projectDTO = modelMapper.map(project, ProjectDTO.class);
            projectDTOs.add(projectDTO);

        }
        personDTO.setProjectDTOs(projectDTOs);

        List<CardDTO> cardDTOs = new ArrayList<>();
        for(var card : person.getCards()) {
            var cardDTO = modelMapper.map(card, CardDTO.class);
            List<CardFileDTO> cardFileDTOs = new ArrayList<>();
            for(var cardFile : card.getCardFiles()) {
                var cardFileDTO = modelMapper.map(cardFile, CardFileDTO.class);
                cardFileDTOs.add(cardFileDTO);
            }
            cardDTO.setCardFiles(cardFileDTOs);
            cardDTOs.add(cardDTO);
        }
        personDTO.setCardDTOs(cardDTOs);

        List<LinkDTO> linkDTOs = new ArrayList<>();
        for(var link : person.getLinks()) {
            var linkDTO = modelMapper.map(link, LinkDTO.class);
            linkDTOs.add(linkDTO);
        }
        personDTO.setLinkDTOs(linkDTOs);

        return personDTO;
    }
}
