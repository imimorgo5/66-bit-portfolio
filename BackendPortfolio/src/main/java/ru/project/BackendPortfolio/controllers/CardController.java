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

    // Создание карточки от имени пользователя (автоматически подставляет авторизованного пользователя)
    @PostMapping("/create-by-person")
    public ResponseEntity<?> createCardByPerson(@ModelAttribute CardDTO cardDTO) {
        var newCardDTO = cardService.createByPerson(cardDTO);
        return ResponseEntity.ok(Map.of("card", newCardDTO));
    }

    // Создание карточки от имени команды (необходимо передавать teamId для корректного формирования связи)
    @PostMapping("/create-by-team")
    public ResponseEntity<?> createCardByTeam(@ModelAttribute CardDTO cardDTO) {
        var newCardDTO = cardService.createByTeam(cardDTO);
        return ResponseEntity.ok(Map.of("card", newCardDTO));
    }

    // Получение командных карточек по id команды
    @GetMapping("/show-by-team/{id}")
    public ResponseEntity<?> getByTeam(@PathVariable("id") int id){
        var cardDTOs = cardService.getAllCardsByTeam(id);
        return ResponseEntity.ok(Map.of("cards", cardDTOs));
    }

    // Получение карточек текущего пользователя
    @GetMapping("/show-by-person")
    public ResponseEntity<?> getByPerson(){
        var cardDTOs = cardService.getAllCardsByPerson();
        return ResponseEntity.ok(Map.of("cards", cardDTOs));
    }

    // Получение карточки по id
    @GetMapping("/card/{id}")
    public ResponseEntity<?> getCardById(@PathVariable("id") int id) {
        var cardDTO = cardService.getCardDTOById(id);
        return ResponseEntity.ok(Map.of("card", cardDTO));
    }

    // Обновление карточки (независимо от того, командная она или пользовательская)
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProjectWithFile(@PathVariable("id") int id, @ModelAttribute CardDTO cardDTO) {
        var updatedCardDTO = cardService.update(id, cardDTO);
        return ResponseEntity.ok(Map.of("card", updatedCardDTO));
    }

    // Удаление карточки
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCard(@PathVariable("id") int id) {
        cardService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Карточка успешно удалена вместе с файлами"));
    }
}
