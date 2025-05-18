package ru.project.BackendPortfolio.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.services.NotificationService;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // Возвращает все уведомления
    @GetMapping("/show-all")
    public ResponseEntity<?> getAllNotifications() {
        var notificationDTOs = notificationService.getAllNotifications();
        return ResponseEntity.ok(Map.of("notifications", notificationDTOs));
    }

    // Возвращает непрочитанные уведомления
    @GetMapping("/show-unread")
    public ResponseEntity<?> getUnreadNotifications() {
        var notificationDTOs = notificationService.getUnreadNotifications();
        return ResponseEntity.ok(Map.of("notifications", notificationDTOs));
    }

    // Возвращает уведомление по id
    @GetMapping("/show/{id}")
    public ResponseEntity<?> getNotificationById(@PathVariable("id") int id) {
        var notificationDTO = notificationService.getById(id);
        return ResponseEntity.ok(Map.of("notifications", notificationDTO));
    }

    // Принятие приглашения в команду (без тела запроса, просто требуется POST-запрос по ссылке)
    @PostMapping("/{id}/accept")
    public ResponseEntity<?> accept(@PathVariable("id") int id){
        notificationService.acceptInvitation(id);
        return ResponseEntity.ok(Map.of("message", "Поздравляем, теперь вы в команде"));
    }

    // Отказ от приглашения в команду (без тела запроса, просто требуется POST-запрос по ссылке)
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable("id") int id){
        notificationService.rejectInvitation(id);
        return ResponseEntity.ok(Map.of("message", "Вы не будете добавлены в команду"));
    }
}

