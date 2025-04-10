package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class CardDTO {

    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    @NotEmpty(message = "Описание не должно быть пустым")
    private String description;

    private List<String> links;

    private List<CardFileDTO> cardFiles;


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
