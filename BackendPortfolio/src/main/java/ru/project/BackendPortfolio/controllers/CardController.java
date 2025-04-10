package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
    public ResponseEntity<?> createCard(@ModelAttribute CardDTO cardDTO) {
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

    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProjectWithFile(@PathVariable int id, @ModelAttribute CardDTO cardDTO) {
        var updatedCardDTO = cardService.update(id, cardDTO);
        return ResponseEntity.ok(Map.of(
            "message", "Карточка успешно обновлена",
            "card", updatedCardDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCard(@PathVariable int id) {
        cardService.delete(id);
        return ResponseEntity.ok(Map.of(
                "message", "Карточка успешно удалена вместе с файлами"
        ));
    }
}
