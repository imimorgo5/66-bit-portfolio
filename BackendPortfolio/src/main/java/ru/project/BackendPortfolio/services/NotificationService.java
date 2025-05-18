package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.NotificationDTO;
import ru.project.BackendPortfolio.enums.NotificationType;
import ru.project.BackendPortfolio.models.Notification;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.Team;
import ru.project.BackendPortfolio.repositories.NotificationRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final PersonService personService;
    private final TeamService teamService;


    @Autowired
    public NotificationService(NotificationRepository notificationRepository,
                               PersonService personService,
                               @Lazy TeamService teamService) {
        this.notificationRepository = notificationRepository;
        this.personService = personService;
        this.teamService = teamService;
    }

    @Transactional
    public void sendInvitation(Person person, Team team, String creatorName, String role){
        var notification = new Notification();
        notification.setMessage(String.format(
                "Пользователь %s пригласил вас в команду «%s». Ваша будущая роль: %s",
                creatorName, team.getTitle(), role));

        notification.setType(NotificationType.TEAM_INVITATION);
        notification.setRead(false);
        notification.setAccepted(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setPerson(person);
        notification.setTeam(team);
        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getAllNotifications(){
        var person = personService.getActivePerson();
        var notifications = person.getNotifications();

        List<NotificationDTO> notificationDTOs = new ArrayList<>();
        for (var notification : notifications) {
            var notificationDTO = mapToDTO(notification);
            notificationDTOs.add(notificationDTO);
        }
        return notificationDTOs;
    }

    public List<NotificationDTO> getUnreadNotifications(){
        var person = personService.getActivePerson();
        var notifications = person.getNotifications();
        List<NotificationDTO> notificationDTOs = new ArrayList<>();
        for (var notification : notifications) {
            if (!notification.isRead()) {
                var notificationDTO = mapToDTO(notification);
                notificationDTOs.add(notificationDTO);
            }
        }
        return notificationDTOs;
    }

    @Transactional
    public void acceptInvitation(int id){
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Уведомление с таким id не найдено"));
        notification.setRead(true);
        notification.setAccepted(true);
        var team = notification.getTeam();
        var person = notification.getPerson();

        // Добавление роли
        var message = notification.getMessage();
        var role = "";
        var marker = "Ваша будущая роль:";
        var index = message.indexOf(marker);
        if (index != -1) {
            role = message.substring(index + marker.length()).trim();
        }

        teamService.addPersonToTeam(person, team, role);
    }

    public NotificationDTO getById(int id){
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Уведомление с таким id не найдено"));
        return mapToDTO(notification);
    }

    @Transactional
    public void rejectInvitation(int id){
        var notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Уведомление с таким id не найдено"));
        notification.setRead(true);
        notification.setAccepted(false);
        notificationRepository.save(notification);
    }

    public NotificationDTO mapToDTO(Notification notification){
        var notificationDTO = new NotificationDTO();
        notificationDTO.setId(notification.getId());
        notificationDTO.setMessage(notification.getMessage());
        notificationDTO.setCreatedAt(notification.getCreatedAt());
        return notificationDTO;
    }
}
