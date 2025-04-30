package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CardDTO;
import ru.project.BackendPortfolio.exceptions.ForbiddenException;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.repositories.CardRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class CardService {

    private final CardFileService cardFileService;
    private final CardRepository cardRepository;
    private final ModelMapper modelMapper;
    private final PersonService personService;
    private final CardLinkService cardLinkService;

    @Autowired
    public CardService(CardFileService cardFileService, CardRepository cardRepository,
                       ModelMapper modelMapper, PersonService personService, CardLinkService cardLinkService) {
        this.cardFileService = cardFileService;
        this.cardRepository = cardRepository;
        this.modelMapper = modelMapper;
        this.personService = personService;
        this.cardLinkService = cardLinkService;
    }

    @Transactional
    public Card create(CardDTO cardDTO){
        var person = personService.getActivePerson();
        var card = modelMapper.map(cardDTO, Card.class);
        card.setOwner(person);
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

        return card;
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

    @Transactional
    public CardDTO update(int id, CardDTO cardDTO) {
        var person = personService.getActivePerson();
        var card = getCardById(id);

        if (!card.getOwner().equals(person)) {
            throw new ForbiddenException("Вы не можете редактировать чужие карточки");
        }


        card.setTitle(cardDTO.getTitle());
        card.setDescription(cardDTO.getDescription());

        var oldLinks = card.getCardLinks();
        var newLinks = cardDTO.getCardLinks();

        if (oldLinks != null) {
            for(var oldLink : oldLinks) {
                cardLinkService.delete(oldLink);
            }
        }

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
        var person = personService.getActivePerson();
        var card = getCardById(id);

        if (!card.getOwner().equals(person)) {
            throw new ForbiddenException("Вы не можете удалять чужие карточки");
        }

        var cardFiles = card.getCardFiles();
        if (cardFiles != null) {
            for (var cardFile : cardFiles) {
                cardFileService.delete(cardFile);
            }
        }

        cardRepository.delete(card);
    }

    public CardDTO mapToDTO(Card card){
        return modelMapper.map(card, CardDTO.class);
    }

    public Card getCardById(int id){
        return cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Карточка не найдена"));
    }
}
