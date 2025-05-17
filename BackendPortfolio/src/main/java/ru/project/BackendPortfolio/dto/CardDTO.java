package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.NotEmpty;

import java.time.LocalDateTime;
import java.util.List;

public class CardDTO {

    private int id;

    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    private String description;

    private String shareToken;

    // Проекты
    private List<ProjectDTO> projects;

    private List<CardLinkDTO> cardLinks;

    private List<CardFileDTO> cardFiles;

    private LocalDateTime createdAt;

    private Integer teamId;

    // Геттеры и сеттеры проектов


    public int getTeamId() {
        return teamId;
    }

    public void setTeamId(int teamId) {
        this.teamId = teamId;
    }

    public String getShareToken() {
        return shareToken;
    }

    public void setShareToken(String shareToken) {
        this.shareToken = shareToken;
    }

    public List<ProjectDTO> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectDTO> projects) {
        this.projects = projects;
    }

    public List<CardLinkDTO> getCardLinks() {
        return cardLinks;
    }

    public void setCardLinks(List<CardLinkDTO> cardLinks) {
        this.cardLinks = cardLinks;
    }

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

    public String getDescription() {
        return description;
    }

    public void setTitle(@NotEmpty(message = "Название не должно быть пустым") String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<CardFileDTO> getCardFiles() {
        return cardFiles;
    }

    public void setCardFiles(List<CardFileDTO> cardFiles) {
        this.cardFiles = cardFiles;
    }
}
