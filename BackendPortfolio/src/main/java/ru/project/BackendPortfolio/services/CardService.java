package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CardDTO;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.dto.to_share.PublicCardDTO;
import ru.project.BackendPortfolio.mappers.TeamMapper;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.models.Project;
import ru.project.BackendPortfolio.models.ProjectCard;
import ru.project.BackendPortfolio.repositories.CardRepository;
import ru.project.BackendPortfolio.repositories.PersonTeamRepository;
import ru.project.BackendPortfolio.repositories.ProjectCardRepository;
import ru.project.BackendPortfolio.repositories.TeamRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CardService {

    private final CardFileService cardFileService;
    private final CardRepository cardRepository;
    private final ProjectCardRepository projectCardRepository;
    private final ModelMapper modelMapper;
    private final PersonService personService;
    private final CardLinkService cardLinkService;
    private final ProjectService projectService;
    private final TeamRepository teamRepository;
    private final PersonTeamRepository personTeamRepository;
    private final TeamMapper teamMapper;

    @Autowired
    public CardService(CardFileService cardFileService, CardRepository cardRepository,
                       ProjectCardRepository projectCardRepository, ModelMapper modelMapper,
                       PersonService personService, CardLinkService cardLinkService,
                       ProjectService projectService, TeamRepository teamRepository,
                       PersonTeamRepository personTeamRepository, TeamMapper teamMapper) {
        this.cardFileService = cardFileService;
        this.cardRepository = cardRepository;
        this.projectCardRepository = projectCardRepository;
        this.modelMapper = modelMapper;
        this.personService = personService;
        this.cardLinkService = cardLinkService;
        this.projectService = projectService;
        this.teamRepository = teamRepository;
        this.personTeamRepository = personTeamRepository;
        this.teamMapper = teamMapper;
    }

    @Transactional
    public CardDTO createByTeam(CardDTO cardDTO){
        var teamId = cardDTO.getTeamId();
        var team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Команда не найдена"));
        var card = new Card();
        card.setTitle(cardDTO.getTitle());
        card.setDescription(cardDTO.getDescription());
        card.setTeam(team);
        cardRepository.save(card);
        var result = create(card, cardDTO);
        return mapToDTO(result);
    }

    @Transactional
    public CardDTO createByPerson(CardDTO cardDTO) {
        var person = personService.getActivePerson();
        var card = new Card();
        card.setTitle(cardDTO.getTitle());
        card.setDescription(cardDTO.getDescription());
        card.setOwner(person);
        cardRepository.save(card);
        var result = create(card, cardDTO);
        return mapToDTO(result);
    }

    @Transactional
    public Card create(Card card, CardDTO cardDTO){

        var token = UUID.randomUUID().toString();
        card.setShareToken(token);
        card.setPublic(true);

        card = cardRepository.save(card);
        var cardFileDTOs = cardDTO.getCardFiles();
        if (cardFileDTOs != null) {
            for (var cardFileDTO : cardFileDTOs) {
                cardFileService.create(cardFileDTO, card);
            }
        }

        var cardLinkDTOs = cardDTO.getCardLinks();
        if (cardLinkDTOs != null) {
            for (var cardLinkDTO : cardLinkDTOs) {
                cardLinkService.create(cardLinkDTO, card);
            }
        }

        var projectDTOs = cardDTO.getProjects();
        List<ProjectCard> projectCards = new ArrayList<>();
        if (projectDTOs != null) {
            for (var projectDTO : projectDTOs) {
                var projectId = projectDTO.getId();
                var project = projectService.getProjectById(projectId);
                var projectCard = mapProjectCard(project, card);
                projectCards.add(projectCard);
                projectCardRepository.save(projectCard);
            }
        }

        card.setProjectCards(projectCards);
        return card;
    }

    public ProjectCard mapProjectCard(Project project, Card card) {
        var projectCard = new ProjectCard();
        projectCard.setProject(project);
        projectCard.setCard(card);
        return projectCard;
    }

    public CardDTO getCardDTOById(int id){
        var card = getCardById(id);
        return mapToDTO(card);
    }

    public List<CardDTO> getAllCardsByPerson(){
        var person = personService.getActivePerson();
        var cards = cardRepository.findByOwner(person);
        List<CardDTO> cardDTOs = new ArrayList<>();
        cards.forEach(card -> cardDTOs.add(mapToDTO(card)));
        return cardDTOs;
    }

    public List<CardDTO> getAllCardsByTeam(int id) {
        var cards = cardRepository.findByTeamId(id);
        List<CardDTO> cardDTOs = new ArrayList<>();
        cards.forEach(card -> cardDTOs.add(mapToDTO(card)));
        return cardDTOs;
    }

    @Transactional
    public CardDTO update(int id, CardDTO cardDTO) {
        var card = getCardById(id);
        card.setTitle(cardDTO.getTitle());
        card.setDescription(cardDTO.getDescription());

        var oldLinks = card.getCardLinks();
        if (oldLinks != null) {
            for (var oldLink : oldLinks) {
                cardLinkService.delete(oldLink);
            }
        }

        var projectCards = card.getProjectCards();
        projectCards.clear();
        var projectDTOs = cardDTO.getProjects();
        if (projectDTOs != null) {
            for (var projectDTO : projectDTOs) {
                var project = projectService.getProjectById(projectDTO.getId());
                var projectCard = mapProjectCard(project, card);
                projectCards.add(projectCard);
            }
        }

        var newLinks = cardDTO.getCardLinks();
        if (newLinks != null) {
            for (var newCardLinkDTO : newLinks) {
                cardLinkService.create(newCardLinkDTO, card);
            }
        }

        cardFileService.update(card, cardDTO.getCardFiles());
        cardRepository.save(card);
        return mapToDTO(card);
    }


    @Transactional
    public void delete(int id) {
        var card = getCardById(id);
        var cardFiles = card.getCardFiles();
        if (cardFiles != null) {
            for (var cardFile : cardFiles) {
                cardFileService.delete(cardFile);
            }
        }

        cardRepository.delete(card);
    }

    public List<CardDTO> getAllTeamsCards(int id){
        var person = personService.getPersonById(id);
        var personTeams = personTeamRepository.findByPerson(person);
        List<CardDTO> cardDTOs = new ArrayList<>();
        for(var personTeam : personTeams){
            var team = personTeam.getTeam();
            var teamCards = team.getCards();
            for(var teamCard : teamCards){
                cardDTOs.add(mapToDTO(teamCard));
            }
        }
        return cardDTOs;
    }

    public CardDTO mapToDTO(Card card){
        var cardDTO = modelMapper.map(card, CardDTO.class);

        var projectCards = card.getProjectCards();
        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for(var projectCard : projectCards) {
            var project = projectCard.getProject();
            var projectDTO = modelMapper.map(project, ProjectDTO.class);
            projectDTOs.add(projectDTO);
        }

        cardDTO.setProjects(projectDTOs);

        return cardDTO;
    }

    public PublicCardDTO mapToPublicDTO(Card card){
        var publicCardDTO = modelMapper.map(card, PublicCardDTO.class);
        var projectCards = card.getProjectCards();
        List<ProjectDTO> projectDTOs = new ArrayList<>();
        for(var projectCard : projectCards) {
            var project = projectCard.getProject();
            var projectDTO = modelMapper.map(project, ProjectDTO.class);
            projectDTOs.add(projectDTO);
        }

        publicCardDTO.setProjects(projectDTOs);

        var owner = card.getOwner();
        if (card.getOwner() != null) {
            var publicPersonDTO = personService.mapToPublicDTO(owner);
            publicCardDTO.setPublicPerson(publicPersonDTO);
        }

        var team = card.getTeam();
        if (card.getTeam() != null) {
            var teamDTO = teamMapper.mapTeamDTO(team);
            publicCardDTO.setTeam(teamDTO);
        }

        return publicCardDTO;
    }

    public Card getCardById(int id){
        return cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Карточка не найдена"));
    }
}
