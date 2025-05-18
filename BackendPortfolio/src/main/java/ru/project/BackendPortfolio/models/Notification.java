package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;
import ru.project.BackendPortfolio.enums.NotificationType;

import java.time.LocalDateTime;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    private boolean read;

    private boolean accepted;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person person;

    @ManyToOne
    @JoinColumn(name = "team_id", referencedColumnName = "id")
    private Team team;

    public Notification(int id, String message, NotificationType type, boolean read,
                        boolean accepted, LocalDateTime createdAt, Person person, Team team) {
        this.id = id;
        this.message = message;
        this.type = type;
        this.read = read;
        this.accepted = accepted;
        this.createdAt = createdAt;
        this.person = person;
        this.team = team;
    }

    public Notification() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }

    public boolean isAccepted() {
        return accepted;
    }

    public void setAccepted(boolean accepted) {
        this.accepted = accepted;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person recipient) {
        this.person = recipient;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}
