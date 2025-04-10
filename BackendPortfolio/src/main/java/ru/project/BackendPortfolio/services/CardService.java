package ru.project.BackendPortfolio.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CardDTO;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.repositories.CardRepository;
import ru.project.BackendPortfolio.repositories.PeopleRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class CardService {

    private final CardFileService cardFileService;
    private final CardRepository cardRepository;
    private final PeopleRepository personRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CardService(CardFileService cardFileService, CardRepository cardRepository, PeopleRepository personRepository, ModelMapper modelMapper) {
        this.cardFileService = cardFileService;
        this.cardRepository = cardRepository;
        this.personRepository = personRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public Card create(CardDTO cardDTO){
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var person = personRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        var card = modelMapper.map(cardDTO, Card.class);
        card.setOwner(person);
        card = cardRepository.save(card);

        var cardFileDTOs = cardDTO.getCardFiles();
        if (cardFileDTOs != null) {
            for (var cardFileDTO : cardFileDTOs) {
                cardFileService.create(cardFileDTO, card);
            }
        }

        return card;
    }

    public List<CardDTO> getAllCardsByPerson(){
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var username = authentication.getName();
        var person = personRepository.findByUsername(username);
        var cards = cardRepository.findByOwner(person.get());
        List<CardDTO> cardDTOs = new ArrayList<>();
        cards.forEach(card -> cardDTOs.add(mapToDTO(card)));
        return cardDTOs;
    }

    @Transactional
    public CardDTO update(int id, CardDTO cardDTO) {
        var card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Карточка не найдена"));
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var person = personRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!card.getOwner().equals(person)) {
            throw new RuntimeException("Вы не можете редактировать чужие карточки");
        }

        card.setTitle(cardDTO.getTitle());
        card.setDescription(cardDTO.getDescription());
        card.setLinks(cardDTO.getLinks());
        cardFileService.update(card, cardDTO.getCardFiles());
        cardRepository.save(card);
        return mapToDTO(card);
    }

    @Transactional
    public void delete(int id) {
        var card = cardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Карточка не найдена"));
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var person = personRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (!card.getOwner().equals(person)) {
            throw new RuntimeException("Вы не можете удалять чужие карточки");
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
}
