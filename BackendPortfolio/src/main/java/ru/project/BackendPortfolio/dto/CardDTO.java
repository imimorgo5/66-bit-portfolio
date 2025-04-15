package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;
import java.util.List;

public class CardDTO {

    private int id;

    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    @NotEmpty(message = "Описание не должно быть пустым")
    private String description;

    private List<String> links;

    private List<CardFileDTO> cardFiles;

    private LocalDateTime createdAt;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public @NotEmpty(message = "Название не должно быть пустым") String getTitle() {
        return title;
    }

    public @NotEmpty(message = "Описание не должно быть пустым") String getDescription() {
        return description;
    }

    public void setTitle(@NotEmpty(message = "Название не должно быть пустым") String title) {
        this.title = title;
    }

    public void setDescription(@NotEmpty(message = "Описание не должно быть пустым") String description) {
        this.description = description;
    }

    public List<String> getLinks() {
        return links;
    }

    public void setLinks(List<String> links) {
        this.links = links;
    }

    public List<CardFileDTO> getCardFiles() {
        return cardFiles;
    }

    public void setCardFiles(List<CardFileDTO> cardFiles) {
        this.cardFiles = cardFiles;
    }
}
