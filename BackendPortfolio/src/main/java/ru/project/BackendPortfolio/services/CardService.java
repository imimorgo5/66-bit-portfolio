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

    private final CardRepository cardRepository;
    private final PeopleRepository personRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CardService(CardRepository cardRepository, PeopleRepository personRepository, ModelMapper modelMapper) {
        this.cardRepository = cardRepository;
        this.personRepository = personRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public Card create(CardDTO cardDTO){
        var username = SecurityContextHolder.getContext().getAuthentication().getName();
        var person = personRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        Card card = modelMapper.map(cardDTO, Card.class);
        card.setOwner(person);
        return cardRepository.save(card);
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

    public CardDTO mapToDTO(Card card){
        return modelMapper.map(card, CardDTO.class);
    }
}
