package ru.project.BackendPortfolio.dto.to_share;

import jakarta.validation.constraints.NotEmpty;
import ru.project.BackendPortfolio.dto.CardFileDTO;
import ru.project.BackendPortfolio.dto.CardLinkDTO;
import ru.project.BackendPortfolio.dto.ProjectDTO;
import ru.project.BackendPortfolio.dto.TeamDTO;

import java.time.LocalDateTime;
import java.util.List;

public class PublicCardDTO {

    private int id;

    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    private String description;

    private String shareToken;

    private List<ProjectDTO> projects;

    private List<CardLinkDTO> cardLinks;

    private List<CardFileDTO> cardFiles;

    private LocalDateTime createdAt;

    private PublicPersonDTO publicPerson;

    private TeamDTO team;

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public @NotEmpty(message = "Название не должно быть пустым") String getTitle() {
        return title;
    }

    public void setTitle(@NotEmpty(message = "Название не должно быть пустым") String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<CardFileDTO> getCardFiles() {
        return cardFiles;
    }

    public void setCardFiles(List<CardFileDTO> cardFiles) {
        this.cardFiles = cardFiles;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PublicPersonDTO getPublicPerson() {
        return publicPerson;
    }

    public void setPublicPerson(PublicPersonDTO publicPerson) {
        this.publicPerson = publicPerson;
    }
}
