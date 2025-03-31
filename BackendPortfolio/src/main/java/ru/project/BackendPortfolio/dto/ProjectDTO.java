package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class ProjectDTO {

    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    @NotEmpty(message = "Название не должно быть пустым")
    private String description;

    private MultipartFile image;
}
