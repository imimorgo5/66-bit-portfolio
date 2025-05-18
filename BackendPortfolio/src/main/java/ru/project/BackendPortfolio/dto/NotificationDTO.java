package ru.project.BackendPortfolio.dto;

import java.time.LocalDateTime;

public class NotificationDTO {

    private int id;

    private String message;

//    private NotificationType type;

//    private boolean read;
//
//    private boolean accepted;

    private LocalDateTime createdAt;

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
