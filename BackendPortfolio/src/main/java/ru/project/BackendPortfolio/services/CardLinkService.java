package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CardLinkDTO;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.models.CardLink;
import ru.project.BackendPortfolio.repositories.CardLinkRepository;

@Service
public class CardLinkService {

    private final CardLinkRepository cardLinkRepository;

    @Autowired
    public CardLinkService(CardLinkRepository cardLinkRepository) {
        this.cardLinkRepository = cardLinkRepository;
    }

    @Transactional
    public CardLink create(CardLinkDTO cardLinkDTO, Card card){
       var cardLink = new CardLink();
       cardLink.setCard(card);
       cardLink.setDescription(cardLinkDTO.getDescription());
       cardLink.setLink(cardLinkDTO.getLink());
       return cardLinkRepository.save(cardLink);
    }

    @Transactional
    public void delete(CardLink cardLink){
        cardLinkRepository.delete(cardLink);
    }
}
