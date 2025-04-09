package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.CardDTO;
import ru.project.BackendPortfolio.services.CardService;

import java.util.Map;

@RestController
@RequestMapping("/cards")
public class CardController {

    private final CardService cardService;

    @Autowired
    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createCard(@RequestBody CardDTO cardDTO) {
        var card = cardService.create(cardDTO);
        var newCardDTO = cardService.mapToDTO(card);
        return ResponseEntity.ok(Map.of(
                "message", "Карточка успешно создана",
                "card", newCardDTO));
    }

    @GetMapping("/show")
    public ResponseEntity<?> showCards(){
        var cardDTOs = cardService.getAllCardsByPerson();
        return ResponseEntity.ok(Map.of("cards", cardDTOs));
    }
}
