package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.NotEmpty;

public class ProjectDTO {

    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    @NotEmpty(message = "Название не должно быть пустым")
    private String description;

    public @NotEmpty(message = "Название не должно быть пустым") String getTitle() {
        return title;
    }

    public void setTitle(@NotEmpty(message = "Название не должно быть пустым") String title) {
        this.title = title;
    }

    public @NotEmpty(message = "Название не должно быть пустым") String getDescription() {
        return description;
    }

    public void setDescription(@NotEmpty(message = "Название не должно быть пустым") String description) {
        this.description = description;
    }
}
